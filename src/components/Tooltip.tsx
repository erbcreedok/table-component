import { styled, tooltipClasses } from '@mui/material'
import MuiTooltip from '@mui/material/Tooltip'
import { ComponentProps } from 'react'

import { Colors } from './styles'

export const TooltipBase: typeof MuiTooltip = ({
	classes,
	className,
	children,
	...rest
}) => {
	return (
		<MuiTooltip
			classes={{
				tooltip: className,
				...classes,
			}}
			{...rest}
		>
			{children}
		</MuiTooltip>
	)
}

type Spacing =
	| number
	| {
			x?: number
			y?: number
			top?: number
			left?: number
			right?: number
			bottom?: number
	  }

const getSpacing =
	(direction?: 'top' | 'left' | 'right' | 'bottom') =>
	({ spacing, arrow }: { spacing?: Spacing; arrow?: boolean }) => {
		const fallback = arrow ? 8 : 3
		if (!spacing) return fallback
		if (typeof spacing === 'number') {
			return spacing
		}
		if (direction === 'top') {
			return spacing?.top ?? spacing?.y ?? fallback
		}
		if (direction === 'left') {
			return spacing?.left ?? spacing?.x ?? fallback
		}
		if (direction === 'right') {
			return spacing?.right ?? spacing?.x ?? fallback
		}
		if (direction === 'bottom') {
			return spacing?.bottom ?? spacing?.y ?? fallback
		}

		return fallback
	}

export const Tooltip = styled(TooltipBase)<{
	color?: string
	spacing?: Spacing
	disabled?: boolean
}>`
	background: ${({ color }) => color ?? Colors.Gray90};
	.${tooltipClasses.arrow} {
		color: ${({ color }) => color ?? Colors.Gray90};
	}
	.${tooltipClasses.popper}[data-popper-placement*='top'] > & {
		margin-bottom: ${getSpacing('top')}px;
	}
	.${tooltipClasses.popper}[data-popper-placement*='bottom'] > & {
		margin-top: ${getSpacing('bottom')}px;
	}
	.${tooltipClasses.popper}[data-popper-placement*='left'] > & {
		margin-right: ${getSpacing('left')}px;
	}
	.${tooltipClasses.popper}[data-popper-placement*='bottom'] > & {
		margin-left: ${getSpacing('bottom')}px;
	}
`

export type TooltipProps = ComponentProps<typeof Tooltip>
