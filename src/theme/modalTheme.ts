import { createTheme } from '@mui/material'

import { Colors, IconsColor, TextColor } from '../components/styles'

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
					color: TextColor.Primary,
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
					color: TextColor.Dark,
				},
			},
		},
	},
})
