import React, { FC } from 'react'
import MuiTableHead from '@mui/material/TableHead'
import type { VirtualItem } from '@tanstack/react-virtual'

import type { TableInstance } from '..'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'

import { TableHeadRow } from './TableHeadRow'

interface Props {
	table: TableInstance
	virtualColumns?: VirtualItem[]
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
	emptyTableHead?: boolean
}

export const TableHead: FC<Props> = ({
	table,
	virtualColumns,
	virtualPaddingLeft,
	virtualPaddingRight,
	emptyTableHead,
}) => {
	const {
		getHeaderGroups,
		getState,
		options: { enableStickyHeader, layoutMode, muiTableHeadProps },
	} = table
	const { isFullScreen } = getState()
	const stickyHeader = enableStickyHeader || isFullScreen
	const { isIntersecting, ref: intersectorRef } =
		useIntersectionObserver<HTMLTableSectionElement>({
			isEnabled: stickyHeader,
		})

	const tableHeadProps =
		muiTableHeadProps instanceof Function
			? muiTableHeadProps({ table })
			: muiTableHeadProps

	return (
		<MuiTableHead
			{...tableHeadProps}
			sx={(theme) => ({
				display: layoutMode === 'grid' ? 'grid' : 'table-row-group',
				opacity: 0.97,
				position: stickyHeader ? 'sticky' : 'relative',
				top: stickyHeader && layoutMode === 'grid' ? 0 : undefined,
				zIndex: stickyHeader ? 2 : undefined,
				...(tableHeadProps?.sx instanceof Function
					? tableHeadProps?.sx(theme)
					: (tableHeadProps?.sx as any)),
			})}
			ref={intersectorRef}
		>
			{!emptyTableHead ? (
				getHeaderGroups().map((headerGroup) => (
					<TableHeadRow
						headerGroup={headerGroup as any}
						key={headerGroup.id}
						table={table}
						virtualColumns={virtualColumns}
						virtualPaddingLeft={virtualPaddingLeft}
						virtualPaddingRight={virtualPaddingRight}
						stickyHeader={stickyHeader}
						isScrolled={!isIntersecting}
					/>
				))
			) : (
				<tr
					style={{
						display: stickyHeader && !isIntersecting ? 'table-row' : 'none',
						position: stickyHeader ? 'sticky' : 'relative',
						top: 0,
						height: '8px',
						boxShadow:
							stickyHeader && !isIntersecting
								? 'inset 0px 4px 4px 0px rgba(0, 0, 0, 0.10)'
								: undefined,
					}}
				/>
			)}
		</MuiTableHead>
	)
}
