import React, { MouseEvent, useState } from 'react'
import IconButton from '@mui/material/IconButton'
import type { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import { ShowHideColumnsMenu } from '../menus/ShowHideColumnsMenu'
import type { TableInstance } from '..'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
}

export const ShowHideColumnsButton = <TData extends Record<string, any> = {}>({
	table,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { ViewColumnIcon },
			localization,
		},
	} = table

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<>
			<Tooltip arrow title={rest?.title ?? localization.showHideColumns}>
				<IconButton
					aria-label={localization.showHideColumns}
					onClick={handleClick}
					{...rest}
					title={undefined}
				>
					<ViewColumnIcon />
				</IconButton>
			</Tooltip>
			{anchorEl && (
				<ShowHideColumnsMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
