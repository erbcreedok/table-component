import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import {
	IconButton,
	InputAdornment,
	Popper,
	TextField,
	Typography,
} from '@mui/material'

import { Flex } from '../components/Flex'
import { Table_Column, Table_Header, TableInstance } from '../TableComponent'
import { HeaderSearchIcon } from '../TableToolbar/components/icons/HeaderSearchIcon'
import { CloseIcon } from '../TableToolbar/components/icons/CloseIcon'
import {
	Colors,
	DEFAULT_FONT_FAMILY,
	IconsColor,
	Text,
} from '../components/styles'
import { useDelay } from '../hooks/useDelay'
import { getValueFromObj } from '../utils/getValueFromObj'
import { getColumnId } from '../column.utils'

const EllipsisOverflow = styled('div')`
	white-space: nowrap;
	text-overflow: ellipsis;
	overflow: inherit;
`

const SidebarSearch = styled(TextField)`
	font-family: ${DEFAULT_FONT_FAMILY};
	width: 100%;
	box-sizing: border-box;
	& > div {
		padding-left: 5px;
	}
	& fieldset {
		border: none;
	}
	& input {
		padding: 0;
		font-family: ${DEFAULT_FONT_FAMILY};
		font-size: 14px;
		line-height: 18px;
		color: ${Text.Primary};
	}
`

type Props<TData extends Record<string, any>> = {
	column: Table_Column<TData>
	header: Table_Header<TData>
	table: TableInstance<TData>
	searchPath: string
	placeHolder: string
}
export const HeaderSearch = <T extends Record<string, any>>({
	column,
	table,
	searchPath,
	placeHolder,
}: Props<T>) => {
	const [anchorElPopover, setAnchorElPopover] =
		useState<HTMLButtonElement | null>(null)
	const [isSearch, setIsSearch] = useState(false)
	const [input, setInput] = useState('')
	const [filtered, setFiltered] = useState<Record<string, any>>([])
	const searchValue = useDelay(input)

	const toggleSearch = (e) => {
		e.stopPropagation()
		if (isSearch) {
			setIsSearch(false)
			setInput('')
			setFiltered([])
			setAnchorElPopover(null)
			table.showSearchData(null)
			table.setHighlightHeadCellId(null)
		} else {
			setIsSearch(true)
			table.setHighlightHeadCellId(getColumnId(column.columnDef))
		}
	}

	const handleInputChange = (e) => {
		e.preventDefault()
		setInput(e.target.value.toLowerCase())
		setAnchorElPopover(e.currentTarget)
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
			style={{
				flexGrow: 1,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
			}}
		>
			{isSearch ? (
				<>
					<SidebarSearch
						placeholder={placeHolder}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<HeaderSearchIcon htmlColor={IconsColor.disabled} />
								</InputAdornment>
							),
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										onClick={toggleSearch}
										disableRipple
										sx={{ '&:hover svg': { color: IconsColor.active } }}
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
						autoFocus
					/>
					<Popper
						id={anchorElPopover ? 'popover' : undefined}
						open={Boolean(anchorElPopover) && searchValue.length >= 3}
						anchorEl={anchorElPopover}
						placement="bottom-start"
						sx={{
							marginTop: '12px',
							backgroundColor: Colors.White,
							minWidth: 250,
							left: '-25px !important',
							top: '15px !important',
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
								backgroundColor: Colors.Lightgray,
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
									setAnchorElPopover(null)
								}}
							>
								{getValueFromObj(item, searchPath, '')}
							</Typography>
						))}
					</Popper>
				</>
			) : (
				<EllipsisOverflow>{column.columnDef.header}</EllipsisOverflow>
			)}

			{!isSearch && (
				<IconButton
					disableRipple
					size="small"
					onClick={toggleSearch}
					sx={{ '&:hover svg': { color: IconsColor.active } }}
				>
					<HeaderSearchIcon htmlColor={IconsColor.default} />
				</IconButton>
			)}
		</Flex>
	)
}
