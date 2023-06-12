import { createTheme } from '@mui/material'

import { Colors, IconsColor, Text } from '../components/styles'

export const modalTheme = createTheme({
	palette: {
		primary: {
			main: `${Colors.LightBlue}`,
		},
		secondary: {
			main: `${IconsColor.disabled}`,
		},
	},
	components: {
		MuiButton: {
			styleOverrides: {
				root: {
					borderRadius: '6px',
					textTransform: 'none',
					fontWeight: '600',
				},
				outlinedSecondary: {
					borderColor: Colors.BorderMain,
					color: Text.Primary,
				},
				contained: {
					boxShadow: 'none',
					'&:hover': {
						boxShadow: 'none',
					},
				},
			},
		},
		MuiTypography: {
			styleOverrides: {
				root: {
					color: Text.Dark,
				},
			},
		},
	},
})
