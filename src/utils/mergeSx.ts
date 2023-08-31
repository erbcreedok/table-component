import { SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'

const getFunctionalSx = (sx: SxProps<Theme> | undefined) => {
	return (theme: Theme) =>
		sx ? (typeof sx === 'function' ? sx(theme) : sx) : {}
}
export const mergeSx = (
	...args: (SxProps<Theme> | undefined)[]
): SxProps<Theme> => {
	return (theme) => ({
		...args.reduce(
			(acc, sx) => ({ ...acc, ...getFunctionalSx(sx)(theme) }),
			{} as SxProps<Theme>
		),
	})
}
