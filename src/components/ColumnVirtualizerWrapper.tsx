import { TableCell } from '@mui/material'
import { TableCellProps } from '@mui/material/TableCell'
import { PropsWithChildren } from 'react'

import { useVirtualizerContext } from '../context/useVirtualizerContext'

export type ColumnVirtualizerWrapperProps = PropsWithChildren<TableCellProps>
export const ColumnVirtualizerWrapper = ({
	children,
	style,
	...rest
}: ColumnVirtualizerWrapperProps) => {
	const { virtualPaddingLeft, virtualPaddingRight } = useVirtualizerContext()

	const getPaddingCell = (padding?: number) =>
		!!padding && (
			<TableCell
				padding="none"
				{...rest}
				style={{ width: padding, ...style }}
			/>
		)

	return (
		<>
			{getPaddingCell(virtualPaddingLeft)}
			{children}
			{getPaddingCell(virtualPaddingRight)}
		</>
	)
}
