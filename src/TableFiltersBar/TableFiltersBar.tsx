import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import type { TableInstance } from '../index'

import { GroupingChip } from './GroupingChip/GroupingChip'
import { useGroupingControls } from './filter-bar-hooks/useGroupingControls'
import { SortingChip } from './SortingChip/SortingChip'
import { FilterChip } from './FilterChip/FilterChip'
import { useFilterControls } from './filter-bar-hooks/useFilterControls'
import { CommonChipWithPopover } from './CommonChipWithPopover/CommonChipWithPopover'

interface Props<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
}

export const TableFiltersBar = <TData extends Record<string, any> = {}>({
	table,
}: Props<TData>) => {
	const { getState, resetSorting, resetColumnFilters } = table

	const { grouping, sorting } = getState()

	const barRef = useRef<HTMLDivElement>(null)

	const [visibleElements, setVisibleElements] = useState<Element[]>([])
	const [hiddenElements, setHiddenElements] = useState<Element[]>([])

	const { removeAllGroup } = useGroupingControls(table)
	const { columnFilters = [], columnsIdToHeaderMap } = useFilterControls(table)

	const handleClearAll = () => {
		removeAllGroup()
		resetSorting()
		resetColumnFilters()
		setVisibleElements([])
		setHiddenElements([])
	}

	const isGroupingExists = Boolean(grouping?.length)
	const isSortingExists = Boolean(sorting?.length)
	const isFiltersExists = Boolean(columnFilters?.length)
	const isShowClearAll = isGroupingExists || isSortingExists || isFiltersExists

	useEffect(() => {
		if (!barRef?.current || !columnFilters.length) {
			setVisibleElements([])
			setHiddenElements([])

			return
		}

		const elements = columnFilters.map((filter) => {
			return (
				<FilterChip
					key={filter.id}
					filterId={filter.id}
					headerTile={columnsIdToHeaderMap[filter.id].header}
					table={table}
				/>
			)
		})

		const groupingWidth = table.getState()?.grouping?.length > 0 ? 240 : 0
		const sortingWidth = table.getState()?.sorting?.length > 0 ? 240 : 0
		const RESERVED_WIDTH = 380
		const totalElementsWidth =
			240 * elements.length + groupingWidth + sortingWidth + RESERVED_WIDTH

		const conatinerWidth = barRef?.current?.getBoundingClientRect().width

		if (totalElementsWidth > conatinerWidth) {
			let total = 0
			const hidden: Element[] = []
			const visible: Element[] = []

			elements.forEach((element) => {
				if (total > conatinerWidth - 860) {
					hidden.push(element)

					total += 240

					return
				}

				visible.push(element)
				total += 240
			})

			setHiddenElements(hidden)
			setVisibleElements(visible)

			return
		}

		setVisibleElements(elements)
	}, [columnFilters, table])

	return (
		<Box
			ref={barRef}
			sx={{
				alignItems: 'center',
				display: 'flex',
				zIndex: 3,
				padding: '12px',
			}}
		>
			<GroupingChip table={table} />

			<SortingChip table={table} />

			{visibleElements.map((element) => {
				return element
			})}

			{Boolean(hiddenElements.length) && (
				<CommonChipWithPopover
					text={`+${hiddenElements.length} more`}
					dropdownContent={
						<div style={{ padding: 12 }}>
							{hiddenElements.map((element) => (
								<div key={element.id} style={{ marginBottom: 4 }}>
									{element}
								</div>
							))}
						</div>
					}
				/>
			)}

			{isShowClearAll && (
				<Typography
					onClick={handleClearAll}
					style={{ color: '#009ECC', cursor: 'pointer' }}
				>
					Clear all
				</Typography>
			)}
		</Box>
	)
}
