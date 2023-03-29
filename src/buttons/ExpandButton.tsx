import React, { FC, MouseEvent } from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { Table_Row, TableInstance } from '..'

interface Props {
	row: Table_Row
	table: TableInstance
}

export const ExpandButton: FC<Props> = ({ row, table }) => {
	const {
		options: {
			icons: { ExpandMoreIcon },
			localization,
			muiExpandButtonProps,
			renderDetailPanel,
		},
	} = table

	const iconButtonProps =
		muiExpandButtonProps instanceof Function
			? muiExpandButtonProps({ table, row })
			: muiExpandButtonProps

	const canExpand = row.getCanExpand()
	const isExpanded = row.getIsExpanded()

	const handleToggleExpand = (event: MouseEvent<HTMLButtonElement>) => {
		event.stopPropagation()
		row.toggleExpanded()
		iconButtonProps?.onClick?.(event)
	}

	return (
		<Tooltip
			arrow
			disableHoverListener={!canExpand && !renderDetailPanel}
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
					disabled={!canExpand && !renderDetailPanel}
					{...iconButtonProps}
					onClick={handleToggleExpand}
					sx={(theme) => ({
						height: '2.25rem',
						width: '2.25rem',
						...(iconButtonProps?.sx instanceof Function
							? iconButtonProps.sx(theme)
							: (iconButtonProps?.sx as any)),
					})}
					title={undefined}
				>
					<ExpandMoreIcon
						style={{
							transform: `rotate(${
								!canExpand && !renderDetailPanel ? -90 : isExpanded ? -180 : 0
							}deg)`,
							transition: 'transform 150ms',
						}}
					/>
				</IconButton>
			</span>
		</Tooltip>
	)
}