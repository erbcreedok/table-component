import Box from '@mui/material/Box'
import React, {
	ChangeEvent,
	FC,
	KeyboardEvent,
	MouseEventHandler,
	useMemo,
	useRef,
	useState,
} from 'react'
import {
	IconButton,
	InputAdornment,
	outlinedInputClasses,
	Popper,
	styled,
	TextField,
	Typography,
} from '@mui/material'

import { Flex } from '../components/Flex'
import {
	Table_Column,
	Table_Header,
	Table_Row,
	TableData,
	TableInstance,
} from '../TableComponent'
import {
	Colors,
	DEFAULT_FONT_FAMILY,
	IconsColor,
	TextColor,
} from '../components/styles'
import { useDelay } from '../hooks/useDelay'
import { fillRowsWithParents } from '../utils/fillRowsWithParents'
import { getValueFromObj } from '../utils/getValueFromObj'
import { getPascalCase } from '../utils/getPascalCase'
import { withNativeEvent } from '../utils/withNativeEvent'
import { useOnClickOutside } from '../hooks/useOnClickOutside'

import { HeaderBase } from './HeaderBase'

type GetFilteredDataArgs<TData extends TableData> = {
	rows: Table_Row<TData>[]
	flatRows: Table_Row<TData>[]
	value: string
	path: string
}
type GetFilteredDataFn<TData extends TableData> = (
	args: GetFilteredDataArgs<TData>
) => Table_Row<TData>[]
type Props<TData extends TableData> = {
	column: Table_Column<TData>
	header: Table_Header<TData>
	table: TableInstance<TData>
	searchPath: string
	placeholder: string
	minLengthSearch?: number
	targetUnitId?: string
	getFilteredData?: GetFilteredDataFn<TData>
	keepSearchValueOnClickOutside?: boolean
	renderOption?: FC<HeaderSearchOptionProps<TData>>
}

const SearchInput = styled(TextField)`
	width: 100%;
	box-sizing: border-box;
	& .${outlinedInputClasses.root} {
		padding-left: 12px;
		padding-right: 12px;
		background: ${Colors.White};
	}
	& .${outlinedInputClasses.notchedOutline} {
		border-radius: 6px;
	}
	&
		.${outlinedInputClasses.root}.${outlinedInputClasses.focused}
		.${outlinedInputClasses.notchedOutline} {
		border-width: 1px;
		border-color: ${Colors.LightBlue};
		box-shadow: 0 0 0 3px ${Colors.LightestBlue};
	}
	& .${outlinedInputClasses.input} {
		padding: 9px 0;
		font-family: ${DEFAULT_FONT_FAMILY};
		font-size: 14px;
		line-height: 18px;
		color: ${TextColor.Primary};
	}
`

export type HeaderSearchOptionProps<TData extends TableData> = {
	item: TData
	searchPath: string
	input: string
	onClick: MouseEventHandler<HTMLElement>
}
const typographySx = {
	fontSize: 14,
	padding: '9px 12px',
	cursor: 'pointer',
	'&:hover': {
		backgroundColor: Colors.Gray20,
	},
}
export const HeaderSearchOptionDefault = <TData extends TableData>({
	searchPath,
	onClick,
	item,
}: HeaderSearchOptionProps<TData>) => (
	<Typography onClick={onClick} sx={typographySx}>
		{getValueFromObj(item, searchPath, '')}
	</Typography>
)

const getFlatFilteredData = <T extends TableData>({
	flatRows,
	value,
	path,
}: GetFilteredDataArgs<T>) => {
	return flatRows.filter((item) =>
		getValueFromObj(item.original, path, '')?.toLowerCase().includes(value)
	)
}

