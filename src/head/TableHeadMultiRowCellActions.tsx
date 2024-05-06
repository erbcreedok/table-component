import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
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

import type {
	MultirowColumn,
	MultirowColumnAction,
	Table_Column,
	TableInstance,
} from '..'
import { Menu } from '..'
import { commonListItemStyles, commonMenuItemStyles } from '../menus/constants'
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

	const columns: Table_Column[] = table.getVisibleLeafColumns()

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
