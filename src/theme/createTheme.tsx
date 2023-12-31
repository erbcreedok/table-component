import { createTheme as MUICreateTheme, ThemeOptions } from '@mui/material'

import { Colors } from '../components/styles'

const defaultTheme = MUICreateTheme()
export function createTheme(options: ThemeOptions, ...args: object[]) {
	return MUICreateTheme(
		{
			...options,
			palette: {
				text: {
					primary: Colors.Dark,
				},
				error: {
					main: Colors.Red,
				},
				primary: {
					...defaultTheme.palette.primary,
					main: Colors.LightBlue,
					...options.palette?.primary,
				},
				secondary: {
					...defaultTheme.palette.secondary,
					light: Colors.LightestGray,
					...options.palette?.secondary,
				},
				...options.palette,
			},
			components: {
				MuiTableCell: {
					styleOverrides: {
						root: {
							color: defaultTheme.palette.text.primary,
						},
					},
				},
				...options.components,
			},
			typography: {
				fontSize: 14,
				...options.typography,
				subtitle2: {
					...defaultTheme.typography.subtitle2,
					fontSize: 12,
					...(options.typography
						? 'subtitle2' in options.typography
							? options.typography.subtitle2
							: {}
						: {}),
				},
			},
		},
		...args
	)
}
