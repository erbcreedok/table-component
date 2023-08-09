import { Popper } from '@mui/material'
import React, {
	ComponentProps,
	DragEvent,
	FC,
	RefObject,
	useEffect,
} from 'react'

import { GrabHandleButton } from '../buttons/GrabHandleButton'
import { reorderColumn } from '../column.utils'
import type { Table_Column, TableInstance } from '..'
import { Colors } from '../components/styles'
import { useHoverEffects } from '../hooks/useHoverEffects'

interface Props {
	anchorEl: ComponentProps<typeof Popper>['anchorEl']
	column: Table_Column
	table: TableInstance
	tableHeadCellRef: RefObject<HTMLTableCellElement>
	visible?: boolean
	backgroundColor?: string
	onComputedVisibleChange?: (visible: boolean) => void
}

export const TableHeadCellGrabHandle: FC<Props> = ({
	column,
	table,
	tableHeadCellRef,
	anchorEl,
	visible,
	backgroundColor = Colors.LightestGray,
	onComputedVisibleChange,
}) => {
	const {
		getState,
		options: { enableColumnOrdering, muiTableHeadCellDragHandleProps },
		setColumnOrder,
		setDraggingColumn,
		setHoveredColumn,
	} = table
	const { columnDef } = column
	const { hoveredColumn, draggingColumn, columnOrder } = getState()
	const { hovered, hoverProps } = useHoverEffects()

	const mIconButtonProps =
		muiTableHeadCellDragHandleProps instanceof Function
			? muiTableHeadCellDragHandleProps({ column, table })
			: muiTableHeadCellDragHandleProps

	const mcIconButtonProps =
		columnDef.muiTableHeadCellDragHandleProps instanceof Function
			? columnDef.muiTableHeadCellDragHandleProps({ column, table })
			: columnDef.muiTableHeadCellDragHandleProps

	const iconButtonUpperProps = {
		...mIconButtonProps,
		...mcIconButtonProps,
	}
	const iconButtonProps = {
		...iconButtonUpperProps,
		sx: {
			...iconButtonUpperProps?.sx,
			transform: 'rotate(90deg)',
		},
	}

	const handleDragStart = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDragStart?.(event)
		setDraggingColumn(column)
		event.dataTransfer.setDragImage(
			tableHeadCellRef.current as HTMLElement,
			0,
			0
		)
	}

	const handleDragEnd = (event: DragEvent<HTMLButtonElement>) => {
		iconButtonProps?.onDragEnd?.(event)
		if (hoveredColumn?.id === 'drop-zone') {
			column.toggleGrouping()
		} else if (
			enableColumnOrdering &&
			hoveredColumn &&
			hoveredColumn?.id !== draggingColumn?.id
		) {
			setColumnOrder(
				reorderColumn(column, hoveredColumn as Table_Column, columnOrder)
			)
		}
		setDraggingColumn(null)
		setHoveredColumn(null)
	}

	const computedVisible = !!visible || hovered
	useEffect(() => {
		onComputedVisibleChange?.(computedVisible)
	}, [computedVisible, onComputedVisibleChange])

	return (
		<Popper
			open={computedVisible}
			anchorEl={anchorEl}
			placement="top"
			componentsProps={{
				root: {
					...hoverProps,
				},
			}}
			sx={{
				zIndex: 2,
				borderRadius: '6px',
				padding: '2px 12px 3px',
				backgroundColor,
				marginBottom: '-14px !important',
			}}
		>
			<GrabHandleButton
				iconButtonProps={iconButtonProps}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				table={table}
			/>
		</Popper>
	)
}
