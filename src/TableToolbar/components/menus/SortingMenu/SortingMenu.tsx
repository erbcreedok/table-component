import { useMemo, useState } from 'react'
import Box from '@mui/material/Box'
import { Typography } from '@mui/material'

import { TableData } from '../../../../index'
import type { TableInstance, Table_Column } from '../../../../index'
import { SimpleMenuItem } from '../components/SimpleMenuItem'
import { ButtonLink } from '../../../../components/ButtonLink'
import { getColumnId, reorderColumn } from '../../../../column.utils'
import { ListTitle } from '../../../../components/ListTitle'
import { Sidebar } from '../../../../components/Sidebar'
import { withNativeEvent } from '../../../../utils/withNativeEvent'

interface Props<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
}

export const defaultOrganizeSortingMenu = <TData extends TableData = {}>(
	allColumns: Table_Column<TData>[]
) => allColumns.filter((col) => col.getIsVisible() && col.getCanSort())

export const SortingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
}: Props<TData>) => {
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false)
	const {
		getAllLeafColumns,
		getState,
		resetSorting,
		options: {
			innerTable,
			localization,
			suggestedColumns,
			organizeSortingMenu = defaultOrganizeSortingMenu,
		},
	} = table
	const { sorting } = getState()
	const [searchList, setSearchList] = useState<Array<Table_Column<TData>>>([])
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)
	const handleCloseClick = () => setAnchorEl(null)
	const allColumns = organizeSortingMenu(getAllLeafColumns())
	const sortedList = (sorting || []).map((item) =>
		allColumns.find((col) => getColumnId(col.columnDef) === item.id)
	)

	const [unsortedList, areSuggestedShown] = useMemo(() => {
		const unsorted = allColumns.filter((col) => !col.getIsSorted())

		if (suggestedColumns?.sorting) {
			const suggested = unsorted.filter(({ id }) =>
				suggestedColumns.sorting?.includes(id)
			)

			if (suggested.length) return [suggested, true]
		}

		return [unsorted, false]
	}, [allColumns, suggestedColumns])

	const handleOnSearchChange = (value: string) => {
		if (value) {
			setIsSearchActive(true)
		} else {
			setIsSearchActive(false)
		}
		setSearchList(
			value.length
				? unsortedList.filter((col) =>
						col.columnDef.header.toLowerCase().includes(value)
				  )
				: []
		)
	}

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		const currentOrder = sorting?.map((col) => col.id)
		const newOrder = reorderColumn(column, hovered, currentOrder)

		resetSorting(true)

		newOrder.forEach((id) => {
			const target = allColumns.find(
				(col) => getColumnId(col.columnDef) === id
			) as Table_Column<TData>
			const targetDirection = sorting?.find((item) => item.id === target.id)
			target.toggleSorting(targetDirection?.desc, true)
		})
	}

	const removeAllSorted = () => {
		resetSorting(true)
	}

	return (
		<Sidebar
			open={!!anchorEl}
			onClose={handleCloseClick}
			styles={{ minWidth: 600 }}
			withHeader
			withSearch
			headerTitle={localization.sort}
			onSearchChange={withNativeEvent<string, TData>(
				{ el: 'SortingMenu_Search', type: 'keypress' },
				table
			)(handleOnSearchChange)}
			onSearchClear={withNativeEvent(
				{ el: 'SortingMenu_Search_Clear', type: 'click' },
				table
			)(() => null)}
			innerTableSidebar={innerTable}
		>
			<Box sx={{ marginTop: '12px' }}>
				{isSearchActive &&
					(searchList.length ? (
						searchList.map((column) => (
							<SimpleMenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								isSorting
							/>
						))
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							No options
						</Typography>
					))}

				{Boolean(sortedList?.length && !searchList.length) && (
					<>
						<Box
							sx={{
								padding: '0 24px',
								margin: '12px 0 20px 0',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center',
							}}
						>
							<ListTitle>Sorted</ListTitle>
							<ButtonLink onClick={removeAllSorted}>Remove all</ButtonLink>
						</Box>

						{sortedList?.map((column) => (
							<SimpleMenuItem
								column={column as Table_Column<TData>}
								key={(column as Table_Column<TData>).id}
								enableDrag={sortedList?.length > 1}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								isSorting
								isCompact
							/>
						))}
					</>
				)}

				<>
					{((!!sortedList?.length &&
						!searchList.length &&
						!!unsortedList.length) ||
						areSuggestedShown) && (
						<ListTitle sx={{ padding: '0 24px', margin: '20px 0' }}>
							{areSuggestedShown
								? localization.suggested
								: localization.columns}
						</ListTitle>
					)}
					{Boolean(
						unsortedList.length && !searchList.length && !isSearchActive
					) &&
						unsortedList.map((column) => (
							<SimpleMenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								isSorting
							/>
						))}
				</>
			</Box>
		</Sidebar>
	)
}
