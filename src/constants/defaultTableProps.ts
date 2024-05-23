import { DEFAULT_EXPAND_PADDING } from '../utilColumns'
import { getDefaultPinnedColumnPosition } from '../utils/getDefaultPinnedColumnPosition'

export const Default_Table_Props = {
	autoResetExpanded: false,
	columnResizeMode: 'onEnd',
	editingMode: 'modal',
	enableBottomToolbar: true,
	enableBulkActions: true,
	enableBulkActionsCaptions: 'auto',
	enableBulkActionsSelect: true,
	enableColumnActions: true,
	enableColumnFilters: true,
	enableColumnOrdering: false,
	enableColumnResizing: false,
	enableDensityToggle: true,
	enableDragScrolling: true,
	enableExpandAll: true,
	enableFilters: true,
	enableFullScreenToggle: true,
	enableGlobalFilter: true,
	enableGlobalFilterRankedResults: true,
	enableGrouping: false,
	enableGroupCollapsing: false,
	enableGroupCount: true,
	enableHiding: true,
	enableMultirowExpandCollapse: false,
	enableMultiRowSelection: true,
	enableMultiSort: true,
	enablePinning: false,
	enableRowNumbers: true,
	enableSelectAll: true,
	enableSorting: true,
	enableStickyHeader: false,
	enableStatusBar: true,
	enableTableFooter: true,
	enableTableHead: true,
	enableToolbarInternalActions: true,
	enableTopToolbar: true,
	expandPaddingSize: DEFAULT_EXPAND_PADDING,
	getRowId: (_, index, parentRow) =>
		`${parentRow ? [parentRow.id, index].join('_') : index}`,
	getPinnedColumnPosition: getDefaultPinnedColumnPosition,
	groupBorder: '6px solid white',
	innerTable: false,
	layoutMode: 'semantic',
	mockRowStyles: { opacity: 0.5 },
	multirowColumnsDisplayDepth: 1,
	positionActionsColumn: 'first',
	positionExpandColumn: 'first',
	positionGlobalFilter: 'right',
	positionPagination: 'bottom',
	positionToolbarAlertBanner: 'top',
	positionToolbarDropZone: 'top',
	rowNumberMode: 'original',
	selectAllMode: 'all',
} as const
