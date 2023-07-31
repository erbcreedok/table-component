import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import MuiTableContainer from '@mui/material/TableContainer'

import type { TableInstance } from '..'

import { Table } from './Table'

const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface Props {
	table: TableInstance
}

export const TableContainer: FC<Props> = ({ table }) => {
	const {
		getState,
		options: { enableStickyHeader, muiTableContainerProps },
		refs: { tableContainerRef, bottomToolbarRef, topToolbarRef },
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

	return (
		<MuiTableContainer
			{...tableContainerProps}
			ref={(node: HTMLDivElement) => {
				if (node) {
					tableContainerRef.current = node
					if (tableContainerProps?.ref) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						tableContainerProps.ref.current = node
					}
				}
			}}
			sx={(theme) => ({
				maxWidth: '100%',
				maxHeight: enableStickyHeader
					? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
					: undefined,
				overflow: 'auto',
				position: 'relative',
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
	)
}
