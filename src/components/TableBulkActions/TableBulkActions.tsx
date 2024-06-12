import { CSSObject, styled, Theme } from '@mui/material'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { ComponentProps } from 'react'

import { useComputedEnableCaptions } from '../../hooks/useComputedEnableCaptions'
import { SelectCheckbox } from '../../inputs/SelectCheckbox'
import { TableInstance } from '../../TableComponent'
import { getColorAlpha } from '../../utils/getColorAlpha'
import { getTestAttributes } from '../../utils/getTestAttributes'
import { getValueOrFunctionHandler } from '../../utils/getValueOrFunctionHandler'
import { withNativeEvent } from '../../utils/withNativeEvent'
import { Colors, IconsColor } from '../styles'
import { Tooltip } from '../Tooltip'

import { BulkActionButton } from './BulkActionButton'

const Label = styled(Typography)`
	font-size: 14px;
`
const Line = styled(Divider)<{ height?: number }>`
	background: ${IconsColor.active};
	height: ${({ height }) => height ?? 1}px;
`
export type TableBulkActionsProps<TData extends Record<string, any> = {}> = {
	table: TableInstance<TData>
	wrapperProps?: ComponentProps<typeof Box>
	sx?: (theme: Theme & { visible: boolean }) => CSSObject
} & ComponentProps<typeof Box>
export const TableBulkActions = ({
	table,
	sx,
	wrapperProps,
	...rest
}: TableBulkActionsProps) => {
	const {
		getState,
		getSelectedRowModel,
		getPrePaginationRowModel,
		resetRowSelection,
		options: {
			enableBulkActionsCaptions: enableCaptions,
			localization,
			bulkActions: _bulkActions,
			enableBulkActionsSelect,
			icons: { CloseIcon },
			e2eLabels,
		},
		refs: { bulkActionsRef },
	} = table

	const bulkActions = getValueOrFunctionHandler(_bulkActions)({ table })
	const { stickyHorizontalScrollbarHeight } = getState()

	const { innerRef, outerRef, computedEnableCaptions } =
		useComputedEnableCaptions(enableCaptions)

	const selectMessage =
		getSelectedRowModel().flatRows.length > 0
			? localization.selectedCountOfRowCountRowsSelected
					?.replace(
						'{selectedCount}',
						getSelectedRowModel().flatRows.length.toString()
					)
					?.replace(
						'{rowCount}',
						getPrePaginationRowModel().flatRows.length.toString()
					)
			: null

	const visible = !!getSelectedRowModel().flatRows.length

	return (
		<Box
			{...rest}
			ref={(ref: HTMLDivElement) => {
				bulkActionsRef.current = ref
				if (rest?.ref) {
					// eslint-disable-next-line @typescript-eslint/ban-ts-comment
					// @ts-ignore
					rest.ref.current = ref
				}
			}}
			sx={(theme) => ({
				display: visible ? 'block' : 'none',
				position: 'sticky',
				boxSizing: 'border-box',
				width: '100%',
				zIndex: theme.zIndex.tooltip,
				padding: '9px',
				bottom: stickyHorizontalScrollbarHeight,
				...(sx instanceof Function ? sx({ ...theme, visible }) : (sx as any)),
			})}
		>
			<Box
				{...wrapperProps}
				sx={(theme) => ({
					boxSizing: 'border-box',
					display: 'flex',
					alignItems: 'center',
					height: 48,
					background: Colors.Gray90,
					color: Colors.Gray10,
					px: '15px',
					py: '6px',
					filter: `drop-shadow(0 4px 22px ${getColorAlpha(
						Colors.Gray90,
						0.15
					)})`,
					borderRadius: '6px',
					...(wrapperProps?.sx instanceof Function
						? wrapperProps?.sx?.(theme)
						: (wrapperProps?.sx as any)),
				})}
				{...getTestAttributes(e2eLabels, 'bulkActions')}
			>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
					}}
				>
					{enableBulkActionsSelect && (
						<>
							<SelectCheckbox
								table={table}
								selectAll
								label={({ checked }) => (
									<Label sx={{ ml: '6px' }}>
										{checked
											? localization.deselectAll
											: localization.selectAll}
									</Label>
								)}
							/>
							<Line orientation="vertical" height={14} sx={{ mx: '12px' }} />
						</>
					)}
					<Label>{selectMessage}</Label>
				</Box>
				<Box
					ref={outerRef}
					sx={{
						flexGrow: 1,
						display: 'flex',
						justifyContent: 'flex-end',
						overflow: 'hidden',
					}}
				>
					<Box
						ref={innerRef}
						sx={{ display: 'flex', gap: '6px', alignItems: 'center' }}
					>
						{bulkActions?.map((props, index) => (
							<BulkActionButton
								key={index}
								enableCaption={computedEnableCaptions}
								{...props}
							/>
						))}
					</Box>
				</Box>
				<Line orientation="vertical" height={18} sx={{ mx: '9px' }} />
				<Tooltip title={localization.close}>
					<IconButton
						onClick={withNativeEvent(
							{
								el: 'BulkActionPanel_Close',
								type: 'click',
							},
							table
						)(() => resetRowSelection())}
						sx={{
							color: Colors.Gray10,
							cursor: 'pointer',
							p: '3px',
							borderRadius: '6px',
							'&:hover': {
								background: Colors.Dark,
							},
						}}
					>
						<CloseIcon sx={{ width: 18, height: 18 }} />
					</IconButton>
				</Tooltip>
			</Box>
		</Box>
	)
}
