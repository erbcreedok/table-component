import React, { MouseEvent } from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { Table_Row, TableData, TableInstance } from '..'
import { IconsColor } from '../components/styles'

type Props<TData extends TableData = TableData> = {
	row: Table_Row<TData>
	table: TableInstance<TData>
	sx?: IconButtonProps['sx']
}

export const ExpandButton = <TData extends TableData = TableData>({
	row,
	table,
	sx,
}: Props<TData>) => {
	const {
		options: {
			icons: { ExpandIcon, CollapseFilledIcon },
			localization,
			muiExpandButtonProps,
			renderDetailPanel,
		},
	} = table

	const iconButtonProps =
		muiExpandButtonProps instanceof Function
			? muiExpandButtonProps({ table, row })
			: muiExpandButtonProps

	const canExpand = row.getCanExpand() || renderDetailPanel
	const isExpanded = row?.getIsExpanded?.()

	const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		row.toggleExpanded()
		iconButtonProps?.onClick?.(event)
	}

	return (
		<Tooltip
			arrow
			disableHoverListener={!canExpand}
			enterDelay={1000}
			enterNextDelay={1000}
			title={
				iconButtonProps?.title ?? isExpanded
					? localization.collapse
					: localization.expand
			}
		>
			<span>
				<IconButton
					aria-label={localization.expand}
					disabled={!canExpand}
					{...iconButtonProps}
					onClick={handleToggleExpand}
					sx={(theme) => ({
						height: '2.25rem',
						width: '2.25rem',
						color: IconsColor.default,
						...(iconButtonProps?.sx instanceof Function
							? iconButtonProps.sx(theme)
							: (iconButtonProps?.sx as any)),
						...(sx instanceof Function ? sx(theme) : (sx as any)),
					})}
					title={undefined}
				>
					{!canExpand ? null : renderDetailPanel ? (
						<ExpandIcon
							style={{
								transform: `rotate(${isExpanded ? -180 : -90}deg)`,
								transition: 'transform 150ms',
							}}
						/>
					) : !isExpanded ? (
						<ExpandIcon />
					) : (
						<CollapseFilledIcon />
					)}
				</IconButton>
			</span>
		</Tooltip>
	)
}
