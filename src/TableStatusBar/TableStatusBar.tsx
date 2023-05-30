import styled from '@emotion/styled'
import React, { useEffect, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { ButtonBase } from '@mui/material'

import { Colors } from '../components/styles'
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
const ClearAllButton = styled(ButtonBase)`
	color: ${Colors.LightBlue};
	font-size: 12px;
	visibility: hidden;
	margin-left: 9px;
	font-weight: 600;
`
const Wrapper = styled(Box)<{ hidden?: boolean }>`
	align-items: center;
	display: flex;
	z-index: 3;
	padding: 12px;
	gap: 6px;
	${({ hidden }) => hidden && `display: none;`}
	${ClearAllButton} {
		visibility: hidden;
	}
	&:hover ${ClearAllButton} {
		visibility: visible;
	}
`
const Line = styled(Box)`
	width: 1px;
	height: 24px;
	margin: 0 3px;
	background-color: ${Colors.gray};
`

export const TableStatusBar = <TData extends Record<string, any> = {}>({
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
	const isAnyChipVisible =
		isGroupingExists || isSortingExists || isFiltersExists

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

		const containerWidth = barRef?.current?.getBoundingClientRect().width

		if (totalElementsWidth > containerWidth) {
			let total = 0
			const hidden: Element[] = []
			const visible: Element[] = []

			elements.forEach((element) => {
				if (total > containerWidth - 860) {
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
		<Wrapper ref={barRef} hidden={!isAnyChipVisible}>
			<GroupingChip table={table} />

			<SortingChip table={table} />

			{isGroupingExists && isSortingExists && visibleElements.length > 0 && (
				<Line />
			)}

			{visibleElements}

			{Boolean(hiddenElements.length) && (
				<CommonChipWithPopover
					table={table}
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

			<ClearAllButton onClick={handleClearAll}>Clear all</ClearAllButton>
		</Wrapper>
	)
}
