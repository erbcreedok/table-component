import styled from '@emotion/styled'
import { Switch } from '@mui/material'

import { Text, Colors } from './styles'

export const TableSwitch = styled(Switch)`
	padding: 5px;
	&:hover .MuiSwitch-switchBase {
		background-color: unset;
	}
	& + .Mui-disabled {
		color: ${Text.Primary} !important;
	}
	& .Mui-checked,
	& .MuiSwitch-switchBase.Mui-checked.Mui-disabled {
		color: #fff;
	}
	& .MuiSwitch-switchBase {
		padding: 6px;
	}

	& .MuiSwitch-thumb {
		width: 11px;
		height: 11px;
		box-shadow: none;
		color: #fff;
	}
	& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
		background-color: ${Colors.LightBlue};
		opacity: 1;
	}
	& .Mui-disabled.MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track {
		opacity: 0.5;
	}
`
