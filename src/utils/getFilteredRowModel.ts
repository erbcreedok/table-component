import {
	memo,
	ResolvedColumnFilter,
	Row,
	RowData,
	RowModel,
	Table,
} from '@tanstack/table-core'

import { Table_ColumnDef } from '..'

import { filterRows } from './filterRowsUtils'
import { getNestedValueRow } from './getNestedProp'

interface ResolvedColumnFilteringKey<TData extends RowData>
	extends ResolvedColumnFilter<TData>,
		Pick<Table_ColumnDef, 'filteringKey'> {}

export function getFilteredRowModel<TData extends RowData>(): (
	table: Table<TData>
) => () => RowModel<TData> {
	return (table) =>
		memo(
			() => [
				table.getPreFilteredRowModel(),
				table.getState().columnFilters,
				table.getState().globalFilter,
			],
			(rowModel, columnFilters, globalFilter) => {
				if (
					!rowModel.rows.length ||
					(!columnFilters?.length && !globalFilter)
				) {
					for (let i = 0; i < rowModel.flatRows.length; i++) {
						rowModel.flatRows[i].columnFilters = {}
						rowModel.flatRows[i].columnFiltersMeta = {}
					}

					return rowModel
				}

				const resolvedColumnFilters: ResolvedColumnFilteringKey<TData>[] = []
				const resolvedGlobalFilters: ResolvedColumnFilteringKey<TData>[] = []

				;(columnFilters ?? []).forEach((d) => {
					const column = table.getColumn(d.id)

					if (!column) {
						if (process.env.NODE_ENV !== 'production') {
							console.warn(
								`Table: Could not find a column to filter with columnId: ${d.id}`
							)
						}

						return
					}

					const { columnDef } = column
					const { filteringKey } = columnDef as Table_ColumnDef

					const filterFn = column.getFilterFn()

					if (!filterFn) {
						if (process.env.NODE_ENV !== 'production') {
							console.warn(
								`Could not find a valid 'column.filterFn' for column with the ID: ${column.id}.`
							)
						}

						return
					}

					resolvedColumnFilters.push({
						id: d.id,
						filterFn,
						resolvedValue: filterFn.resolveFilterValue?.(d.value) ?? d.value,
						filteringKey,
					})
				})

				const filterableIds = columnFilters.map((d) => d.id)

				const globalFilterFn = table.getGlobalFilterFn()

				const globallyFilterableColumns = table
					.getAllLeafColumns()
					.filter((column) => column.getCanGlobalFilter())

				if (
					globalFilter &&
					globalFilterFn &&
					globallyFilterableColumns.length
				) {
					filterableIds.push('__global__')

					globallyFilterableColumns.forEach((column) => {
						const { id, columnDef } = column
						const { filteringKey } = columnDef as Table_ColumnDef
						resolvedGlobalFilters.push({
							id,
							filterFn: globalFilterFn,
							resolvedValue:
								globalFilterFn.resolveFilterValue?.(globalFilter) ??
								globalFilter,
							filteringKey,
						})
					})
				}

				let currentColumnFilter
				let currentGlobalFilter

				// Flag the prefiltered row model with each filter state
				for (let j = 0; j < rowModel.flatRows.length; j++) {
					const row = rowModel.flatRows[j]

					row.columnFilters = {}

					if (resolvedColumnFilters.length) {
						for (let i = 0; i < resolvedColumnFilters.length; i++) {
							currentColumnFilter = resolvedColumnFilters[i]
							const { id, filteringKey } = currentColumnFilter

							// Tag the row with the column filter state
							row.columnFilters[id] = currentColumnFilter.filterFn(
								...(filteringKey
									? [getNestedValueRow(row), filteringKey]
									: [row, id]),
								currentColumnFilter.resolvedValue,
								(filterMeta) => {
									row.columnFiltersMeta[id] = filterMeta
								}
							)
						}
					}

					if (resolvedGlobalFilters.length) {
						for (let i = 0; i < resolvedGlobalFilters.length; i++) {
							currentGlobalFilter = resolvedGlobalFilters[i]
							const { id, filteringKey } = currentGlobalFilter
							// Tag the row with the first truthy global filter state
							if (
								currentGlobalFilter.filterFn(
									...(filteringKey
										? [getNestedValueRow(row), filteringKey]
										: [row, id]),
									currentGlobalFilter.resolvedValue,
									(filterMeta) => {
										row.columnFiltersMeta[id] = filterMeta
									}
								)
							) {
								row.columnFilters.__global__ = true
								break
							}
						}

						if (row.columnFilters.__global__ !== true) {
							row.columnFilters.__global__ = false
						}
					}
				}

				const filterRowsImpl = (row: Row<TData>) => {
					// Horizontally filter rows through each column
					for (let i = 0; i < filterableIds.length; i++) {
						if (row.columnFilters[filterableIds[i]] === false) {
							return false
						}
					}

					return true
				}

				// Filter final rows using all of the active filters
				return filterRows(rowModel.rows, filterRowsImpl, table)
			},
			{
				key: process.env.NODE_ENV === 'development' && 'getFilteredRowModel',
				debug: () => table.options.debugAll ?? table.options.debugTable,
				onChange: () => {
					table._autoResetPageIndex()
				},
			}
		)
}
