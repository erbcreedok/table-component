import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { DragEvent, FC, ReactNode, useMemo } from 'react'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'

import { getGroupBorders } from '../utils/getGroupBorders'
import { getCommonCellStyles } from '../column.utils'
import type { Table_Header, TableInstance } from '..'
import { Colors } from '../components/styles'

import { TableHeadCellActionsButton } from './TableHeadCellActionsButton'
import { TableHeadCellFilterLabel } from './TableHeadCellFilterLabel'
import { TableHeadCellGrabHandle } from './TableHeadCellGrabHandle'
import { TableHeadCellResizeHandle } from './TableHeadCellResizeHandle'
import { TableHeadCellSortLabel } from './TableHeadCellSortLabel'

interface Props {
	header: Table_Header
	table: TableInstance
}

export const TableHeadCell: FC<Props> = ({ header, table }) => {
	const theme = useTheme()
	const {
		getState,
		options: {
			enableColumnActions,
			enableColumnDragging,
			enableColumnOrdering,
			enableGrouping,
			enableMultiSort,
			layoutMode,
			muiTableHeadCellProps,
			uppercaseHeader,
		},
		refs: { tableHeadCellRefs },
		setHoveredColumn,
	} = table
	const { draggingColumn, grouping, hoveredColumn, highlightHeadCellId } =
		getState()
	const { column } = header
	const { columnDef } = column
	const { columnDefType } = columnDef

	const mTableHeadCellProps =
		muiTableHeadCellProps instanceof Function
			? muiTableHeadCellProps({ column, table })
			: muiTableHeadCellProps

	const mcTableHeadCellProps =
		columnDef.muiTableHeadCellProps instanceof Function
			? columnDef.muiTableHeadCellProps({ column, table })
			: columnDef.muiTableHeadCellProps

	const tableCellProps = {
		...mTableHeadCellProps,
		...mcTableHeadCellProps,
	}

	const showColumnActions =
		(enableColumnActions || columnDef.enableColumnActions) &&
		columnDef.enableColumnActions !== false

	const showDragHandle =
		enableColumnDragging !== false &&
		columnDef.enableColumnDragging !== false &&
		(enableColumnDragging ||
			(enableColumnOrdering && columnDef.enableColumnOrdering !== false) ||
			(enableGrouping &&
				columnDef.enableGrouping !== false &&
				!grouping.includes(column.id)))

	const headerPL = useMemo(() => {
		let pl = 0
		if (column.getCanSort()) pl++
		if (showColumnActions) pl += 1.75
		if (showDragHandle) pl += 1.25

		return pl
	}, [showColumnActions, showDragHandle])

	const draggingBorder = useMemo(
		() =>
			draggingColumn?.id === column.id
				? `1px dashed ${theme.palette.text.secondary}`
				: hoveredColumn?.id === column.id
				? `2px dashed ${theme.palette.primary.main}`
				: undefined,
		[draggingColumn, hoveredColumn]
	)

	const draggingBorders = draggingBorder
		? {
				borderLeft: draggingBorder,
				borderRight: draggingBorder,
				borderTop: draggingBorder,
		  }
		: undefined

	const handleDragEnter = (_e: DragEvent) => {
		_e.stopPropagation()
		if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
			setHoveredColumn(null)
		}
		if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
			setHoveredColumn(columnDef.enableColumnOrdering !== false ? column : null)
		}
	}

	const headerElement =
		columnDef?.Header instanceof Function
			? columnDef?.Header?.({
					column,
					header,
					table,
			  })
			: columnDef?.Header ?? (columnDef.header as ReactNode)

	return (
		<TableCell
			align={columnDefType === 'group' ? 'center' : 'left'}
			colSpan={header.colSpan}
			onDragEnter={handleDragEnter}
			ref={(node: HTMLTableCellElement) => {
				if (node) {
					tableHeadCellRefs.current[column.id] = node
				}
			}}
			{...tableCellProps}
			sx={(theme: Theme) => ({
				boxSizing: 'border-box',
				fontSize: theme.typography.subtitle2.fontSize,
				flexDirection: layoutMode === 'grid' ? 'column' : undefined,
				fontWeight: 'bold',
				height: '48px',
				overflow: 'visible',
				p: '0.75rem',
				pb: columnDefType === 'display' ? 0 : '0.25rem',
				pt: '0.25rem',
				userSelect: enableMultiSort && column.getCanSort() ? 'none' : undefined,
				verticalAlign: 'middle',
				textTransform: uppercaseHeader && 'uppercase',
				zIndex:
					column.getIsResizing() || draggingColumn?.id === column.id
						? 3
						: column.getIsPinned() && columnDefType !== 'group'
						? 2
						: 1,
				...getGroupBorders({ header, table }),
				...getCommonCellStyles({
					column,
					header,
					table,
					tableCellProps,
					theme,
				}),
				backgroundColor: '#FAFAFC',
				...draggingBorders,
				...(highlightHeadCellId === column.id && {
					border: `1px solid ${Colors.LightBlue}`,
				}),
			})}
		>
			{header.isPlaceholder ? null : (
				<Box
					className="Mui-TableHeadCell-Content"
					sx={{
						alignItems: 'flex-start',
						display: 'flex',
						flexDirection:
							tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
						justifyContent:
							columnDefType === 'group' || tableCellProps?.align === 'center'
								? 'center'
								: column.getCanResize()
								? 'space-between'
								: 'flex-start',
						position: 'relative',
						width: '100%',
					}}
				>
					<Box
						className="Mui-TableHeadCell-Content-Labels"
						sx={{
							gap: '0.5rem',
							alignItems: 'center',
							cursor:
								column.getCanSort() && columnDefType !== 'group'
									? 'pointer'
									: undefined,
							display: 'flex',
							flexGrow: 1,
							flexDirection:
								tableCellProps?.align === 'right' ? 'row-reverse' : 'row',
							overflow: columnDefType === 'data' ? 'hidden' : undefined,
							pl:
								tableCellProps?.align === 'center'
									? `${headerPL}rem`
									: undefined,
						}}
					>
						<Box
							className="Mui-TableHeadCell-Content-Wrapper"
							sx={{
								overflow: columnDefType === 'data' ? 'hidden' : undefined,
								textOverflow: 'ellipsis',
								whiteSpace:
									(columnDef.header?.length ?? 0) < 20 ? 'nowrap' : 'normal',
								flexGrow: 1,
							}}
							title={columnDefType === 'data' ? columnDef.header : undefined}
						>
							{headerElement}
						</Box>
						{column.getIsSorted() && (
							<TableHeadCellSortLabel
								header={header}
								table={table}
								tableCellProps={tableCellProps}
							/>
						)}
						{column.getCanFilter() && (
							<TableHeadCellFilterLabel header={header} table={table} />
						)}
						{showColumnActions && (
							<TableHeadCellActionsButton
								header={header}
								table={table}
								disabled={!showColumnActions}
							>
								{({ onClick, visible }) => (
									<ExpandMoreIcon
										sx={{
											opacity: visible ? 1 : 0,
											'th:hover &': { opacity: 1 },
											color: '#6C6F80',
											transform: visible ? 'rotate(180deg)' : undefined,
											transition: '0.2s',
										}}
										height={12}
										onClick={onClick}
									/>
								)}
							</TableHeadCellActionsButton>
						)}
					</Box>
					{columnDefType !== 'group' && (
						<Box
							className="Mui-TableHeadCell-Content-Actions"
							sx={{ whiteSpace: 'nowrap' }}
						>
							{showDragHandle && (
								<TableHeadCellGrabHandle
									column={column}
									table={table}
									tableHeadCellRef={{
										current: tableHeadCellRefs.current[column.id],
									}}
								/>
							)}
						</Box>
					)}
					{column.getCanResize() && (
						<TableHeadCellResizeHandle header={header} table={table} />
					)}
				</Box>
			)}
		</TableCell>
	)
}
