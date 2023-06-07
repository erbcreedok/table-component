import Box from '@mui/material/Box'
import React, { useEffect, useRef, useState } from 'react'
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
import { Table_Column, Table_Header, TableInstance } from '../TableComponent'
import {
	Colors,
	DEFAULT_FONT_FAMILY,
	IconsColor,
	Text,
} from '../components/styles'
import { useDelay } from '../hooks/useDelay'
import { getValueFromObj } from '../utils/getValueFromObj'

import { HeaderBase } from './HeaderBase'

type Props<TData extends Record<string, any>> = {
	column: Table_Column<TData>
	header: Table_Header<TData>
	table: TableInstance<TData>
	searchPath: string
	placeholder: string
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
		color: ${Text.Primary};
	}
`

export const HeaderSearch = <T extends Record<string, any>>({
	column,
	table,
	searchPath,
	placeholder,
}: Props<T>) => {
	const [showPopper, setShowPopper] = useState(false)
	const anchorElRef = useRef<HTMLDivElement>(null)
	const [isSearch, setIsSearch] = useState(false)
	const [input, setInput] = useState('')
	const [filtered, setFiltered] = useState<Record<string, any>>([])
	const searchValue = useDelay(input)
	const {
		options: {
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

	const clearSearch = () => {
		setIsSearch(false)
		setInput('')
		setFiltered([])
		setShowPopper(false)
		table.showSearchData(null)
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
		setInput(e.target.value.toLowerCase())
		setShowPopper(true)
	}

	useEffect(() => {
		if (searchValue.length >= 3) {
			setFiltered(
				table.options.data.filter((item) =>
					getValueFromObj(item, searchPath, '')
						?.toLowerCase()
						.includes(searchValue)
				)
			)
		} else {
			setFiltered([])
		}
	}, [searchValue])

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
										onClick={toggleSearch}
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
						onChange={handleInputChange}
						onClick={(e) => e.stopPropagation()}
						autoFocus
					/>
					<Popper
						open={showPopper}
						anchorEl={anchorElRef.current}
						placement="bottom-start"
						sx={{
							borderRadius: '6px',
							width: anchorElRef.current?.clientWidth,
							backgroundColor: Colors.White,
							minWidth: 250,
							maxHeight: 200,
							overflowY: 'auto',
							filter:
								'drop-shadow(0px 2px 10px rgba(29, 30, 38, 0.1)) drop-shadow(0px 1px 2px rgba(29, 30, 38, 0.1))',
							'& p': {
								fontSize: 14,
								padding: '9px 12px',
								cursor: 'pointer',
							},
							'& p:hover': {
								backgroundColor: Colors.Gray20,
							},
						}}
					>
						{searchValue.length >= 3 && !filtered.length && (
							<Typography>No options</Typography>
						)}
						{filtered.map((item: Record<string, any>) => (
							<Typography
								key={item.id}
								onClick={() => {
									setInput(getValueFromObj<string>(item, searchPath, input))
									table.showSearchData(item.id)
									setFiltered([])
									setShowPopper(false)
								}}
							>
								{getValueFromObj(item, searchPath, '')}
							</Typography>
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
