/* eslint-disable no-param-reassign */
import { ThemeProvider } from '@mui/material'
import { ReactNode, useMemo } from 'react'

import { Table_Localization_EN } from '../_locales/en'
import { Table_AggregationFns } from '../aggregationFns'
import {
	Table_DefaultColumn,
	Table_DefaultDisplayColumn,
} from '../column.utils'
import { Table_FilterFns } from '../filterFns'
import { useTable } from '../hooks/useTable'
import { Default_Icons } from '../icons'
import { Table_SortingFns } from '../sortingFns'
import {
	Table_ColumnDef,
	Table_Localization,
	TableComponentProps,
} from '../TableComponent'
import { createTheme } from '../theme/createTheme'
import { DEFAULT_EXPAND_PADDING } from '../utilColumns'

import { TableContext } from './TableContext'

const defaultTheme = createTheme({})

export const TableProvider = <TData extends Record<string, any> = {}>({
	aggregationFns,
	autoResetExpanded = false,
	columnResizeMode = 'onEnd',
	children,
	defaultColumn,
	defaultDisplayColumn,
	editingMode = 'modal',
	enableBottomToolbar = true,
	enableBulkActions = true,
	enableBulkActionsCaptions = 'auto',
	enableBulkActionsSelect = true,
	enableColumnActions = true,
	enableColumnFilters = true,
	enableColumnOrdering = false,
	enableColumnResizing = false,
	enableDensityToggle = true,
	enableDragScrolling = true,
	enableExpandAll = true,
	enableFilters = true,
	enableFullScreenToggle = true,
	enableGlobalFilter = true,
	enableGlobalFilterRankedResults = true,
	enableGrouping = false,
	enableHiding = true,
	enableMultiRowSelection = true,
	enableMultiSort = true,
	enablePagination = false,
	enablePinning = false,
	enableRowSelection,
	enableRowNumbers = true,
	enableSelectAll = true,
	enableSorting = true,
	enableStickyHeader = false,
	enableStatusBar = true,
	enableTableFooter = true,
	enableTableHead = true,
	enableToolbarInternalActions = true,
	enableTopToolbar = true,
	expandPaddingSize = DEFAULT_EXPAND_PADDING,
	filterFns,
	groupBorder = '6px solid white',
	icons,
	innerTable = false,
	innerTableTitle,
	layoutMode = 'semantic',
	localization,
	manualFiltering,
	manualGrouping,
	manualPagination,
	manualSorting,
	positionActionsColumn = 'first',
	positionExpandColumn = 'first',
	positionGlobalFilter = 'right',
	positionPagination = 'bottom',
	positionToolbarAlertBanner = 'top',
	positionToolbarDropZone = 'top',
	rowNumberMode = 'original',
	selectAllMode = 'all',
	sortingFns,
	columns,
	theme,
	...rest
}: TableComponentProps<TData> & {
	children?: ReactNode | null
}) => {
	const _icons = useMemo(() => ({ ...Default_Icons, ...icons }), [icons])
	const _localization = useMemo(
		() => ({
			...Table_Localization_EN,
			...localization,
		}),
		[localization]
	)
	const _aggregationFns = useMemo(
		() => ({ ...Table_AggregationFns, ...aggregationFns }),
		[]
	)
	const _filterFns = useMemo(() => ({ ...Table_FilterFns, ...filterFns }), [])
	const _sortingFns = useMemo(
		() => ({ ...Table_SortingFns, ...sortingFns }),
		[]
	)
	const _defaultColumn = useMemo<Partial<Table_ColumnDef<TData>>>(
		() => ({ ...Table_DefaultColumn, ...defaultColumn }),
		[defaultColumn]
	)
	const _defaultDisplayColumn = useMemo<Partial<Table_ColumnDef<TData>>>(
		() => ({
			...(Table_DefaultDisplayColumn as unknown as Partial<
				Table_ColumnDef<TData>
			>),
			...defaultDisplayColumn,
		}),
		[defaultDisplayColumn]
	)

	const _columns = useMemo(
		() =>
			columns.map((col) => {
				if (col.filterVariant) {
					return col
				}

				return {
					...col,
					filterVariant: 'multi-select',
				}
			}),
		[columns]
	)

	if (rest.enableRowVirtualization || rest.enableColumnVirtualization) {
		layoutMode = 'grid'
	}

	if (rest.enableRowVirtualization) {
		enableStickyHeader = true
	}

	if (enablePagination === false && manualPagination === undefined) {
		manualPagination = true
	}

	if (!rest.data?.length) {
		manualFiltering = true
		manualGrouping = true
		manualPagination = true
		manualSorting = true
	}

	if (
		rest?.bulkActions?.length &&
		(enableRowSelection === null || enableRowSelection === undefined)
	) {
		enableRowSelection = true
	}

	const props = {
		aggregationFns: _aggregationFns,
		autoResetExpanded,
		columnResizeMode,
		defaultColumn: _defaultColumn,
		defaultDisplayColumn: _defaultDisplayColumn,
		editingMode,
		enableBottomToolbar,
		enableBulkActions,
		enableBulkActionsCaptions,
		enableBulkActionsSelect,
		enableColumnActions,
		enableColumnFilters,
		enableColumnOrdering,
		enableColumnResizing,
		enableDensityToggle,
		enableDragScrolling,
		enableExpandAll,
		enableFilters,
		enableFullScreenToggle,
		enableGlobalFilter,
		enableGlobalFilterRankedResults,
		enableGrouping,
		enableHiding,
		enableMultiRowSelection,
		enableMultiSort,
		enablePagination,
		enablePinning,
		enableRowSelection,
		enableRowNumbers,
		enableSelectAll,
		enableSorting,
		enableStickyHeader,
		enableStatusBar,
		enableTableFooter,
		enableTableHead,
		enableToolbarInternalActions,
		enableTopToolbar,
		expandPaddingSize,
		filterFns: _filterFns,
		groupBorder,
		icons: _icons,
		innerTable,
		innerTableTitle,
		layoutMode,
		localization: _localization,
		manualFiltering,
		manualGrouping,
		manualPagination,
		manualSorting,
		positionActionsColumn,
		positionExpandColumn,
		positionGlobalFilter,
		positionPagination,
		positionToolbarAlertBanner,
		positionToolbarDropZone,
		rowNumberMode,
		selectAllMode,
		sortingFns: _sortingFns,
		columns: _columns,
		theme: theme ?? defaultTheme,
		...rest,
	} as TableComponentProps<{}> & { localization: Table_Localization }

	const tableContext = useTable(props)

	return (
		<ThemeProvider theme={theme ?? defaultTheme}>
			<TableContext.Provider value={tableContext}>
				{children}
			</TableContext.Provider>
		</ThemeProvider>
	)
}
