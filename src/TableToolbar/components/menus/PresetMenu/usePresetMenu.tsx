import { useState } from 'react'

import { TableData, TableInstance } from '../../../../'

type Props<TData = TableData> = {
	table: TableInstance<TData>
	onClose(): void
}
export const usePresetMenu = <TData,>({ table, onClose }: Props<TData>) => {
	const [editingPresetId, setEditingPresetId] = useState<
		number | null | string
	>(null)

	const suggestedPresets = table.getSuggestedPresets()

	const customPresets = table.getCustomPresets()

	const handleSelectPreset = (selectedId: number) => () => {
		table.setCurrentPreset(selectedId)
		onClose()
	}

	const handleDeletePreset = (deletedId) => (event) => {
		event.stopPropagation()
		table.deletePreset(deletedId)
	}

	const handleSavePresetWithNewName = (value, id) => {
		table.updatePresetName(id, value)
	}

	const handleCreateNewPreset = (value: string) => {
		table.createNewPreset(value)
		onClose()
	}

	const handleUpdateCurrent = () => {
		table.updateCurrentPresetState()
		onClose()
	}

	return {
		editingPresetId,
		setEditingPresetId,
		suggestedPresets,
		customPresets,
		handleSelectPreset,
		handleDeletePreset,
		handleSavePresetWithNewName,
		handleCreateNewPreset,
		handleUpdateCurrent,
	}
}
