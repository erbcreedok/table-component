import { DividerProps, styled } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import React, { ComponentProps, ReactNode, useCallback, useMemo } from 'react'

import { DEFAULT_FONT_FAMILY, TextColor } from '../components'
import { useComputedEnableCaptions } from '../hooks/useComputedEnableCaptions'
import { useHoverEffects } from '../hooks/useHoverEffects'
import type { TableData, TableInstance } from '../index'

import { ColumnsButton } from './components/buttons/ColumnsButton'
import { EditButton } from './components/buttons/EditButton'
import { FiltersButton } from './components/buttons/FiltersButton'
import { GroupingButton } from './components/buttons/GroupingButton'
import { PresetButton } from './components/buttons/PresetButton'
import { SortingButton } from './components/buttons/SortingButton'

const ToolbarWrapper = styled(Box)`
	display: flex;
	max-width: 100%;
	overflow: hidden;
	flex-grow: 1;
`
const ToolbarInner = styled(Box)`
	display: flex;
	align-items: center;
	gap: 6px;
`

const ToolbarInnerTableTitle = styled(Typography)`
	font-family: ${DEFAULT_FONT_FAMILY};
	font-size: 18px;
	font-weight: 600;
	line-height: 24px;
	color: ${TextColor.Dark};
	padding-top: 6px;
`

export const ToolbarDivider = styled<typeof Divider>((props) => (
	<Divider orientation="vertical" {...props} />
))`
	height: ${({ orientation = 'vertical' }) =>
		orientation === 'vertical' && '24px'};
	width: ${({ orientation }) => orientation === 'horizontal' && '24px'};
`

type Adornment<TData extends TableData> =
	| ReactNode
	| ((
			config: {
				dividerElement: ReactNode
				table: TableInstance<TData>
				tableToolbarProps: TableToolbarProps<TData>
				computedEnableCaptions: boolean
				ToolbarDivider: typeof ToolbarDivider
				disableButtons: boolean
			} & ReturnType<typeof useHoverEffects>
	  ) => ReactNode)
export type TableToolbarProps<TData extends TableData> = {
	table: TableInstance<TData>
	enableGrouping?: boolean
	disableGroupingButton?: boolean
	enableSorting?: boolean
	disableSortingButton?: boolean
	enableFiltering?: boolean
	disableFilteringButton?: boolean
	enableSettings?: boolean
	disableSettingsButton?: boolean
	enablePreset?: boolean
	enableCaptions?: boolean | 'auto'
	innerProps?: ComponentProps<typeof Box>
	innerTable?: boolean
	innerTableTitle?: string
	startAdornment?: Adornment<TData>
	endAdornment?: Adornment<TData>
	disableAdornmentDividers?: boolean
	dividerProps?: DividerProps
} & ComponentProps<typeof Box>

export const TableToolbar = <TData extends TableData = {}>(
	tableToolbarProps: TableToolbarProps<TData>
) => {
	const {
		table,
		enableSettings = true,
		enableSorting,
		enableFiltering,
		enableGrouping,
		enablePreset,
		disableFilteringButton,
		disableSettingsButton,
		disableGroupingButton,
		disableSortingButton,
		enableCaptions = 'auto',
		innerProps,
		innerTable,
		innerTableTitle,
		startAdornment,
		endAdornment,
		disableAdornmentDividers,
		dividerProps,
		...rest
	} = tableToolbarProps
	const {
		options: {
			renderToolbarInternalActions,
			enableGrouping: uEnableGrouping,
			enableSorting: uEnableSorting,
			enableFilters: uEnableFilters,
			enablePresets: uEnablePresets,
			editingMode,
		},
	} = table
	const disableButtons = table.constants.disableActionButtons
	const { innerRef, outerRef, computedEnableCaptions } =
		useComputedEnableCaptions(enableCaptions)
	const { hovered, hoverProps } = useHoverEffects()
	const dividerElement = useMemo(() => {
		if (disableAdornmentDividers) return null

		return <ToolbarDivider {...dividerProps} />
	}, [disableAdornmentDividers, dividerProps])

	const getAdornment = useCallback(
		(adornment: Adornment<TData>) => {
			if (adornment instanceof Function) {
				return adornment({
					computedEnableCaptions,
					dividerElement,
					disableButtons,
					hovered,
					hoverProps,
					table,
					tableToolbarProps,
					ToolbarDivider,
				})
			}

			return adornment
		},
		[
			computedEnableCaptions,
			disableButtons,
			dividerElement,
			hoverProps,
			hovered,
			table,
			tableToolbarProps,
		]
	)

	const [cStartAdornment, cEndAdornment] = useMemo(() => {
		return [getAdornment(startAdornment), getAdornment(endAdornment)]
	}, [getAdornment, startAdornment, endAdornment])

	const children = (
		<>
			{cStartAdornment}
			{cStartAdornment && dividerElement}
			{(enableFiltering || uEnableFilters) && (
				<FiltersButton
					enableCaption={computedEnableCaptions}
					table={table}
					disabled={disableFilteringButton ?? disableButtons}
				/>
			)}
			{(enableGrouping || uEnableGrouping) && (
				<GroupingButton
					enableCaption={computedEnableCaptions}
					table={table}
					disabled={disableGroupingButton ?? disableButtons}
				/>
			)}
			{(enableSorting || uEnableSorting) && (
				<SortingButton
					enableCaption={computedEnableCaptions}
					table={table}
					disabled={disableSortingButton ?? disableButtons}
				/>
			)}
			{enableSettings && (
				<ColumnsButton
					enableCaption={computedEnableCaptions}
					table={table}
					disabled={disableSettingsButton ?? disableButtons}
				/>
			)}
			{(enablePreset || uEnablePresets) && (
				<PresetButton
					enableCaption={computedEnableCaptions}
					table={table}
					disabled={disableButtons}
				/>
			)}
			{editingMode === 'table' && dividerElement}
			{editingMode === 'table' && (
				<EditButton table={table} enableCaption={computedEnableCaptions} />
			)}
			{cEndAdornment && dividerElement}
			{cEndAdornment}
		</>
	)

	return (
		<ToolbarWrapper
			ref={outerRef}
			{...hoverProps}
			{...rest}
			sx={{
				justifyContent: innerTable
					? innerTableTitle
						? 'space-between'
						: 'flex-end'
					: 'normal',
				...(innerTable ? { height: '88px' } : {}),
				...rest.sx,
			}}
		>
			{innerTableTitle && (
				<ToolbarInnerTableTitle>{innerTableTitle}</ToolbarInnerTableTitle>
			)}
			<ToolbarInner
				ref={innerRef}
				{...innerProps}
				sx={{
					visibility: !innerTable || hovered ? 'visible' : 'hidden',
					...innerProps?.sx,
				}}
			>
				{renderToolbarInternalActions?.({
					table,
					originalChildren: children,
				}) ?? children}
			</ToolbarInner>
		</ToolbarWrapper>
	)
}

TableToolbar.Wrapper = ToolbarWrapper
TableToolbar.Inner = ToolbarInner
