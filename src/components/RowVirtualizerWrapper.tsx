import { Virtualizer } from '@tanstack/react-virtual'
import { PropsWithChildren } from 'react'

import { EmptyCell } from './EmptyCell'
import { Colors } from './styles'

const wrapperProps = {
	sx: {
		background: `repeating-linear-gradient(0deg, #ffffff, #ffffff 47px, ${Colors.Gray20} 47px, ${Colors.Gray20} 48px)`,
	},
}

type Props = PropsWithChildren<{
	colSpan?: number
	rowVirtualizer?: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}>
export const RowVirtualizerWrapper = ({
	colSpan,
	children,
	rowVirtualizer,
}: Props) => {
	if (!rowVirtualizer) return <>{children}</>

	const virtualItems = rowVirtualizer.getVirtualItems()
	const totalSize = rowVirtualizer.getTotalSize()
	const paddingTop = virtualItems.length > 0 ? virtualItems?.[0]?.start || 0 : 0
	const paddingBottom =
		virtualItems.length > 0
			? totalSize - (virtualItems?.[virtualItems.length - 1]?.end || 0)
			: 0

	return (
		<>
			{paddingTop > 0 && (
				<tr aria-label="virtual-padding-top">
					<EmptyCell
						colSpan={colSpan}
						style={{ height: `${paddingTop}px` }}
						wrapperProps={wrapperProps}
					/>
				</tr>
			)}
			{children}
			{paddingBottom > 0 && (
				<tr
					aria-label="virtual-padding-bottom"
					style={{ position: 'relative' }}
				>
					<EmptyCell
						colSpan={colSpan}
						style={{
							height: `${paddingBottom}px`,
						}}
						wrapperProps={wrapperProps}
					/>
				</tr>
			)}
		</>
	)
}
