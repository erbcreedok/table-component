import { styled, Switch, switchClasses } from '@mui/material'

import { TextColor, Colors } from './styles'

export const TableSwitch = styled(Switch)`
	padding: 5px;
	&:hover .${switchClasses.switchBase} {
		background-color: unset;
	}
	& + .${switchClasses.disabled} {
		color: ${TextColor.Primary} !important;
	}
	&
		.${switchClasses.checked},
		&
		.${switchClasses.switchBase}.${switchClasses.checked}.${switchClasses.disabled} {
		color: #fff;
	}
	& .${switchClasses.switchBase} {
		padding: 6px;
	}

	& .${switchClasses.thumb} {
		width: 11px;
		height: 11px;
		box-shadow: none;
		color: #fff;
	}
	&
		.${switchClasses.switchBase}.${switchClasses.checked}
		+ .${switchClasses.track} {
		background-color: ${Colors.LightBlue};
		opacity: 1;
	}
	&
		.${switchClasses.disabled}.${switchClasses.switchBase}.${switchClasses.checked}
		+ .${switchClasses.track} {
		opacity: 0.5;
	}
`
