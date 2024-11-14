import { memo } from '@tanstack/table-core'
import { useCallback, useEffect, useMemo } from 'react'

import { Table_TableState, TableInstance } from '../../TableComponent'
import { getValidColumnOrder } from '../../utils/getValidColumnOrder'

import { getDefaultPreset } from './presetConstants'
import { getIsPresetStateSame, isPresetStateEmpty } from './presetHelpers'
import { Preset, PresetState } from './presetTypes'

export const usePresets = (
	table: TableInstance,
	initialState: Partial<Table_TableState>
) => {
	const {
		options: {
			enablePresets,
			onGetDefaultPresets,
			onGetPresets,
			onSavePresets,
			tablePresetsStorageId = 'tablePresets',
		},
	} = table

	const defaultPresets = useMemo(
		() =>
			onGetDefaultPresets?.(initialState) ?? [getDefaultPreset(initialState)],
		[initialState, onGetDefaultPresets]
	)

	const getPresets = useCallback(
		() =>
			onGetPresets?.() ??
			(JSON.parse(localStorage.getItem(tablePresetsStorageId) as string) ||
				defaultPresets),
		[defaultPresets, onGetPresets, tablePresetsStorageId]
	)

	const savePresets = useCallback(
		(presets) => {
			if (onSavePresets) {
				onSavePresets(presets)
			} else {
				localStorage.setItem(tablePresetsStorageId, JSON.stringify(presets))
			}
		},
		[onSavePresets, tablePresetsStorageId]
	)

	const applyPresetState = useCallback(
		({
			columnOrder,
			grouping,
			sorting,
			columnFilters,
			columnVisibility,
		}: PresetState) => {
			table.setColumnOrder(getValidColumnOrder(table.options, columnOrder))
			table.setGrouping(() => grouping ?? [])
			table.setSorting(sorting ?? [])
			table.setColumnFilters(columnFilters ?? [])
			table.setColumnVisibility(columnVisibility ?? {})
		},
		[table]
	)

	table.getPresets = memo(
		() => [JSON.stringify(getPresets())],
		() =>
			getPresets().sort(
				({ id: firstId }, { id: secondId }) => firstId - secondId
			),
		{ key: 'getPresets' }
	)
	table.getSuggestedPresets = memo(
		() => [table.getPresets()],
		(presets) => presets.filter(({ suggested }) => !!suggested),
		{ key: 'getSuggestedPresets' }
	)
	table.getCustomPresets = memo(
		() => [table.getPresets()],
		(presets) => presets.filter(({ suggested }) => !suggested),
		{ key: 'getCustomPresets' }
	)
	table.setPresets = useCallback(
		(presets: Preset[]) => {
			savePresets(presets)
		},
		[savePresets]
	)
	table.getCurrentPreset = memo(
		() => [table.getPresets()],
		(presets) => presets.find(({ checked }) => checked) ?? presets[0],
		{ key: 'getCurrentPreset' }
	)
	table.setCurrentPreset = useCallback(
		(presetId: number) => {
			const presets = table.getPresets()
			const newPresets = presets.map((preset) => ({
				...preset,
				checked: false,
			}))
			const newCurrentPreset = newPresets.find(({ id }) => id === presetId)
			if (newCurrentPreset) {
				newCurrentPreset.checked = true
				applyPresetState(newCurrentPreset.state)
				table.setPresets(newPresets)
			} else {
				console.error(`Preset with id ${presetId} was not found`)
			}
		},
		[applyPresetState, table]
	)
	table.getCurrentPresetState = memo(
		() => [
			table.getState().columnFilters,
			table.getState().columnOrder,
			table.getState().columnVisibility,
			table.getState().grouping,
			table.getState().sorting,
		],
		(columnFilters, columnOrder, columnVisibility, grouping, sorting) => ({
			columnFilters,
			columnOrder,
			columnVisibility,
			grouping,
			sorting,
		}),
		{
			key: 'getCurrentPresetState',
		}
	)

	table.createNewPreset = useCallback(
		(name: string, presetState?: PresetState) => {
			const presets = table.getPresets()
			const id = (presets.at(-1)?.id ?? -1) + 1

			const newPreset = {
				id,
				name,
				checked: true,
				suggested: false,
				state: presetState ?? table.getCurrentPresetState(),
			}

			const newPresets = [
				...presets.map((preset) => ({ ...preset, checked: false })),
				newPreset,
			]

			table.setPresets(newPresets)
			table.setCurrentPreset(id)
		},
		[table]
	)

	table.updateCurrentPresetState = useCallback(() => {
		const presets = table.getPresets()
		const currentPreset = table.getCurrentPreset()
		if (!currentPreset) {
			console.error(`No current preset found`)

			return
		}
		const indexOfPreset = presets.findIndex(
			(preset) => preset.id === currentPreset.id
		)
		const newPresets = [...presets]
		newPresets[indexOfPreset].state = table.getCurrentPresetState()

		table.setPresets(newPresets)
	}, [table])

	table.updatePresetName = useCallback(
		(presetId: number, name: string) => {
			const presets = table.getPresets()
			const index = presets.findIndex(({ id }) => id === presetId)
			if (index === -1) {
				console.error(`Preset with id ${presetId} was not found`)

				return
			}
			const newPresets = [...presets]
			newPresets[index].name = name

			table.setPresets(newPresets)
		},
		[table]
	)

	table.deletePreset = useCallback(
		(presetId: number) => {
			const presets = table.getPresets()
			const preset = presets.find(({ id }) => id === presetId)
			if (!preset) {
				console.error(`Preset with id ${presetId} was not found`)

				return
			}
			const newPresets = presets.filter(({ id }) => id !== preset.id)
			if (preset.id === table.getCurrentPreset()?.id) {
				const firstSuggested = table.getSuggestedPresets()[0]
				const indexOfNextChecked = newPresets.findIndex(
					({ id }) => id === firstSuggested?.id
				)
				const newCurrentPreset = newPresets[indexOfNextChecked] ?? newPresets[0]
				newCurrentPreset.checked = true
				table.setPresets(newPresets)
				table.setCurrentPreset(newCurrentPreset.id)
			} else {
				table.setPresets(newPresets)
			}
		},
		[table]
	)
	table.getIsCurrentPresetEmpty = memo(
		() => [table.getCurrentPreset()],
		(currentPreset) =>
			currentPreset ? isPresetStateEmpty(currentPreset.state) : true,
		{
			key: 'getIsCurrentPresetEmpty',
		}
	)
	table.getIsPresetStateSame = memo(
		() => [
			table,
			table.getCurrentPresetState(),
			table.getCurrentPreset()?.state,
		],
		getIsPresetStateSame,
		{
			key: 'getIsPresetStateSame',
		}
	)

	useEffect(() => {
		const currentPreset = table.getCurrentPreset()
		if (enablePresets && currentPreset) {
			applyPresetState(currentPreset.state)
		}
	}, [applyPresetState, enablePresets, table])

	return table
}
