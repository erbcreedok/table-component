import React, { Dispatch, DragEvent, SetStateAction, useRef } from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import type { Table_Column, TableData, TableInstance } from '../../../../index'
import { arrayHasAll } from '../../../../utils/arrayHasAll'
import { GrabHandleButton } from '../../buttons/GrabHandleButton'
import { TableSwitch } from '../../../../components/TableSwitch'
import { Tooltip } from '../../../../components/Tooltip'
import {
	DEFAULT_FONT_FAMILY,
	TextColor,
	IconsColor,
	Colors,
} from '../../../../components/styles'

import { MultirowColumnParent } from './multirowMenu.types'

export interface ColumnsMultirowMenuGroupItemProps<
	TData extends TableData = TableData
> {
	group: MultirowColumnParent<TData>
	table: TableInstance<TData>
	parent?: any
	hoveredGroup?: MultirowColumnParent<TData> | null
	draggingGroup?: MultirowColumnParent<TData> | null
	setHoveredGroup?: Dispatch<SetStateAction<MultirowColumnParent<TData> | null>>
	setDraggingGroup?: Dispatch<
		SetStateAction<MultirowColumnParent<TData> | null>
	>
	onColumnGroupOrderChange?(
		draggedGroup: MultirowColumnParent<TData>,
		targetGroup: MultirowColumnParent<TData>
	): void
	enableDrag?: boolean
	drawAngle?: boolean
	depth?: number
}

export const ColumnsMultirowMenuGroupItem = <
	TData extends TableData = TableData
>({
	group,
	table,
	drawAngle,
	hoveredGroup,
	draggingGroup,
	setHoveredGroup,
	setDraggingGroup,
	onColumnGroupOrderChange,
	enableDrag,
	depth,
}: ColumnsMultirowMenuGroupItemProps<TData>) => {
	const columnsGroup = group.columns ?? []
	const columnsGroupText = group.shorthandText ?? group.text ?? ''
	const {
		options: {
			enableHiding,
			enableColumnOrdering,
			localization,
			icons: { LockedIcon },
		},
	} = table

	const switchCannotBeChecked = columnsGroup.every((col) => !col.getCanHide())
	const switchChecked = columnsGroup.some(
		(col) => col.getCanHide() && col.getIsVisible()
	)
	const columnOrderingEnabled =
		columnsGroup.every((col) => col.columnDef.enableColumnOrdering) ||
		enableColumnOrdering

	const isDragging = group.id === draggingGroup?.id
	const isHoveredGroup = group.id === hoveredGroup?.id

	const menuItemRef = useRef<HTMLElement>(null)

	const handleToggleColumnHidden = (columnsGroup: Table_Column<TData>[]) => {
		columnsGroup?.forEach?.((col: Table_Column<TData>) => {
			col.toggleVisibility(!switchChecked)
		})
	}

	const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
		setDraggingGroup?.(group)
		e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0)
	}

	const handleDragEnd = () => {
		setDraggingGroup?.(null)
		setHoveredGroup?.(null)
		if (hoveredGroup) {
			onColumnGroupOrderChange?.(group, hoveredGroup)
		}
	}

	const handleDragEnter = () => {
		if (
			!isDragging &&
			columnOrderingEnabled &&
			group.parent === draggingGroup?.parent
		) {
			setHoveredGroup?.(group)
		}
	}

	return (
		<>
			<MenuItem
				disableRipple
				ref={menuItemRef as any}
				onDragEnter={handleDragEnter}
				sx={() => ({
					alignItems: 'center',
					justifyContent: 'flex-start',
					my: 0,
					opacity: 1,
					filter: isDragging
						? 'filter: drop-shadow(0px 4px 22px rgba(29, 30, 38, 0.15))'
						: 'none',
					borderBottom: isHoveredGroup
						? `1px solid ${Colors.LightBlue}`
						: 'none',
					py: '6px',
					height: 36,
					'&:hover': {
						backgroundColor: 'unset',
					},
					'& button': {
						visibility: 'hidden',
					},
					'&:hover button': {
						visibility: 'visible',
					},
				})}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'nowrap',
						paddingLeft: '4px',
						alignItems: 'center',
						minWidth: 300,
					}}
				>
					{depth && depth > 1 && (
						<Box
							sx={{
								width: `18px`,
								ml: `${(depth - 1) * 6 + (depth - 2) * 18}px`,
								mb: '4px',
								height: '4px',
								borderBottom: `1px solid ${Colors.Gray}`,
								borderLeft: drawAngle ? `1px solid ${Colors.Gray}` : 'none',
								borderBottomLeftRadius: '3px',
							}}
						/>
					)}
					{columnOrderingEnabled && switchChecked && enableDrag ? (
						<GrabHandleButton
							onDragEnd={handleDragEnd}
							onDragStart={handleDragStart}
							iconButtonProps={{
								sx: { transform: 'translateX(-11px)', opacity: 1 },
							}}
						/>
					) : (
						<Box sx={{ width: '9px' }} />
					)}
					{enableHiding ? (
						<FormControlLabel
							componentsProps={{
								typography: {
									sx: {
										mb: 0,
										opacity: 1,
										fontFamily: DEFAULT_FONT_FAMILY,
										fontSize: 14,
										lineHeight: '18px',
										paddingLeft: '12px',
										color: TextColor.Primary,
									},
								},
							}}
							checked={switchCannotBeChecked || switchChecked}
							disabled={switchCannotBeChecked}
							control={
								<Tooltip
									arrow
									enterDelay={1000}
									enterNextDelay={1000}
									title={localization.toggleVisibility}
								>
									<TableSwitch size="small" disableRipple />
								</Tooltip>
							}
							label={columnsGroupText}
							onChange={() => handleToggleColumnHidden(columnsGroup)}
						/>
					) : (
						<Typography sx={{ alignSelf: 'center' }}>
							{columnsGroupText}
						</Typography>
					)}
					{switchCannotBeChecked && (
						<Tooltip
							placement="top"
							title={localization.locked}
							arrow
							sx={{ height: '30px', mb: '2px' }}
						>
							<Box sx={{ marginLeft: 'auto' }}>
								<LockedIcon style={{ color: IconsColor.default }} />
							</Box>
						</Tooltip>
					)}
				</Box>
			</MenuItem>
		</>
	)
}
