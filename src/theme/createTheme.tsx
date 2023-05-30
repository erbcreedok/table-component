import { createTheme as MUICreateTheme, ThemeOptions } from '@mui/material'

const defaultTheme = MUICreateTheme({
	palette: {
		text: {
			primary: '#303240',
		},
	},
})
export function createTheme(options: ThemeOptions, ...args: object[]) {
	return MUICreateTheme(
		{
			...options,
			palette: {
				secondary: {
					...defaultTheme.palette.secondary,
					light: '#FAFAFC',
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
