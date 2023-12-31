import React from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { TableData, TableInstance } from '..'

type Props<TData extends TableData = TableData> = {
	table: TableInstance<TData>
}

export const ExpandAllButton = <TData extends TableData = TableData>({
	table,
}: Props<TData>) => {
	const {
		getIsAllRowsExpanded,
		getIsSomeRowsExpanded,
		getCanSomeRowsExpand,
		getState,
		options: {
			icons: { ExpandIcon, CollapseIcon },
			localization,
			muiExpandAllButtonProps,
			renderDetailPanel,
		},
		toggleAllRowsExpanded,
	} = table
	const { isLoading } = getState()

	const iconButtonProps =
		muiExpandAllButtonProps instanceof Function
			? muiExpandAllButtonProps({ table })
			: muiExpandAllButtonProps

	const isAllRowsExpanded = getIsAllRowsExpanded()

	return (
		<Tooltip
			arrow
			enterDelay={1000}
			enterNextDelay={1000}
			title={
				iconButtonProps?.title ?? isAllRowsExpanded
					? localization.collapseAll
					: localization.expandAll
			}
		>
			<span>
				<IconButton
					aria-label={localization.expandAll}
					disabled={
						isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())
					}
					onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
					{...iconButtonProps}
					sx={(theme) => ({
						height: '2.25rem',
						width: '2.25rem',
						mt: '-0.25rem',
						...(iconButtonProps?.sx instanceof Function
							? iconButtonProps?.sx(theme)
							: (iconButtonProps?.sx as any)),
					})}
					title={undefined}
				>
					{isAllRowsExpanded || getIsSomeRowsExpanded() ? (
						<ExpandIcon />
					) : (
						<CollapseIcon />
					)}
				</IconButton>
			</span>
		</Tooltip>
	)
}
