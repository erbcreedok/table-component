import { MouseEvent, useState } from 'react'
import type { IconButtonProps } from '@mui/material/IconButton'
import { Typography } from '@mui/material'

import { Tooltip } from '../../../components/Tooltip'
import type { TableInstance } from '../../../index'
import { ToolbarIconButton } from '../../../components/ToolbarIconButton'
import { IconsColor } from '../../../components/styles'
import { ColumnsMenu } from '../menus/ColumnsMenu/ColumnsMenu'
import { withNativeEvent } from '../../../utils/withNativeEvent'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
	enableCaption: boolean
}

export const ColumnsButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption,
	disabled,
	...rest
}: Props<TData>) => {
	const {
		options: {
			icons: { ColumnsIcon },
			localization,
		},
	} = table

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	return (
		<>
			<Tooltip
				placement="top"
				title={rest?.title ?? localization.showColumns}
				disabled={disabled}
			>
				<ToolbarIconButton
					aria-label={localization.showColumns}
					onClick={withNativeEvent(
						{ el: 'ActionBar_ColumnsButton', type: 'click' },
						table
					)(handleClick)}
					disableRipple
					enableCaption={enableCaption}
					disabled={disabled}
					{...rest}
				>
					<ColumnsIcon
						htmlColor={disabled ? IconsColor.disabled : IconsColor.default}
					/>
					{enableCaption && (
						<Typography
							color={disabled ? IconsColor.disabled : IconsColor.default}
						>
							{localization.showColumns}
						</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>

			{anchorEl && (
				<ColumnsMenu
					anchorEl={anchorEl}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
