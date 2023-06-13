import React, { FC, MouseEvent } from 'react'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { Table_Row, TableInstance } from '..'
import { IconsColor } from '../components/styles'

interface Props {
	row: Table_Row
	table: TableInstance
	sx?: IconButtonProps['sx']
}

export const ExpandButton: FC<Props> = ({ row, table, sx }) => {
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

	const canExpand = row.getCanExpand()
	const isExpanded = row?.getIsExpanded?.()

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
