import IconButton from '@mui/material/IconButton'
import React, {
	FC,
	MouseEventHandler,
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

import { HeaderBase, utilColumns } from '..'
import { Tooltip } from '../components/Tooltip'
import { useHoverEffects } from '../hooks/useHoverEffects'
import { GroupBorders } from '../utils/getGroupBorders'
import {
	getColumnId,
	getCommonCellStyles,
	Table_DefaultColumn,
} from '../column.utils'
import type { Table_Header, Table_Row, TableInstance } from '..'
import { Colors, groupDividerBorder } from '../components/styles'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { mergeSx } from '../utils/mergeSx'

import { TableHeadCellActionsButton } from './TableHeadCellActionsButton'
import { TableHeadCellFilterLabel } from './TableHeadCellFilterLabel'
import { TableHeadCellGrabHandle } from './TableHeadCellGrabHandle'
import { TableHeadCellResizeHandle } from './TableHeadCellResizeHandle'
import { TableHeadCellSortLabel } from './TableHeadCellSortLabel'
import { TableHeadCellUtility } from './TableHeadCellUtility'

export interface TableHeadCellProps {
	header: Table_Header
	table: TableInstance
	parentRow?: Table_Row
	groupBorders?: GroupBorders
	backgroundColor?: string
	backgroundColorHover?: string
	disableToggleGroupCollapse?: boolean
	groupsExpanded?: boolean
	onToggleGroupCollapse?: (expanded?: boolean) => void
}

export const TableHeadCell: FC<TableHeadCellProps> = ({
	header,
	table,
	parentRow,
	groupBorders,
	backgroundColor = Colors.Gray20,
	backgroundColorHover = Colors.Gray,
	disableToggleGroupCollapse,
	groupsExpanded,
	onToggleGroupCollapse,
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
			muiTableHeadCellProps,
			muiTableHeadCellWrapperProps,
			uppercaseHeader,
			enableRowNumbers,
			innerTable,
			icons: { ExpandIcon, CollapseIcon },
		},
		refs: { tableHeadCellRefs },
		setHoveredColumn,
	} = table
	const localRef = useRef<HTMLTableCellElement>(null)
	const { draggingColumn, grouping, hoveredColumn, highlightHeadCellId } =
		getState()
	const { column } = header
	const { columnDef } = column
	const { columnDefType, emptyHeader } = columnDef
	const columnId = getColumnId(columnDef)
	const { hovered, hoverProps } = useHoverEffects()
	const [grabHandleVisible, setGrabHandleVisible] = useState(false)
	const isUtilColumn = utilColumns.column === getColumnId(columnDef)
	const isExpandColumn = utilColumns.expand === getColumnId(columnDef)

	const mTableHeadCellProps = getValueOrFunctionHandler(muiTableHeadCellProps)({
		column,
		table,
	})
	const mcTableHeadCellProps = getValueOrFunctionHandler(
		columnDef.muiTableHeadCellProps
	)({ column, table })
	const tableCellProps = {
		...mTableHeadCellProps,
		...mcTableHeadCellProps,
	}

	const mTableHeadWrapperProps = getValueOrFunctionHandler(
		muiTableHeadCellWrapperProps
	)({
		column,
		table,
	})
	const mcTableHeadWrapperProps = getValueOrFunctionHandler(
		columnDef.muiTableHeadCellWrapperProps
	)({
		column,
		table,
	})
	const wrapperProps = {
		...mTableHeadWrapperProps,
		...mcTableHeadWrapperProps,
	}

	const showColumnActions =
		(enableColumnActions || columnDef.enableColumnActions) &&
		columnDef.enableColumnActions !== false

	const showDragHandle =
		enableColumnDragging !== false &&
		columnDef.enableColumnDragging !== false &&
		enableColumnOrdering &&
		columnDef.enableColumnOrdering !== false &&
		(!column.getIsGrouped() || grouping.length > 1)

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

	const handleDragEnter = () => {
		if (enableGrouping && hoveredColumn?.id === 'drop-zone') {
			setHoveredColumn(null)
		}
		if (enableColumnOrdering && draggingColumn && columnDefType !== 'group') {
			setHoveredColumn(
				columnDef.enableColumnOrdering !== false &&
					draggingColumn.getIsGrouped() === column.getIsGrouped()
					? column
					: null
			)
		}
	}

	const isIconsVisible =
		columnDef.headerEndAdornment ||
		column.getIsSorted() ||
		!!column.getFilterValue() ||
		column.getIsGrouped()
	const [isTooShort, setIsTooShort] = useState(false)
	const onResize = useCallback(
		(width) => {
			if (isUtilColumn || isExpandColumn) return

			setIsTooShort(width < 30)
		},
		[isExpandColumn, isUtilColumn]
	)
	const { ref: headerContentRef } = useResizeDetector({
		handleHeight: false,
		handleWidth: !isUtilColumn,
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

	const isLastGroupedColumn = grouping[grouping.length - 1] === columnId

	const toggleGroupCollapsed: MouseEventHandler = (event) => {
		event.stopPropagation()
		onToggleGroupCollapse?.(!groupsExpanded)
	}

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
						{...(!draggingColumn ? hoverProps : {})}
						onDragEnter={handleDragEnter}
						onClick={onClick}
						ref={localRef}
						{...tableCellProps}
						sx={(theme: Theme) => ({
							boxSizing: 'border-box',
							cursor: showColumnActions ? 'pointer' : undefined,
							fontSize: theme.typography.subtitle2.fontSize,
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
							borderBottom: `1px solid ${
								innerTable ? Colors.BorderMain : Colors.Gray20
							}`,
							...groupBorders,
							...getCommonCellStyles({
								column,
								header,
								table,
								tableCellProps,
								theme,
							}),
							backgroundColor:
								menuVisible || grabHandleVisible
									? backgroundColorHover
									: innerTable
									? '#FFFFFF'
									: backgroundColor,
							'&:hover': {
								backgroundColor: showColumnActions
									? backgroundColorHover
									: innerTable
									? '#FFFFFF'
									: backgroundColor,
							},
							...draggingBorders,
							...(highlightHeadCellId === column.id && {
								border: `1px solid ${Colors.LightBlue}`,
							}),
						})}
					>
						{isLastGroupedColumn && (
							<Box
								sx={{
									position: 'absolute',
									top: 0,
									right: 0,
									bottom: 0,
									width: '1px',
									borderRight: groupDividerBorder,
								}}
							/>
						)}
						{header.isPlaceholder || emptyHeader ? null : (
							<Box
								className="Mui-TableHeadCell-Content"
								{...wrapperProps}
								sx={mergeSx(
									{
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
										width: isUtilColumn
											? '100%'
											: `max(calc(100% - 1.4rem), ${Table_DefaultColumn.minSize}px)`,
									},
									wrapperProps.sx
								)}
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
									{column.getIsGrouped() && (
										<IconButton
											sx={{ p: 0, mr: `min(0.5rem, 10%)` }}
											onClick={toggleGroupCollapsed}
											disabled={disableToggleGroupCollapse}
										>
											{groupsExpanded ? <CollapseIcon /> : <ExpandIcon />}
										</IconButton>
									)}
									<Box
										ref={headerContentRef}
										className="Mui-TableHeadCell-Content-Wrapper"
										sx={{
											overflow: columnDefType === 'data' ? 'hidden' : undefined,
											flexGrow: 1,
											order: isTooShort && column.getIsGrouped() ? -1 : 0,
										}}
									>
										{!isTooShort ? (
											isUtilColumn ? (
												<TableHeadCellUtility
													table={table}
													enableRowNumbers={enableRowNumbers}
													hovered={hovered}
													headerElement={headerElement}
												/>
											) : (
												headerElement
											)
										) : isIconsVisible ? (
											''
										) : (
											'...'
										)}
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
								backgroundColor={backgroundColorHover}
								onComputedVisibleChange={setGrabHandleVisible}
							/>
						)}
					</TableCell>
				</Tooltip>
			)}
		</TableHeadCellActionsButton>
	)
}
