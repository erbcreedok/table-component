import { useMemo } from 'react'

import { Default_Table_Props } from '../constants'
import {
	TableComponentProps,
	Table_Localization,
	Table_ColumnDef,
	TableComponentPropsDefined,
} from '../TableComponent'
import { Default_Icons } from '../icons'
import { Table_Localization_EN } from '../_locales/en'
import { Table_AggregationFns } from '../aggregationFns'
import { Table_FilterFns } from '../filterFns'
import { Table_SortingFns } from '../sortingFns'
import {
	Table_DefaultColumn,
	Table_DefaultDisplayColumn,
} from '../column.utils'
import { createTheme } from '../theme/createTheme'
import { defaultSetSubRows } from '../utils/defaultGetSubRows'

import { HierarchyTreeConfig } from './useTableHierarchy'

const defaultTheme = createTheme({})
export const useTableInitialization = <TData extends Record<string, any>>(
	initialProps: TableComponentProps<TData>
): TableComponentPropsDefined<TData> => {
	const props = { ...Default_Table_Props, ...initialProps }
	const icons = useMemo(
		() => ({ ...Default_Icons, ...props.icons }),
		[props.icons]
	)
	const localization = useMemo<Table_Localization>(
		() => ({
			...Table_Localization_EN,
			...props.localization,
		}),
		[props.localization]
	)
	const aggregationFns = useMemo(
		() => ({ ...Table_AggregationFns, ...props.aggregationFns }),
		[props.aggregationFns]
	)
	const filterFns = useMemo(
		() => ({ ...Table_FilterFns, ...props.filterFns }),
		[props.filterFns]
	)
	const sortingFns = useMemo(
		() => ({ ...Table_SortingFns, ...props.sortingFns }),
		[props.sortingFns]
	)
	const defaultColumn = useMemo<Partial<Table_ColumnDef<TData>>>(
		() => ({ ...Table_DefaultColumn, ...props.defaultColumn }),
		[props.defaultColumn]
	)
	const defaultDisplayColumn = useMemo<Partial<Table_ColumnDef<TData>>>(
		() => ({
			...(Table_DefaultDisplayColumn as any),
			...props.defaultDisplayColumn,
		}),
		[props.defaultDisplayColumn]
	)

	const columns = useMemo<Table_ColumnDef<TData>[]>(
		() =>
			props.columns.map((col) => {
				if (col.filterVariant) {
					return col
				}

				return {
					...col,
					filterVariant: 'multi-select',
				}
			}),
		[props.columns]
	)

	const hierarchyTreeConfig = useMemo(() => {
		if (props.getIsUnitTreeItem && !props.hierarchyTreeConfig) {
			return {
				isHierarchyItem: props.getIsUnitTreeItem,
			} as HierarchyTreeConfig<TData>
		}

		return props.hierarchyTreeConfig
	}, [props.getIsUnitTreeItem, props.hierarchyTreeConfig])

	const defaultCollapsedMultiRow = useMemo(() => {
		if (!props.enableMultirowExpandCollapse) {
			return []
		}

		return props.multirowHeader?.reduce((acc, curr) => {
			const collapsedColumns = curr.columns
				.filter((el) => el.collapsed)
				.map((el) => ({
					id: el?.shorthandText ?? el.text,
					colIds: el.columnIds,
				}))

			acc.push(...collapsedColumns)

			return acc
		}, [] as { id: string; colIds: string[] }[])
	}, [props.multirowHeader, props.enableMultirowExpandCollapse])

	if (props.manualPagination === undefined) {
		props.manualPagination = !props.enablePagination
	}

	if (props.onInfiniteScrollLoad) {
		props.enablePagination = 'scroll'
		props.manualPagination = true
	}

	if (!props.data?.length) {
		props.manualFiltering = true
		props.manualGrouping = true
		props.manualPagination = true
		props.manualSorting = true
	}

	if (
		props?.bulkActions?.length &&
		(props.enableRowSelection === null ||
			props.enableRowSelection === undefined)
	) {
		props.enableRowSelection = true
	}

	return {
		...props,
		aggregationFns,
		columns,
		defaultColumn,
		defaultDisplayColumn,
		defaultCollapsedMultiRow,
		enableGroupSelection: props.enableBulkActions || !!props.enableRowSelection,
		enablePagination:
			props.enablePagination === true ? 'pages' : props.enablePagination,
		filterFns,
		hierarchyTreeConfig,
		icons,
		localization,
		originalColumns: props.columns,
		setSubRows: props.setSubRows ?? defaultSetSubRows<TData>,
		sortingFns,
		theme: props.theme ?? defaultTheme,
	}
}
