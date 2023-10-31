import React, { FC } from 'react'
import MuiTableHead from '@mui/material/TableHead'
import type { VirtualItem } from '@tanstack/react-virtual'

import type { TableInstance, Table_HeaderGroup } from '..'
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'
import { useMultiSticky } from '../hooks/useMultiSticky'
import { getHeaderGroupFilteredByDisplay } from '../utils/getFilteredByDisplay'

import { TableHeadRow } from './TableHeadRow'
import { TableHeadMultiRow } from './TableHeadMultiRow'

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
		options: {
			enableStickyHeader,
			layoutMode,
			muiTableHeadProps,
			multirowHeader,
		},
	} = table
	const { isFullScreen } = getState()
	const stickyHeader = enableStickyHeader || isFullScreen
	const { isIntersecting, ref: intersectorRef } =
		useIntersectionObserver<HTMLTableSectionElement>({
			isEnabled: stickyHeader,
		})
	const { registerSticky, stickyElements } = useMultiSticky()

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
			{!emptyTableHead && multirowHeader && (
				<TableHeadMultiRow
					table={table}
					multirowHeader={multirowHeader}
					isScrolled={!isIntersecting}
					virtualColumns={virtualColumns}
					virtualPaddingLeft={virtualPaddingLeft}
					virtualPaddingRight={virtualPaddingRight}
					registerSticky={registerSticky}
					stickyElements={stickyElements}
				/>
			)}
			{!emptyTableHead ? (
				(getHeaderGroups() as Table_HeaderGroup[]).map((headerGroup) => (
					<TableHeadRow
						headerGroup={getHeaderGroupFilteredByDisplay(headerGroup)}
						key={headerGroup.id}
						table={table}
						virtualColumns={virtualColumns}
						virtualPaddingLeft={virtualPaddingLeft}
						virtualPaddingRight={virtualPaddingRight}
						stickyHeader={stickyHeader}
						isScrolled={!isIntersecting}
						registerSticky={registerSticky}
						stickyElements={stickyElements}
					/>
				))
			) : (
				<tr
					style={{
						visibility: stickyHeader && !isIntersecting ? 'visible' : 'hidden',
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
