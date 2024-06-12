import React, { ChangeEvent } from 'react'
import MuiTablePagination from '@mui/material/TablePagination'

import type { TableInstance } from '..'
import { scrollToElement } from '../utils/scrollToElement'

interface Props<TData extends Record<string, any> = object> {
	position?: 'top' | 'bottom'
	table: TableInstance<TData>
}

export const TablePagination = <TData extends Record<string, any> = object>({
	table,
	position = 'bottom',
}: Props<TData>) => {
	const {
		getPrePaginationRowModel,
		getState,
		setPageIndex,
		setPageSize,
		options: {
			muiTablePaginationProps,
			enableToolbarInternalActions,
			localization,
			rowCount,
		},
		refs: { tableContainerRef },
	} = table
	const {
		pagination: { pageSize = 10, pageIndex = 0 },
		showGlobalFilter,
	} = getState()

	const totalRowCount = rowCount ?? getPrePaginationRowModel().flatRows.length
	const showFirstLastPageButtons = totalRowCount / pageSize > 2

	const tablePaginationProps =
		muiTablePaginationProps instanceof Function
			? muiTablePaginationProps({ table })
			: muiTablePaginationProps

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setPageSize(+event.target.value)
		tableContainerRef.current.scrollTo({ top: 0 })
	}

	const handlePageChange = (newPage: number) => {
		setPageIndex(newPage)
		tableContainerRef.current.scrollTo({ top: 0 })
	}

	return (
		<MuiTablePagination
			component="div"
			count={totalRowCount}
			getItemAriaLabel={(type) =>
				type === 'first'
					? localization.goToFirstPage
					: type === 'last'
					? localization.goToLastPage
					: type === 'next'
					? localization.goToNextPage
					: localization.goToPreviousPage
			}
			labelDisplayedRows={({ from, to, count }) =>
				`${from}-${to} ${localization.of} ${count}`
			}
			labelRowsPerPage={localization.rowsPerPage}
			onPageChange={(_: any, newPage: number) => handlePageChange(newPage)}
			onRowsPerPageChange={handleChangeRowsPerPage}
			page={pageIndex}
			rowsPerPage={pageSize}
			rowsPerPageOptions={[5, 10, 15, 20, 25, 30, 50, 100]}
			showFirstButton={showFirstLastPageButtons}
			showLastButton={showFirstLastPageButtons}
			{...tablePaginationProps}
			SelectProps={{
				sx: { m: '0 1rem 0 1ch' },
				MenuProps: { MenuListProps: { disablePadding: true }, sx: { m: 0 } },
				...tablePaginationProps?.SelectProps,
			}}
			sx={(theme) => ({
				'& .MuiTablePagination-toolbar': {
					display: 'flex',
					alignItems: 'center',
				},
				'& .MuiTablePagination-selectLabel': {
					m: '0 -1px',
				},
				'&. MuiInputBase-root': {
					m: '0 1px',
				},
				'& . MuiTablePagination-select': {
					m: '0 1px',
				},
				'& .MuiTablePagination-displayedRows': {
					m: '0 1px',
				},
				'& .MuiTablePagination-actions': {
					m: '0 1px',
				},
				mt:
					position === 'top' &&
					enableToolbarInternalActions &&
					!showGlobalFilter
						? '3.5rem'
						: undefined,
				position: 'relative',
				zIndex: 2,
				...(tablePaginationProps?.sx instanceof Function
					? tablePaginationProps.sx(theme)
					: (tablePaginationProps?.sx as any)),
			})}
		/>
	)
}
