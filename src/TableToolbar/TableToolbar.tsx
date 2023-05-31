import styled from '@emotion/styled'
import React, {
	ComponentProps,
	useCallback,
	useLayoutEffect,
	useRef,
	useState,
} from 'react'
import Box from '@mui/material/Box'
import { useResizeDetector } from 'react-resize-detector'

import type { TableInstance } from '../index'

import { GroupingButton } from './components/buttons/GroupingButton'
import { SortingButton } from './components/buttons/SortingButton'
import { FiltersButton } from './components/buttons/FiltersButton'
import { ColumnsButton } from './components/buttons/ColumnsButton'
import { PresetButton } from './components/buttons/PresetButton'

type Props<TData extends Record<string, any> = {}> = {
	table: TableInstance<TData>
	enableGrouping?: boolean
	enableSorting?: boolean
	enableFiltering?: boolean
	enableSettings?: boolean
	enablePreset?: boolean
	enableCaption?: boolean | 'auto'
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
	enableCaption = 'auto',
	innerProps,
	...rest
}: Props<TData>) => {
	const {
		options: { renderToolbarInternalActions },
	} = table
	const [isCaptionEnabled, setIsCaptionEnabled] = useState(!!enableCaption)
	const innerRef = useRef<HTMLDivElement>(null)
	const widthWithCaption = useRef(0)
	const onResize = useCallback((width) => {
		setIsCaptionEnabled(Math.round(width) > widthWithCaption.current)
	}, [])
	const { ref } = useResizeDetector({
		onResize,
		handleHeight: false,
		handleWidth: enableCaption === 'auto',
	})

	const computedEnableCaption =
		enableCaption === 'auto' ? isCaptionEnabled : enableCaption

	useLayoutEffect(() => {
		if (computedEnableCaption) {
			widthWithCaption.current = innerRef.current?.scrollWidth ?? 0
		}
	}, [computedEnableCaption])

	return (
		<ToolbarWrapper ref={ref} {...rest}>
			<ToolbarInner ref={innerRef} {...innerProps}>
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
							<ColumnsButton
								enableCaption={computedEnableCaption}
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
