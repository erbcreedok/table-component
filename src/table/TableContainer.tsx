import React, { FC, useEffect, useLayoutEffect, useState } from 'react'
import MuiTableContainer from '@mui/material/TableContainer'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import CloseIcon from '@mui/icons-material/Close'

import type { TableInstance } from '..'

import { Table } from './Table'

const useIsomorphicLayoutEffect =
	typeof window !== 'undefined' ? useLayoutEffect : useEffect

interface Props {
	table: TableInstance
}

export const TableContainer: FC<Props> = ({ table }) => {
	const {
		getState,
		getSelectedRowModel,
		getPrePaginationRowModel,
		resetRowSelection,
		options: {
			localization,
			enableStickyHeader,
			muiTableContainerProps,
			bulkActions,
		},
		refs: { tableContainerRef, bottomToolbarRef, topToolbarRef },
	} = table
	const { isFullScreen } = getState()

	const [totalToolbarHeight, setTotalToolbarHeight] = useState(0)

	const tableContainerProps =
		muiTableContainerProps instanceof Function
			? muiTableContainerProps({ table })
			: muiTableContainerProps

	const selectMessage =
		getSelectedRowModel().rows.length > 0
			? localization.selectedCountOfRowCountRowsSelected
					?.replace(
						'{selectedCount}',
						getSelectedRowModel().rows.length.toString()
					)
					?.replace(
						'{rowCount}',
						getPrePaginationRowModel().rows.length.toString()
					)
			: null

	useIsomorphicLayoutEffect(() => {
		const topToolbarHeight =
			typeof document !== 'undefined'
				? topToolbarRef.current?.offsetHeight ?? 0
				: 0

		const bottomToolbarHeight =
			typeof document !== 'undefined'
				? bottomToolbarRef?.current?.offsetHeight ?? 0
				: 0

		setTotalToolbarHeight(topToolbarHeight + bottomToolbarHeight)
	})

	return (
		<MuiTableContainer
			{...tableContainerProps}
			ref={(node: HTMLDivElement) => {
				if (node) {
					tableContainerRef.current = node
					if (tableContainerProps?.ref) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						tableContainerProps.ref.current = node
					}
				}
			}}
			sx={(theme) => ({
				maxWidth: '100%',
				maxHeight: enableStickyHeader
					? `clamp(350px, calc(100vh - ${totalToolbarHeight}px), 9999px)`
					: undefined,
				overflow: 'auto',
				...(tableContainerProps?.sx instanceof Function
					? tableContainerProps.sx(theme)
					: (tableContainerProps?.sx as any)),
			})}
			style={{
				maxHeight: isFullScreen
					? `calc(100vh - ${totalToolbarHeight}px)`
					: undefined,
				...tableContainerProps?.style,
			}}
		>
			<Table table={table} />
			{getSelectedRowModel().rows.length && (
				<Box
					sx={{
						boxSizing: 'border-box',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
						width: 'calc(100% - 42px)',
						height: '48px',
						position: 'fixed',
						bottom: '48px',
						left: '50%',
						right: '50%',
						transform: 'translateX(-50%)',
						background: '#1D1E26',
						color: '#EBEDF5',
						px: '18px',
						py: '9px',
						boxShadow: '0px 4px 22px rgba(29, 30, 38, 0.15)',
						borderRadius: '6px',
					}}
				>
					<Typography
						sx={{ fontSize: '14px', lineHeight: '18px', fontWeight: '400' }}
					>
						{selectMessage}
					</Typography>
					<Box sx={{ display: 'flex' }}>
						{bulkActions?.map(({ text, icon, action }, index) => (
							<Button
								key={`${text || icon}-${index}`}
								onClick={() => action(getSelectedRowModel().flatRows)}
								sx={{ color: '#EBEDF5' }}
							>
								{icon}
								<Typography
									sx={{
										fontSize: '14px',
										lineHeight: '18px',
										fontWeight: '600',
										ml: '10px',
									}}
								>
									{text}
								</Typography>
							</Button>
						))}
						<Divider
							orientation="vertical"
							flexItem
							sx={{ backgroundColor: '#E1E3EB', ml: '15px', mr: '15px' }}
						/>
						<Box
							onClick={() => resetRowSelection()}
							sx={{
								display: 'flex',
								alignItems: 'center',
								color: '#EBEDF5',
								cursor: 'pointer',
							}}
						>
							<CloseIcon />
						</Box>
					</Box>
				</Box>
			)}
		</MuiTableContainer>
	)
}
