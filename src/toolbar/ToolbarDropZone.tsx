import Box from '@mui/material/Box'
import Fade from '@mui/material/Fade'
import { alpha } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'

import type { TableData, TableInstance } from '..'

interface Props<TData = TableData> {
	table: TableInstance<TData>
}

export const ToolbarDropZone = <TData,>({ table }: Props<TData>) => {
	const {
		getState,
		options: { enableGrouping, localization },
		setHoveredColumn,
		setShowToolbarDropZone,
	} = table

	const { draggingColumn, hoveredColumn, grouping, showToolbarDropZone } =
		getState()

	const handleDragEnter = () => {
		setHoveredColumn({ id: 'drop-zone' })
	}

	useEffect(() => {
		if (table.options.state?.showToolbarDropZone !== undefined) {
			setShowToolbarDropZone(
				!!enableGrouping &&
					!!draggingColumn &&
					!grouping.includes(draggingColumn.id)
			)
		}
	}, [
		enableGrouping,
		draggingColumn,
		grouping,
		table.options.state?.showToolbarDropZone,
		setShowToolbarDropZone,
	])

	return (
		<Fade in={showToolbarDropZone}>
			<Box
				className="Mui-ToolbarDropZone"
				sx={(theme) => ({
					alignItems: 'center',
					backgroundColor: alpha(
						theme.palette.info.main,
						hoveredColumn?.id === 'drop-zone' ? 0.2 : 0.1
					),
					border: `dashed ${theme.palette.info.main} 2px`,
					display: 'flex',
					justifyContent: 'center',
					height: 'calc(100% - 4px)',
					position: 'absolute',
					width: 'calc(100% - 4px)',
					zIndex: 2,
				})}
				onDragEnter={handleDragEnter}
			>
				<Typography>
					{localization.dropToGroupBy.replace(
						'{column}',
						draggingColumn?.columnDef?.header ?? ''
					)}
				</Typography>
			</Box>
		</Fade>
	)
}
