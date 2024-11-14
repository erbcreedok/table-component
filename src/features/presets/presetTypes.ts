import {
	ColumnFiltersState,
	ColumnOrderState,
	GroupingState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table'

import { TableData, TableInstance } from '../../TableComponent'
import { FunctionProps } from '../../types'

export interface PresetState {
	columnOrder?: ColumnOrderState
	grouping?: GroupingState
	sorting?: SortingState
	columnFilters?: ColumnFiltersState
	columnVisibility?: VisibilityState
}
export interface Preset {
	id: number
	name: string
	checked: boolean
	suggested: boolean
	state: PresetState
}

type NotificationArgs<TData = TableData> = {
	isCurrentPresetEmpty: boolean
	isPresetMenuOpen: boolean
	isPresetStateSame: boolean
	table: TableInstance<TData>
}

export type TablePropsWithPresets<TData = TableData> = {
	enablePresets?: boolean
	onGetDefaultPresets?: (state?: PresetState) => Preset[]
	onGetPresets?: () => Preset[]
	onSavePresets?: (presets: Preset[]) => void
	showPresetChangedDot?: FunctionProps<boolean, NotificationArgs<TData>>
	showPresetNotification?: FunctionProps<boolean, NotificationArgs<TData>>
	tablePresetsStorageId?: string
}

export type TableInstanceWithPresets = {
	createNewPreset: (name: string, presetState?: PresetState) => void
	deletePreset: (presetId: number) => void
	getCurrentPreset: () => Preset | undefined
	getCurrentPresetState: () => PresetState
	getCustomPresets: () => Preset[]
	getIsCurrentPresetEmpty: () => boolean
	getIsPresetStateSame: () => boolean
	getPresets: () => Preset[]
	getSuggestedPresets: () => Preset[]
	setCurrentPreset: (presetId: number) => void
	setPresets: (presets: Preset[]) => void
	updateCurrentPresetState: () => void
	updatePresetName: (presetId: number, name: string) => void
}
