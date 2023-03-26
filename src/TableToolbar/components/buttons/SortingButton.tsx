import React, { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { Typography } from '@mui/material'

import type { TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { IconsColor } from '../../../components/styles'
import { SortingMenu } from '../menus/SortingMenu'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const SortingButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { SortIcon },
			localization,
		},
	} = table

	const disabled = false

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (_event: MouseEvent<HTMLElement>) => {
		setAnchorEl(_event.currentTarget)
	}

	return (
		<>
			<Tooltip placement="top" title={rest?.title ?? localization.showSorting}>
				<ToolbarIconButton
					aria-label={localization.showSorting}
					onClick={handleClick}
					disableRipple
					{...rest}
				>
					<SortIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && <Typography>{localization.showSorting}</Typography>}
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
