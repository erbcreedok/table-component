import React, { useCallback, useEffect, useRef, useState } from 'react'
import Tooltip from '@mui/material/Tooltip'
import { createTheme, ThemeProvider, Typography } from '@mui/material'
import {
	ColumnFiltersState,
	ColumnOrderState,
	GroupingState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table'

import type { TableInstance } from '../../../index'
import { ToolbarButton } from '../../../components/ToolbarButton'
import { NotificationDot } from '../../../components/NotificationDot'
import { PresetMenu } from '../menus/PresetMenu/PresetMenu'
import { PresetNotifcation } from '../menus/PresetMenu/components/PresetNotification'
import { useTableContext } from '../../../context/useTableContext'

import { getIsStateTheSame } from './helpers/presetHelpers'
import { PRESET_THEME } from './presetContants'

interface PresetButtonProps<TData extends Record<string, any> = {}> {
	table: TableInstance<TData>
}

export interface PresetState {
	columnOrder: ColumnOrderState
	grouping: GroupingState
	sorting: SortingState
	columnFilters: ColumnFiltersState
	columnVisibility: VisibilityState
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
			icons: { ExpandLessIcon, ExpandMoreIcon },
		},
	} = table

	const { state: tableState } = useTableContext()
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)
	const [isStateTheSame, setIsStateTheSame] = useState<boolean>(true)
	const [isNotificationShowedOnce, setIsNotificationShowedOnce] =
		useState<boolean>(false)
	const [presets, setPresets] = useState<Preset[]>(getDefaultPresets())
	const [checkedPreset, setCheckedPreset] = useState<Preset | undefined>(
		presets.find(({ checked }) => checked)
	)
	const toolbarRef = useRef<HTMLButtonElement>(null)

	const open = Boolean(anchorEl)

	const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}, [])

	const handleClose = useCallback(() => {
		setAnchorEl(null)
	}, [])

	const handleApplyPresetState = ({
		columnOrder,
		grouping,
		sorting,
		columnFilters,
		columnVisibility,
	}) => {
		setColumnOrder(columnOrder)
		setGrouping(() => grouping)
		setSorting(sorting)
		setColumnFilters(columnFilters)
		setColumnVisibility(columnVisibility)
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

	useEffect(() => {
		if (checkedPreset) {
			setIsStateTheSame(getIsStateTheSame(checkedPreset?.state, tableState))
		}
	}, [checkedPreset, tableState])

	return (
		<ThemeProvider theme={theme}>
			<Tooltip
				placement="top"
				title={`${checkedPreset?.name} ${localization.showPreset}`}
			>
				<ToolbarButton
					aria-label={localization.showPreset}
					endIcon={open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
					onClick={handleClick}
					variant="outlined"
					disableRipple
					ref={toolbarRef}
				>
					<Typography
						sx={{
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
						}}
					>
						{checkedPreset?.name}
					</Typography>
					{!isStateTheSame && <NotificationDot />}
				</ToolbarButton>
			</Tooltip>
			{!!toolbarRef.current && !isStateTheSame && !isNotificationShowedOnce && (
				<PresetNotifcation
					anchorEl={toolbarRef.current}
					setIsNotificationShowedOnce={setIsNotificationShowedOnce}
				/>
			)}
			{anchorEl && (
				<PresetMenu
					table={table}
					anchorEl={anchorEl}
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
