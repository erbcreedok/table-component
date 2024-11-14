import { capitalize, ThemeProvider, Typography } from '@mui/material'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import {
	createTheme,
	NotificationDot,
	PRESET_THEME,
	TableData,
	type TableInstance,
	ToolbarIconButton,
	Tooltip,
} from '../../../'
import { getValueOrFunctionHandler } from '../../../utils/getValueOrFunctionHandler'
import { withNativeEvent } from '../../../utils/withNativeEvent'
import { PresetNotification } from '../menus/PresetMenu/components/PresetNotification'
import { PresetMenu } from '../menus/PresetMenu/PresetMenu'

const theme = createTheme(PRESET_THEME)

interface PresetButtonProps<TData = TableData> {
	table: TableInstance<TData>
	enableCaption?: boolean
	disabled?: boolean
}

export const PresetButton = <TData,>({
	table,
	enableCaption = true,
	disabled,
}: PresetButtonProps<TData>) => {
	const {
		options: {
			showPresetChangedDot,
			showPresetNotification,
			localization,
			icons: { PresetIcon },
		},
	} = table

	const isPresetStateSame = table.getIsPresetStateSame()
	const isCurrentPresetEmpty = table.getIsCurrentPresetEmpty()
	const [isNotificationShowedOnce, setIsNotificationShowedOnce] =
		useState<boolean>(!!localStorage.getItem('presetNotificationShowed'))
	const currentPreset = table.getCurrentPreset()
	const toolbarRef = useRef<HTMLButtonElement>(null)

	const [open, setOpen] = useState(false)

	const handleClick = useCallback(() => {
		setOpen(true)
	}, [])

	const handleClose = useCallback(() => {
		setOpen(false)
	}, [])

	const tooltipTitle = useMemo(() => {
		if (
			currentPreset?.name
				?.toLowerCase()
				?.includes(localization.showPreset.toLowerCase())
		) {
			return currentPreset?.name
		}

		return `${currentPreset?.name} ${localization.showPreset}`
	}, [currentPreset?.name, localization.showPreset])

	const handleNotificationShowedOnce = () => {
		localStorage.setItem('presetNotificationShowed', JSON.stringify(true))
		setIsNotificationShowedOnce(true)
	}

	const showNotificationDot = useMemo(() => {
		if (showPresetChangedDot) {
			getValueOrFunctionHandler(showPresetChangedDot)({
				table,
				isPresetStateSame,
				isCurrentPresetEmpty,
				isPresetMenuOpen: open,
			})
		}

		return !isPresetStateSame && !open
	}, [
		showPresetChangedDot,
		isPresetStateSame,
		open,
		table,
		isCurrentPresetEmpty,
	])

	const showNotification = useMemo(() => {
		if (showPresetNotification) {
			getValueOrFunctionHandler(showPresetNotification)({
				table,
				isPresetStateSame,
				isCurrentPresetEmpty,
				isPresetMenuOpen: open,
			})
		}

		return (
			!isCurrentPresetEmpty && !isPresetStateSame && !isNotificationShowedOnce
		)
	}, [
		showPresetNotification,
		isPresetStateSame,
		isNotificationShowedOnce,
		table,
		isCurrentPresetEmpty,
		open,
	])

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
							{currentPreset?.name}
						</Typography>
					)}
					{showNotificationDot && <NotificationDot />}
				</ToolbarIconButton>
			</Tooltip>
			{!!toolbarRef.current && showNotification && (
				<PresetNotification
					anchorEl={toolbarRef.current}
					setIsNotificationShowedOnce={handleNotificationShowedOnce}
				/>
			)}
			{toolbarRef.current && (
				<PresetMenu
					table={table}
					anchorEl={toolbarRef.current}
					open={open}
					handleClose={handleClose}
				/>
			)}
		</ThemeProvider>
	)
}
