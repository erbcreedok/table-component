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
				popper: className,
				...classes,
			}}
			{...rest}
		>
			{children}
		</MuiTooltip>
	)
}

export const Tooltip = styled(TooltipBase)`
	.${tooltipClasses.tooltip} {
		background: ${Colors.Gray};
	}
	&[data-popper-placement*='top'] > .${tooltipClasses.tooltip} {
		margin-bottom: 3px;
	}
	&[data-popper-placement*='bottom'] > .${tooltipClasses.tooltip} {
		margin-top: 3px;
	}
	&[data-popper-placement*='left'] > .${tooltipClasses.tooltip} {
		margin-right: 3px;
	}
	&[data-popper-placement*='bottom'] > .${tooltipClasses.tooltip} {
		margin-left: 3px;
	}
`
