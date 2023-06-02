import React, {
	DragEvent,
	FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react'
import Box from '@mui/material/Box'
import TableCell from '@mui/material/TableCell'
import { useTheme } from '@mui/material/styles'
import type { Theme } from '@mui/material/styles'
import { useResizeDetector } from 'react-resize-detector'

import { HeaderBase } from '..'
import { Tooltip } from '../components/Tooltip'
import { useHoverEffects } from '../hooks/useHoverEffects'
import { GroupBorders } from '../utils/getGroupBorders'
import { getCommonCellStyles, Table_DefaultColumn } from '../column.utils'
import type { Table_Header, Table_Row, TableInstance } from '..'
import { Colors } from '../components/styles'

import { TableHeadCellActionsButton } from './TableHeadCellActionsButton'
import { TableHeadCellFilterLabel } from './TableHeadCellFilterLabel'
import { TableHeadCellGrabHandle } from './TableHeadCellGrabHandle'
import { TableHeadCellResizeHandle } from './TableHeadCellResizeHandle'
import { TableHeadCellSortLabel } from './TableHeadCellSortLabel'

interface Props {
	header: Table_Header
	table: TableInstance
	parentRow?: Table_Row
	groupBorders?: GroupBorders
}

export const TableHeadCell: FC<Props> = ({
	header,
	table,
	parentRow,
	groupBorders,
}) => {
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
	const localRef = useRef<HTMLTableCellElement>(null)
	const { draggingColumn, grouping, hoveredColumn, highlightHeadCellId } =
		getState()
	const { column } = header
	const { columnDef } = column
	const { columnDefType } = columnDef
	const { hovered, hoverProps } = useHoverEffects()

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

	const isIconsVisible =
		columnDef.headerEndAdornment ||
		column.getIsSorted() ||
		!!column.getFilterValue()
	const [isTooShort, setIsTooShort] = useState(false)
	const onResize = useCallback((width) => {
		setIsTooShort(width < 30)
	}, [])
	const { ref: headerContentRef } = useResizeDetector({
		handleHeight: false,
		onResize,
	})
	const headerText = <HeaderBase column={column} />

	const headerElement =
		columnDef?.Header instanceof Function
			? columnDef?.Header?.({
					column,
					header,
					table,
					parentRow,
			  })
			: columnDef?.Header ?? headerText

	useEffect(() => {
		if (localRef.current) {
			tableHeadCellRefs.current[column.id] = localRef.current
		}
	}, [column.id, tableHeadCellRefs])

	return (
		<TableHeadCellActionsButton
			anchorElRef={localRef}
			header={header}
			table={table}
			disabled={!showColumnActions}
		>
			{({ onClick, menuVisible }) => (
				<Tooltip title={isTooShort ? columnDef.header : ''} placement="top">
					<TableCell
						align={columnDefType === 'group' ? 'center' : 'left'}
						colSpan={header.colSpan}
						onDragEnter={handleDragEnter}
						{...hoverProps}
						onClick={onClick}
						ref={localRef}
						{...tableCellProps}
						sx={(theme: Theme) => ({
							boxSizing: 'border-box',
							cursor: showColumnActions ? 'pointer' : undefined,
							fontSize: theme.typography.subtitle2.fontSize,
							flexDirection: layoutMode === 'grid' ? 'column' : undefined,
							fontWeight: 'bold',
							height: '48px',
							overflow: column.getIsResizing() ? 'visible' : 'hidden',
							'&:hover, &:active': {
								overflow: 'visible',
								zIndex: 2,
							},
							p: '0',
							pb: columnDefType === 'display' ? 0 : '0.1rem',
							pt: '0.1rem',
							userSelect:
								enableMultiSort && column.getCanSort() ? 'none' : undefined,
							verticalAlign: 'middle',
							textTransform: uppercaseHeader && 'uppercase',
							zIndex:
								column.getIsResizing() || draggingColumn?.id === column.id
									? 3
									: column.getIsPinned() && columnDefType !== 'group'
									? 2
									: 1,
							borderBottom: `1px solid ${Colors.Lightgray}`,
							...groupBorders,
							...getCommonCellStyles({
								column,
								header,
								table,
								tableCellProps,
								theme,
							}),
							backgroundColor: menuVisible
								? Colors.Lightgray
								: Colors.LightestGray,
							'&:hover': {
								backgroundColor: showColumnActions
									? Colors.Lightgray
									: Colors.LightestGray,
							},
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
										columnDefType === 'group' ||
										tableCellProps?.align === 'center'
											? 'center'
											: column.getCanResize()
											? 'space-between'
											: 'flex-start',
									position: 'relative',
									mx: 'auto',
									width: `max(calc(100% - 1.4rem), ${Table_DefaultColumn.minSize}px)`,
								}}
							>
								<Box
									className="Mui-TableHeadCell-Content-Labels"
									sx={{
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
										ref={headerContentRef}
										className="Mui-TableHeadCell-Content-Wrapper"
										sx={{
											overflow: columnDefType === 'data' ? 'hidden' : undefined,
											flexGrow: 1,
										}}
									>
										{!isTooShort ? headerElement : isIconsVisible ? '' : '...'}
									</Box>
									<Box
										className="Mui-TableHeadCell-Content-Icons"
										sx={{
											gap: 'min(0.5rem, 10%)',
											display: 'flex',
											alignItems: 'center',
											justifyContent: isTooShort ? 'flex-start' : 'flex-end',
											flexGrow: isTooShort ? 1 : 0,
										}}
									>
										{columnDef.headerEndAdornment}
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
									</Box>
								</Box>
							</Box>
						)}
						{column.getCanResize() && (
							<TableHeadCellResizeHandle header={header} table={table} />
						)}
						{showDragHandle && (
							<TableHeadCellGrabHandle
								anchorEl={localRef.current}
								column={column}
								table={table}
								visible={hovered}
								tableHeadCellRef={localRef}
							/>
						)}
					</TableCell>
				</Tooltip>
			)}
		</TableHeadCellActionsButton>
	)
}
