import { SxProps } from '@mui/material'
import { Theme } from '@mui/material/styles'

import { mergeSx } from './mergeSx'

type P = { sx?: SxProps<Theme>; 'data-e2e'?: string | undefined }
type MuiProps<T extends P> = T
export const mergeMuiProps = <T extends P>(
	...args: (MuiProps<T> | undefined | Record<any, any>)[]
): MuiProps<T> =>
	args.reduce((acc, props) => {
		const newProps = {
			...acc,
			...props,
		} as MuiProps<T>
		if (props?.sx) {
			newProps.sx = mergeSx(acc?.sx, props.sx)
		}
		if (props?.['data-e2e']) {
			newProps['data-e2e'] = [acc?.['data-e2e'], props['data-e2e']]
				.filter(Boolean)
				.join(' ')
		}

		return newProps
	}, {} as MuiProps<T>) as MuiProps<T>
