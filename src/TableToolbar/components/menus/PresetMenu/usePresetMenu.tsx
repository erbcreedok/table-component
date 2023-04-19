import { useMemo } from 'react'

export const usePresetMenu = ({
	checkedPreset,
	presets,
	table: { getState, savePresets },
	onApplyPresetState,
	onClose,
	setCheckedPreset,
	setPresets,
}) => {
	const getPresetState = () => {
		const { columnFilters, columnOrder, columnVisibility, grouping, sorting } =
			getState()

		return {
			columnFilters,
			columnOrder,
			columnVisibility,
			grouping,
			sorting,
		}
	}

	const suggestedPresets = useMemo(
		() => presets.filter(({ suggested }) => suggested),
		[presets]
	)

	const customPresets = useMemo(
		() => presets.filter(({ suggested }) => !suggested),
		[presets]
	)

	const handleSelectPreset = (selectedId: number) => () => {
		const indexOfPreviousChecked = presets.findIndex(({ checked }) => checked)
		const indexOfNextChecked = presets.findIndex(({ id }) => id === selectedId)
		const newPresets = [...presets]
		newPresets[indexOfPreviousChecked].checked = false
		newPresets[indexOfNextChecked].checked = true

		setCheckedPreset(newPresets[indexOfNextChecked])
		onApplyPresetState(newPresets[indexOfNextChecked].state)
		savePresets(newPresets)
		setPresets(newPresets)

		onClose()
	}

	const handleDeletePreset = (deletedId) => (event) => {
		event.stopPropagation()

		const newPresets = presets.filter(({ id }) => id !== deletedId)

		if (deletedId === checkedPreset.id) {
			const indexOfFirstSuggestedPreset = suggestedPresets[0].id
			const indexOfNextChecked = presets.findIndex(
				({ id }) => id === indexOfFirstSuggestedPreset
			)
			newPresets[indexOfNextChecked].checked = true

			setCheckedPreset(suggestedPresets[0])
			onApplyPresetState(suggestedPresets[0].state)

			onClose()
		}

		savePresets(newPresets)
		setPresets(newPresets)
	}

	const handleSavePresetWithNewName = (value, id) => {
		const indexOfPreset = presets.findIndex((preset) => preset.id === id)
		const newPresets = [...presets]
		newPresets[indexOfPreset].name = value

		savePresets(newPresets)
		setPresets(newPresets)
	}

	const handleCreateNewPreset = (value) => {
		const newIndex = presets.at(-1).id + 1

		const newPreset = {
			id: newIndex,
			name: value,
			checked: true,
			suggested: false,
			state: getPresetState(),
		}

		const newPresets = [
			...presets.map((preset) => ({ ...preset, checked: false })),
			newPreset,
		]

		setCheckedPreset(newPreset)
		savePresets(newPresets)
		setPresets(newPresets)

		onClose()
	}

	const handleSaveInCurrent = () => {
		const indexOfPreset = presets.findIndex(
			(preset) => preset.id === checkedPreset.id
		)
		const newPresets = [...presets]
		newPresets[indexOfPreset].state = getPresetState()

		savePresets(newPresets)
		setPresets(newPresets)

		onClose()
	}

	return {
		suggestedPresets,
		customPresets,
		handleSelectPreset,
		handleDeletePreset,
		handleSavePresetWithNewName,
		handleCreateNewPreset,
		handleSaveInCurrent,
	}
}
