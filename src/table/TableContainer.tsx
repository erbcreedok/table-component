import {
	FC,
	MutableRefObject,
	useEffect,
	useLayoutEffect,
	useState,
} from 'react'
import MuiTableContainer from '@mui/material/TableContainer'

import type { TableInstance } from '..'
import {
	DragScrollingContainer,
	StickyHorizontalScrollbar,
} from '../components'
import { useStickyScrollbar } from '../hooks/useStickyScrollbar'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'

import { Table } from './Table'

const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface Props {
	table: TableInstance
}

export const TableContainer: FC<Props> = ({ table }) => {
	const {
		getState,
		options: {
			enableStickyHeader,
			muiTableContainerProps,
			enableDragScrolling,
			enableRowVirtualization,
			enableStickyScrollbars,
			windowVirtualizer,
			rowVirtualizerProps,
		},
		refs: { tableContainerRef, bottomToolbarRef, topToolbarRef },
		setStickyHorizontalScrollbarHeight,
	} = table
	const { isFullScreen } = getState()

	const [totalToolbarHeight, setTotalToolbarHeight] = useState(0)

	const tableContainerProps =
		muiTableContainerProps instanceof Function
			? muiTableContainerProps({ table })
			: muiTableContainerProps

	useIsomorphicLayoutEffect(() => {
		const topToolbarHeight =
			typeof document !== 'undefined'
				? topToolbarRef.current?.offsetHeight ?? 0
				: 0

		const bottomToolbarHeight =
			typeof document !== 'undefined'
				? bottomToolbarRef?.current?.offsetHeight ?? 0
				: 0

		setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight)
	})

	const { handleContainerRef, handleScrollbarRef } = useStickyScrollbar({
		enabled: enableStickyScrollbars?.horizontal === true,
		onHorizontalScrollbarHeight: setStickyHorizontalScrollbarHeight,
		parentRef: enableStickyScrollbars?.relativeParentRef,
	})

	const vProps = getValueOrFunctionHandler(rowVirtualizerProps)({ table })

	const isTableContainerScroll =
		(enableStickyHeader || enableRowVirtualization) &&
		!windowVirtualizer &&
		!vProps?.getScrollElement

	return (
		<>
			<MuiTableContainer
				{...tableContainerProps}
				{...(enableDragScrolling ? { component: DragScrollingContainer } : {})}
				ref={(node: HTMLDivElement) => {
					if (node) {
						tableContainerRef.current = node
						if (tableContainerProps?.ref) {
							if (tableContainerProps.ref instanceof Function) {
								tableContainerProps.ref(node)
							} else {
								const tableContainerPropsRef =
									tableContainerProps.ref as MutableRefObject<HTMLDivElement>
								tableContainerPropsRef.current = node
							}
						}
					}
					handleContainerRef(node)
				}}
				sx={(theme) => ({
					maxWidth: '100%',
					maxHeight: isTableContainerScroll
						? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
						: undefined,
					overflow: 'auto',
					...(tableContainerProps?.sx instanceof Function
						? tableContainerProps.sx(theme)
						: (tableContainerProps?.sx as any)),
				})}
				style={{
					maxHeight: isFullScreen
						? `calc(100vh - ${totalToolbarHeight}px)`
						: undefined,
					...tableContainerProps?.style,
				}}
			>
				<Table table={table} />
			</MuiTableContainer>
			<StickyHorizontalScrollbar ref={handleScrollbarRef} />
		</>
	)
}
