import { SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'

import { getValueOrFunctionHandler } from './getValueOrFunctionHandler'

export const mergeSx = (
	...args: (SxProps<Theme> | undefined)[]
): SxProps<Theme> => {
	return (theme) => ({
		...args.reduce(
			(acc, sx) => ({ ...acc, ...getValueOrFunctionHandler(sx)(theme) }),
			{} as SxProps<Theme>
		),
	})
}
