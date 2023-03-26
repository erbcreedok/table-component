import TableComponent from './TableComponent'
import type { Table_Icons } from './icons'
import { CopyButton } from './buttons/CopyButton'
import { FilterOptionMenu } from './menus/FilterOptionMenu'
import { FullScreenToggleButton } from './buttons/FullScreenToggleButton'
import { GlobalFilterTextField } from './inputs/GlobalFilterTextField'
import { ShowHideColumnsButton } from './buttons/ShowHideColumnsButton'
import { TablePagination } from './toolbar/TablePagination'
import { ToggleFiltersButton } from './buttons/ToggleFiltersButton'
import { ToggleGlobalFilterButton } from './buttons/ToggleGlobalFilterButton'
import { ToolbarAlertBanner } from './toolbar/ToolbarAlertBanner'
import { ToolbarDropZone } from './toolbar/ToolbarDropZone'
import { ToolbarInternalButtons } from './toolbar/ToolbarInternalButtons'
import { ToggleRowActionMenuButton } from './buttons/ToggleRowActionMenuButton'
import { TopToolbar } from './toolbar/TopToolbar'
import { BottomToolbar } from './toolbar/BottomToolbar'
import { createTheme } from './theme/createTheme'

export default TableComponent
export * from './TableComponent'
export type { Table_Icons }

export {
	CopyButton,
	FilterOptionMenu,
	FullScreenToggleButton,
	GlobalFilterTextField,
	ShowHideColumnsButton,
	TablePagination,
	ToggleFiltersButton,
	ToggleGlobalFilterButton,
	ToolbarAlertBanner,
	ToolbarDropZone,
	ToolbarInternalButtons,
	ToggleRowActionMenuButton,
	TopToolbar,
	BottomToolbar,
	createTheme,
}
