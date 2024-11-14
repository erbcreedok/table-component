import { Popover } from '@mui/material'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import React, { useEffect, useState } from 'react'

import { Table_Column, TableData } from '../../../../'
import { ButtonBordered } from '../../../../components/ButtonBordered'
import { SidebarSearchComponent } from '../../../../components/SidebarSearch'

interface Props<TData = TableData> {
	buttonText: string
	columns: Array<Table_Column<TData>>
	onGroupingByColumn(column: Table_Column<TData>): void
}

export const SidebarPopover = <TData,>({
	buttonText,
	columns,
	onGroupingByColumn,
}: Props<TData>) => {
	const [anchorElPopover, setAnchorElPopover] =
		useState<HTMLButtonElement | null>(null)
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const [searchReset, setSearchReset] = useState<boolean>(false)

	const handleOnSearchChange = (value: string) => {
		setSearchReset(false)
		setSearchList(
			value.length >= 3
				? columns.filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}
	const handleGroupByClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorElPopover(event.currentTarget)
	}

	const handleGroupByCloseClick = () => {
		setAnchorElPopover(null)
	}

	const handleAddColumn = (col: Table_Column<TData>) => () => {
		onGroupingByColumn(col)
		setSearchList([])
		setSearchReset(true)
	}

	useEffect(() => {
		if (!columns.length) {
			setAnchorElPopover(null)
		}
	}, [columns])

	return (
		<Box>
			<ButtonBordered
				size="medium"
				variant="outlined"
				aria-describedby={anchorElPopover ? 'popover' : undefined}
				disableRipple
				onClick={handleGroupByClick}
				disabled={!columns.length}
			>
				{buttonText}{' '}
			</ButtonBordered>
			{!!columns.length && (
				<Popover
					id={anchorElPopover ? 'popover' : undefined}
					open={Boolean(anchorElPopover)}
					anchorEl={anchorElPopover}
					onClose={handleGroupByCloseClick}
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'left',
					}}
					sx={{
						marginTop: '6px',
						'& .MuiPopover-paper': {
							boxShadow:
								'0px 2px 10px rgba(29, 30, 38, 0.1), 0px 1px 2px rgba(29, 30, 38, 0.1)',
						},
					}}
				>
					<SidebarSearchComponent
						onChange={handleOnSearchChange}
						reset={searchReset}
						sx={{ paddingLeft: '9px !important' }}
					/>

					<Box
						sx={{
							maxHeight: 200,
							overflow: 'hidden',
							overflowY: 'auto',
							'&::-webkit-scrollbar': { width: 3, WebkitAppearance: 'none' },
							'&::-webkit-scrollbar-thumb': {
								borderRadius: 6,
								border: 'none',
								backgroundColor: '#CED0DB',
							},
						}}
					>
						{(searchList.length > 0 ? searchList : columns).map((col) => (
							<MenuItem
								disableRipple
								key={col.columnDef.header}
								sx={{ fontSize: '14px', height: '36px', paddingLeft: '12px' }}
								onClick={handleAddColumn(col)}
							>
								{col.columnDef.header}
							</MenuItem>
						))}
					</Box>
				</Popover>
			)}
		</Box>
	)
}
