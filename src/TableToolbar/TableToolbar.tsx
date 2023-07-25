import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { ComponentProps } from 'react'

import { useComputedEnableCaptions } from '../hooks/useComputedEnableCaptions'
import { useHoverEffects } from '../hooks/useHoverEffects'
import type { TableInstance } from '../index'
import { DEFAULT_FONT_FAMILY, Text } from '../components/styles'

import { ColumnsButton } from './components/buttons/ColumnsButton'
import { FiltersButton } from './components/buttons/FiltersButton'
import { GroupingButton } from './components/buttons/GroupingButton'
import { PresetButton } from './components/buttons/PresetButton'
import { SortingButton } from './components/buttons/SortingButton'

export type TableToolbarProps<TData extends Record<string, any> = {}> = {
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
} & ComponentProps<typeof Box>

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
	color: ${Text.Dark};
	padding-top: 6px;
`

export const TableToolbar = <TData extends Record<string, any> = {}>({
	table,
	enableSettings = true,
	enableSorting = true,
	enableFiltering = true,
	enableGrouping = true,
	enablePreset = true,
	disableFilteringButton = false,
	disableSettingsButton = false,
	disableGroupingButton = false,
	disableSortingButton = false,
	enableCaptions = 'auto',
	innerProps,
	innerTable,
	innerTableTitle,
	...rest
}: TableToolbarProps<TData>) => {
	const {
		options: { renderToolbarInternalActions },
	} = table
	const { innerRef, outerRef, computedEnableCaptions } =
		useComputedEnableCaptions(enableCaptions)
	const { hovered, hoverProps } = useHoverEffects()

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
				}) ?? (
					<>
						{enableGrouping && (
							<GroupingButton
								enableCaption={computedEnableCaptions}
								table={table}
								disabled={disableGroupingButton}
							/>
						)}
						{enableSorting && (
							<SortingButton
								enableCaption={computedEnableCaptions}
								table={table}
								disabled={disableSortingButton}
							/>
						)}
						{enableFiltering && (
							<FiltersButton
								enableCaption={computedEnableCaptions}
								table={table}
								disabled={disableFilteringButton}
							/>
						)}
						{enableSettings && (
							<ColumnsButton
								enableCaption={computedEnableCaptions}
								table={table}
								disabled={disableSettingsButton}
							/>
						)}
						{enablePreset && (
							<PresetButton
								enableCaption={computedEnableCaptions}
								table={table}
							/>
						)}
					</>
				)}
			</ToolbarInner>
		</ToolbarWrapper>
	)
}

TableToolbar.Wrapper = ToolbarWrapper
TableToolbar.Inner = ToolbarInner
