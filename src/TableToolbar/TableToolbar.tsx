import React, { useCallback, useRef, useState } from 'react'
import Box from '@mui/material/Box'
import { useResizeDetector } from 'react-resize-detector'

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
	enableCaption?: boolean | 'auto'
}

export const TableToolbar = <TData extends Record<string, any> = {}>({
	table,
	enableSettings = true,
	enableSorting = true,
	enableFiltering = true,
	enableGrouping = true,
	enablePreset = true,
	enableCaption = 'auto',
}: Props<TData>) => {
	const {
		options: { renderToolbarInternalActions },
	} = table
	const [isShort, setIsShort] = useState(!enableCaption)
	const ref = useRef<HTMLDivElement>(null)
	const onResize = useCallback((width) => {
		setIsShort(
			Math.round(width) < Math.round(ref.current?.scrollWidth ?? Infinity)
		)
	}, [])
	useResizeDetector({
		onResize,
		targetRef: ref,
		refreshMode: 'debounce',
		handleHeight: false,
		handleWidth: enableCaption === 'auto',
	})

	const computedEnableCaption =
		enableCaption === 'auto' ? !isShort : enableCaption

	return (
		<Box
			ref={ref}
			sx={{
				alignItems: 'center',
				display: 'flex',
				zIndex: 3,
				maxWidth: '100%',
			}}
		>
			{renderToolbarInternalActions?.({
				table,
			}) ?? (
				<>
					{enableGrouping && (
						<GroupingButton
							enableCaption={computedEnableCaption}
							table={table}
						/>
					)}
					{enableSorting && (
						<SortingButton
							enableCaption={computedEnableCaption}
							table={table}
						/>
					)}
					{enableFiltering && (
						<FiltersButton
							enableCaption={computedEnableCaption}
							table={table}
						/>
					)}
					{enableSettings && (
						<SettingsButton
							enableCaption={computedEnableCaption}
							table={table}
						/>
					)}
					{enablePreset && <PresetButton table={table} />}
				</>
			)}
		</Box>
	)
}
