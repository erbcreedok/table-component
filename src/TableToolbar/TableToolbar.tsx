import styled from '@emotion/styled'
import Box from '@mui/material/Box'
import React, { ComponentProps } from 'react'

import { useComputedEnableCaptions } from '../hooks/useComputedEnableCaptions'
import type { TableInstance } from '../index'

import { ColumnsButton } from './components/buttons/ColumnsButton'
import { FiltersButton } from './components/buttons/FiltersButton'
import { GroupingButton } from './components/buttons/GroupingButton'
import { PresetButton } from './components/buttons/PresetButton'
import { SortingButton } from './components/buttons/SortingButton'

export type TableToolbarProps<TData extends Record<string, any> = {}> = {
	table: TableInstance<TData>
	enableGrouping?: boolean
	enableSorting?: boolean
	enableFiltering?: boolean
	enableSettings?: boolean
	enablePreset?: boolean
	enableCaptions?: boolean | 'auto'
	innerProps?: ComponentProps<typeof Box>
} & ComponentProps<typeof Box>

const ToolbarWrapper = styled(Box)`
	display: flex;
	z-index: 3;
	max-width: 100%;
	overflow: hidden;
	flex-grow: 1;
`
const ToolbarInner = styled(Box)`
	display: flex;
	align-items: center;
	gap: 12px;
`

export const TableToolbar = <TData extends Record<string, any> = {}>({
	table,
	enableSettings = true,
	enableSorting = true,
	enableFiltering = true,
	enableGrouping = true,
	enablePreset = true,
	enableCaptions = 'auto',
	innerProps,
	...rest
}: TableToolbarProps<TData>) => {
	const {
		options: { renderToolbarInternalActions },
	} = table
	const { innerRef, outerRef, computedEnableCaptions } =
		useComputedEnableCaptions(enableCaptions)

	return (
		<ToolbarWrapper ref={outerRef} {...rest}>
			<ToolbarInner ref={innerRef} {...innerProps}>
				{renderToolbarInternalActions?.({
					table,
				}) ?? (
					<>
						{enableGrouping && (
							<GroupingButton
								enableCaption={computedEnableCaptions}
								table={table}
							/>
						)}
						{enableSorting && (
							<SortingButton
								enableCaption={computedEnableCaptions}
								table={table}
							/>
						)}
						{enableFiltering && (
							<FiltersButton
								enableCaption={computedEnableCaptions}
								table={table}
							/>
						)}
						{enableSettings && (
							<ColumnsButton
								enableCaption={computedEnableCaptions}
								table={table}
							/>
						)}
						{enablePreset && <PresetButton table={table} />}
					</>
				)}
			</ToolbarInner>
		</ToolbarWrapper>
	)
}

TableToolbar.Wrapper = ToolbarWrapper
TableToolbar.Inner = ToolbarInner
