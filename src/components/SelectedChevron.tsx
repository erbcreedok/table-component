import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'

import { TableData, TableInstance } from '../TableComponent'
import { mergeSx } from '../utils/mergeSx'

import { Colors } from './styles'

export type SelectedChevronProps<TData extends TableData = TableData> = {
	table: TableInstance<TData>
} & BoxProps
export const SelectedChevron = <TData extends TableData = TableData>({
	table,
	sx,
	...rest
}: SelectedChevronProps<TData>) => {
	const {
		options: {
			icons: { CheckIcon },
		},
	} = table

	return (
		<Box
			sx={mergeSx({ ml: 'auto', color: Colors.LightBlue, height: '24px' }, sx)}
			{...rest}
		>
			<CheckIcon />
		</Box>
	)
}
