import styled from '@emotion/styled'
import { tooltipClasses } from '@mui/material'
import MuiTooltip from '@mui/material/Tooltip'

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

const getSpacing = (
	fallback: number,
	spacing?: Spacing,
	direction?: 'top' | 'left' | 'right' | 'bottom'
) => {
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
}>`
	background: ${({ color }) => color ?? Colors.Gray};
	.${tooltipClasses.arrow} {
		color: ${({ color }) => color ?? Colors.Gray};
	}
	.${tooltipClasses.popper}[data-popper-placement*='top'] > & {
		margin-bottom: ${({ spacing }) => getSpacing(3, spacing, 'top')}px;
	}
	.${tooltipClasses.popper}[data-popper-placement*='bottom'] > & {
		margin-top: ${({ spacing }) => getSpacing(3, spacing, 'bottom')}px;
	}
	.${tooltipClasses.popper}[data-popper-placement*='left'] > & {
		margin-right: ${({ spacing }) => getSpacing(3, spacing, 'left')}px;
	}
	.${tooltipClasses.popper}[data-popper-placement*='bottom'] > & {
		margin-left: ${({ spacing }) => getSpacing(3, spacing, 'bottom')}px;
	}
`
