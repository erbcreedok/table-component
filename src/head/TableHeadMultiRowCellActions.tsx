import React, {
	FC,
	MouseEvent,
	MouseEventHandler,
	MutableRefObject,
	ReactNode,
	useCallback,
	useMemo,
	useState,
} from 'react'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Box from '@mui/material/Box'

import { getColumnsFilteredByDisplay } from '..'
import type {
	TableInstance,
	Table_Column,
	MultirowColumnAction,
	MultirowColumn,
} from '..'
import { Menu } from '../components/Menu'
import { commonMenuItemStyles, commonListItemStyles } from '../menus/constants'
import { hideColumns } from '../utils/hideColumns'

import { multirowActions } from './constants'

type Props = {
	actions: MultirowColumnAction[] | null
	children(props: {
		onClick: MouseEventHandler
		menuVisible: boolean
	}): ReactNode
	anchorElRef: MutableRefObject<HTMLElement | null>
	table: TableInstance
	cell: MultirowColumn
	multirowColumnsDisplayDepth: number
}

export const TableHeadMultiRowCellActions: FC<Props> = ({
	children,
	actions,
	anchorElRef,
	table,
	cell,
	multirowColumnsDisplayDepth,
}) => {
	const {
		options: {
			localization,
			icons: { EyeCrossedIcon },
		},
	} = table

	const [visible, setVisible] = useState(false)

	const columns: Table_Column[] = getColumnsFilteredByDisplay(
		table.getVisibleLeafColumns()
	)

	const handleClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			const anchorEl = anchorElRef.current
			if (!actions || !anchorEl) return
			event.stopPropagation()
			event.preventDefault()
			setVisible(true)
		},
		[anchorElRef, actions]
	)

	const props = useMemo(
		() => ({
			onClick: handleClick,
			menuVisible: visible,
			'aria-label': localization.multirowColumnActions,
		}),
		[visible, handleClick, localization.multirowColumnActions]
	)

	const handleMenuItemClick = useCallback(
		(onClick: MultirowColumnAction['onClick'], event: MouseEvent) => {
			if (onClick === multirowActions.hideColumn) {
				hideColumns(cell.originalColIds, table)
			} else if (typeof onClick === 'function') {
				onClick({
					multirowColumn: cell,
					columns: columns.filter((col) => cell.colIds.includes(col.id)),
					table,
					event,
				})
			}

			setVisible(false)
		},
		[cell, columns, table]
	)

	const anchorEl = visible ? anchorElRef.current : null

	return (
		<>
			{children(props)}
			{multirowColumnsDisplayDepth === cell.depth && (
				<Menu
					anchorEl={anchorEl}
					open={Boolean(anchorEl)}
					onClose={() => setVisible(false)}
					PaperProps={{
						sx: {
							margin: '6px 0',
						},
					}}
				>
					{actions?.map(({ text, onClick }) => (
						<MenuItem
							key={text}
							onClick={(event) => handleMenuItemClick(onClick, event)}
							sx={commonMenuItemStyles}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<EyeCrossedIcon />
								</ListItemIcon>
								{text}
							</Box>
						</MenuItem>
					))}
				</Menu>
			)}
		</>
	)
}
