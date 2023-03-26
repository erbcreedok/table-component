import React from 'react'
import Box from '@mui/material/Box'

import type { TableInstance } from '../index'

import { GroupingButton } from './components/buttons/GroupingButton'
import { SortingButton } from './components/buttons/SortingButton'
import { FiltersButton } from './components/buttons/FiltersButton'
import { SettingsButton } from './components/buttons/SettingsButton'
import { PresetButton } from './components/buttons/PresetButton'

interface Props<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
	enableGrouping?: boolean
	enableSorting?: boolean
	enableFiltering?: boolean
	enableSettings?: boolean
	enablePreset?: boolean
	enableCaption?: boolean
}

export const TableToolbar = <TData extends Record<string, any> = {}>({
	table,
	enableSettings = true,
	enableSorting = true,
	enableFiltering = true,
	enableGrouping = true,
	enablePreset = true,
	enableCaption = true,
}: Props<TData>) => {
	const {
		options: { renderToolbarInternalActions },
	} = table

	return (
		<Box
			sx={{
				alignItems: 'center',
				display: 'flex',
				zIndex: 3,
			}}
		>
			{renderToolbarInternalActions?.({
				table,
			}) ?? (
				<>
					{enableGrouping && (
						<GroupingButton enableCaption={enableCaption} table={table} />
					)}
					{enableSorting && (
						<SortingButton enableCaption={enableCaption} table={table} />
					)}
					{enableFiltering && (
						<FiltersButton enableCaption={enableCaption} table={table} />
					)}
					{enableSettings && (
						<SettingsButton enableCaption={enableCaption} table={table} />
					)}
					{enablePreset && <PresetButton table={table} />}
				</>
			)}
		</Box>
	)
}