export const HeaderSearch = <T extends TableData>({
	column,
	table,
	searchPath,
	placeholder,
	minLengthSearch = 1,
	getFilteredData = getFlatFilteredData,
	keepSearchValueOnClickOutside,
	renderOption: Option = HeaderSearchOptionDefault,
}: Props<T>) => {
	const [showPopper, setShowPopper] = useState(false)
	const anchorElRef = useRef<HTMLDivElement>(null)
	const popperRef = useRef<HTMLDivElement>(null)

	const [isSearch, setIsSearch] = useState(false)
	const [input, setInput] = useState('')
	const searchValue = useDelay(input)
	const {
		options: {
			data,
			enableFlatSearch,
			icons: { SearchIcon, CloseIcon },
		},
	} = table

	const searchIcon = (
		<SearchIcon
			sx={{
				width: 18,
				height: 18,
			}}
		/>
	)

	const filtered = useMemo(() => {
		if (searchValue.length >= minLengthSearch) {
			const { flatRows, rows } = table.getCoreRowModel()

			return getFilteredData({
				flatRows: flatRows as Table_Row<T>[],
				rows: rows as Table_Row<T>[],
				value: searchValue.toLowerCase(),
				path: searchPath,
			})
		}

		return []
	}, [data, getFilteredData, minLengthSearch, searchPath, searchValue])

	const clearSearch = () => {
		setIsSearch(false)
		setInput('')
		setShowPopper(false)
		table.setSearchData(null)
	}

	const toggleSearch = (e) => {
		e.stopPropagation()
		if (isSearch) {
			clearSearch()
		} else {
			setIsSearch(true)
		}
	}

	const handleInputChange = (e) => {
		e.preventDefault()
		setInput(e.target.value)
		setShowPopper(true)
	}

	const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		if (event.key === 'Enter' && input.length > 0) {
			event.stopPropagation()
			table.setSearchData(
				enableFlatSearch
					? filtered.map((row) => ({
							...row,
							subRows: [],
							getCanExpand: () => false,
					  }))
					: fillRowsWithParents(filtered)
			)
			setShowPopper(false)
		} else {
			event.stopPropagation()
		}
	}

	const handleClickOutside = () => {
		if (keepSearchValueOnClickOutside) {
			setShowPopper(false)
		} else {
			clearSearch()
		}
	}

	useOnClickOutside([anchorElRef, popperRef], handleClickOutside)

	return (
		<Flex
			ref={anchorElRef}
			sx={{
				flexGrow: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				padding: isSearch ? '3px' : 0,
			}}
		>
			{isSearch ? (
				<>
					<SearchInput
						placeholder={placeholder}
						classes={{ root: 'search-input' }}
						InputProps={{
							onBlur: () => searchValue.length === 0 && clearSearch(),
							onFocus: () => searchValue.length > 0 && setShowPopper(true),
							startAdornment: (
								<InputAdornment
									position="start"
									sx={{ color: IconsColor.default }}
								>
									{searchIcon}
								</InputAdornment>
							),
							endAdornment: searchValue.length > 0 && (
								<InputAdornment position="end">
									<IconButton
										onClick={withNativeEvent(
											{
												el: `ColumnHeader_${getPascalCase(
													column.columnDef.header
												)}_Search_${isSearch ? 'Clear' : 'Open'}`,
												type: 'click',
											},
											table
										)(toggleSearch)}
										disableRipple
										sx={{ '&:hover svg': { color: IconsColor.active }, p: 0.5 }}
									>
										<CloseIcon
											style={{ width: 18, height: 18 }}
											htmlColor={IconsColor.default}
										/>
									</IconButton>
								</InputAdornment>
							),
						}}
						value={input}
						onChange={withNativeEvent<ChangeEvent<HTMLTextAreaElement>, T>(
							{
								el: `ColumnHeader_${getPascalCase(
									column.columnDef.header
								)}_Search`,
								type: 'keypress',
							},
							table
						)(handleInputChange)}
						onKeyDown={handleEnterKeyDown}
						onClick={(e) => e.stopPropagation()}
						autoFocus
					/>
					<Popper
						open={showPopper}
						anchorEl={anchorElRef.current}
						placement="bottom-start"
						ref={popperRef}
						sx={{
							zIndex: 2,
							borderRadius: '6px',
							width: anchorElRef.current?.clientWidth,
							backgroundColor: Colors.White,
							minWidth: 250,
							maxHeight: 200,
							overflowY: 'auto',
							filter:
								'drop-shadow(0px 2px 10px rgba(29, 30, 38, 0.1)) drop-shadow(0px 1px 2px rgba(29, 30, 38, 0.1))',
						}}
					>
						{searchValue.length >= minLengthSearch && !filtered.length && (
							<Typography sx={typographySx}>No options</Typography>
						)}
						{filtered.map((item) => (
							<Option
								key={item.id}
								item={item.original}
								searchPath={searchPath}
								input={input}
								onClick={(event) => {
									event.stopPropagation()
									setInput(getValueFromObj<string>(item, searchPath, input))
									table.setSearchData([item])
									setShowPopper(false)
								}}
							/>
						))}
					</Popper>
				</>
			) : (
				<Box>
					<HeaderBase column={column} />
				</Box>
			)}

			{!isSearch && (
				<IconButton
					disableRipple
					size="small"
					onClick={toggleSearch}
					sx={{
						color: IconsColor.default,
						'&:hover': { color: IconsColor.active },
					}}
				>
					{searchIcon}
				</IconButton>
			)}
		</Flex>
	)
}
