import { SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'

import { mergeSx } from './mergeSx'

type MuiProps<T extends { sx?: SxProps<Theme> }> = T
export const mergeMuiProps = <T extends { sx?: SxProps<Theme> }>(
	...args: (MuiProps<T> | undefined)[]
): MuiProps<T> =>
	args.reduce(
		(acc, props) =>
			({
				...acc,
				...props,
				sx: mergeSx(acc?.sx, props?.sx),
			} as MuiProps<T>),
		{ sx: {} } as MuiProps<T>
	) as MuiProps<T>
