import { Typography } from '@mui/material'
import type { IconButtonProps } from '@mui/material/IconButton'
import React, { MouseEvent, ReactNode } from 'react'

import { IconsColor } from './styles'
import { ToolbarIconButton } from './ToolbarIconButton'
import { Tooltip } from './Tooltip'

type Props = IconButtonProps & {
	title: string
	onClick: (event: MouseEvent<HTMLButtonElement>) => void
	enableCaption?: boolean
	captionText?: string
	tooltipPlacement?:
		| 'bottom'
		| 'left'
		| 'right'
		| 'top'
		| 'bottom-end'
		| 'bottom-start'
		| 'left-end'
		| 'left-start'
		| 'right-end'
		| 'right-start'
		| 'top-end'
		| 'top-start'
	icon?: ReactNode
}

export const TooltipButton = ({
	enableCaption,
	captionText,
	disabled,
	title,
	tooltipPlacement,
	icon,
	onClick,
	...rest
}: Props) => {
	return (
		<>
			<Tooltip placement={tooltipPlacement} title={title} disabled={disabled}>
				<ToolbarIconButton
					aria-label={captionText}
					onClick={(e) => onClick(e)}
					disableRipple
					enableCaption={enableCaption}
					disabled={disabled}
					{...rest}
				>
					{icon}
					{enableCaption && (
						<Typography
							color={disabled ? IconsColor.disabled : IconsColor.default}
						>
							{captionText ?? title}
						</Typography>
					)}
				</ToolbarIconButton>
			</Tooltip>
		</>
	)
}
