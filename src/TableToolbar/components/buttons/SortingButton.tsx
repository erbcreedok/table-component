import React, { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

import { Tooltip } from '../../../components/Tooltip'
import type { TableData, TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { IconsColor } from '../../../components/styles'
import { SortingMenu } from '../menus/SortingMenu/SortingMenu'
import { withNativeEvent } from '../../../utils/withNativeEvent'

type Props<TData extends TableData> = IconButtonProps & {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const SortingButton = <TData extends TableData = {}>({
	table,
	enableCaption,
	disabled,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { SortIcon },
			localization,
		},
	} = table

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (_event: MouseEvent<HTMLElement>) => {
		setAnchorEl(_event.currentTarget)
	}

	return (
		<>
			<Tooltip
				placement="top"
				title={rest?.title ?? localization.showSorting}
				disabled={disabled}
			>
				<ToolbarIconButton
					aria-label={localization.showSorting}
					onClick={withNativeEvent(
						{
							el: 'ActionBar_SortButton',
							type: 'click',
						},
						table
					)(handleClick)}
					disableRipple
					enableCaption={enableCaption}
					disabled={disabled}
					{...rest}
				>
					<SortIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography
							color={disabled ? IconsColor.disabled : IconsColor.default}
						>
							{localization.showSorting}
						</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>
			{anchorEl && (
				<SortingMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
