import { TableCell } from '@mui/material'
import { TableCellProps } from '@mui/material/TableCell'
import { PropsWithChildren, useMemo } from 'react'

import { useTableContext } from '../context/useTableContext'
import { useVirtualizerContext } from '../context/useVirtualizerContext'

export type ColumnVirtualizerWrapperProps = PropsWithChildren<TableCellProps>

export const ColumnVirtualizerWrapper = ({
	children,
	style,
	...rest
}: ColumnVirtualizerWrapperProps) => {
	const { virtualPaddingLeft, virtualPaddingRight } = useVirtualizerContext()
	const { table } = useTableContext()
	const leftLength = table.getLeftVisibleLeafColumns().length
	const rightLength = table.getRightVisibleLeafColumns().length
	const [leftChildren, centerChildren, rightChildren] = useMemo(() => {
		if (!Array.isArray(children)) {
			return [null, children, null]
		}
		const leftPinnedEnd = leftLength
		const rightPinnedEnd = children.length - rightLength

		return [
			children.slice(0, leftPinnedEnd),
			children.slice(leftPinnedEnd, rightPinnedEnd),
			children.slice(rightPinnedEnd),
		]
	}, [children, leftLength, rightLength])

	const getPaddingCell = (padding?: number, position = 'left') =>
		!!padding &&
		padding > 0 && (
			<TableCell
				className={`padding-cell padding-cell-${position}`}
				padding="none"
				{...rest}
				style={{ width: padding, ...style, zIndex: 0 }}
			/>
		)

	return (
		<>
			{leftChildren}
			{getPaddingCell(virtualPaddingLeft, 'left')}
			{centerChildren}
			{getPaddingCell(virtualPaddingRight, 'right')}
			{rightChildren}
		</>
	)
}
