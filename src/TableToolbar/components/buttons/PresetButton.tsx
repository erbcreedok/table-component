import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { capitalize, ThemeProvider, Typography } from '@mui/material'
import {
	ColumnFiltersState,
	ColumnOrderState,
	GroupingState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table'

import {
	ToolbarIconButton,
	Tooltip,
	NotificationDot,
} from '../../../components'
import { createTheme } from '../../../index'
import type { TableInstance } from '../../../index'
import { getValidColumnOrder } from '../../../utils/getValidColumnOrder'
import { PresetMenu } from '../menus/PresetMenu/PresetMenu'
import { PresetNotification } from '../menus/PresetMenu/components/PresetNotification'
import { useTableContext } from '../../../context/useTableContext'
import { withNativeEvent } from '../../../utils/withNativeEvent'

import { getIsStateTheSame, isPresetStateEmpty } from './helpers/presetHelpers'
import { PRESET_THEME } from './presetContants'

interface PresetButtonProps<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
	enableCaption?: boolean
	disabled?: boolean
}

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

const theme = createTheme(PRESET_THEME)

export const PresetButton = <TData extends Record<string, any> = {}>({
	table,
	enableCaption = true,
	disabled,
}: PresetButtonProps<TData>) => {
	const {
		getPresets,
		getDefaultPresets,
		setColumnOrder,
		setGrouping,
		setSorting,
		setColumnFilters,
		setColumnVisibility,
		options: {
			localization,
			icons: { PresetIcon },
		},
	} = table

	const { state: tableState } = useTableContext()
	const [isStateTheSame, setIsStateTheSame] = useState<boolean>(true)
	const [isNotificationShowedOnce, setIsNotificationShowedOnce] =
		useState<boolean>(!!localStorage.getItem('presetNotificationShowed'))
	const [presets, setPresets] = useState<Preset[]>(getDefaultPresets() ?? [])
	const [checkedPreset, setCheckedPreset] = useState<Preset | undefined>()
	const toolbarRef = useRef<HTMLButtonElement>(null)

	const [open, setOpen] = useState(false)

	const handleClick = useCallback(() => {
		setOpen(true)
	}, [])

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])

	const handleApplyPresetState = ({
		columnOrder,
		grouping,
		sorting,
		columnFilters,
		columnVisibility,
	}: PresetState) => {
		setColumnOrder(getValidColumnOrder(table.options, columnOrder))
		setGrouping(() => grouping ?? [])
		setSorting(sorting ?? [])
		setColumnFilters(columnFilters ?? [])
		setColumnVisibility(columnVisibility ?? {})
	}

	useEffect(() => {
		const loadedPresets = getPresets()

		const currentPresets = (loadedPresets || presets).sort(
			({ id: firstId }, { id: secondId }) => firstId - secondId
		)

		const currentCheckedPreset = currentPresets.find(({ checked }) => checked)

		setPresets(currentPresets)

		if (currentCheckedPreset) {
			setCheckedPreset(currentCheckedPreset)
			handleApplyPresetState(currentCheckedPreset.state)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const isEmptyPreset = useMemo(
		() => (checkedPreset ? isPresetStateEmpty(checkedPreset?.state) : true),
		[checkedPreset]
	)

	useEffect(() => {
		if (checkedPreset) {
			setIsStateTheSame(
				getIsStateTheSame(checkedPreset?.state, tableState, table)
			)
		}
	}, [checkedPreset, tableState, presets])

	const tooltipTitle = useMemo(() => {
		if (
			checkedPreset?.name
				?.toLowerCase()
				?.includes(localization.showPreset.toLowerCase())
		) {
			return checkedPreset?.name
		}

		return `${checkedPreset?.name} ${localization.showPreset}`
	}, [checkedPreset?.name, localization.showPreset])

	const handleNotificationShowedOnce = () => {
		localStorage.setItem('presetNotificationShowed', JSON.stringify(true))
		setIsNotificationShowedOnce(true)
	}

	return (
		<ThemeProvider theme={theme}>
			<Tooltip placement="top" title={capitalize(tooltipTitle)}>
				<ToolbarIconButton
					aria-label={localization.showPreset}
					onClick={withNativeEvent(
						{
							el: 'ActionBar_PresetsButton',
							type: 'click',
						},
						table
					)(handleClick)}
					disableRipple
					ref={toolbarRef}
					toggled={open}
					enableCaption={enableCaption}
					disabled={disabled}
				>
					<PresetIcon />
					{enableCaption && (
						<Typography
							sx={{
								textOverflow: 'ellipsis',
								overflow: 'hidden',
								whiteSpace: 'nowrap',
							}}
						>
							{checkedPreset?.name}
						</Typography>
					)}
					{!isStateTheSame && !open && <NotificationDot />}
				</ToolbarIconButton>
			</Tooltip>
			{!isEmptyPreset &&
				!!toolbarRef.current &&
				!isStateTheSame &&
				!isNotificationShowedOnce && (
					<PresetNotification
						anchorEl={toolbarRef.current}
						setIsNotificationShowedOnce={handleNotificationShowedOnce}
					/>
				)}
			{toolbarRef.current && (
				<PresetMenu
					table={table}
					anchorEl={toolbarRef.current}
					presets={presets}
					checkedPreset={checkedPreset}
					isStateTheSame={isStateTheSame}
					open={open}
					setCheckedPreset={setCheckedPreset}
					setPresets={setPresets}
					handleClose={handleClose}
					handleApplyPresetState={handleApplyPresetState}
				/>
			)}
		</ThemeProvider>
	)
}
