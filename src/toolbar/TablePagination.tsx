import { NavigateBefore, NavigateNext } from '@mui/icons-material'
import { IconButton, InputAdornment, styled, TextField } from '@mui/material'
import MuiTablePagination from '@mui/material/TablePagination'
import { noop } from '@tanstack/react-table'
import { ChangeEvent, useEffect, useRef, useState } from 'react'

import {
	Colors,
	DEFAULT_FONT_FAMILY,
	Flex,
	TableData,
	TableInstance,
	TextColor,
} from '..'

interface Props<TData = TableData> {
	position?: 'top' | 'bottom'
	table: TableInstance<TData>
}

const StyledButton = styled(IconButton)<{ currentPage?: boolean }>`
	font-size: 14px;
	font-family: ${DEFAULT_FONT_FAMILY};
	color: ${TextColor.Primary};
	width: 24px;
	height: 24px;

	&:hover {
		background-color: ${Colors.Gray10};
		border-radius: 3px;
	}

	${(props) =>
		props.currentPage &&
		`
    background-color: ${Colors.Gray10};
    border-radius: 3px;
    width: 24px;
    height: 24px;
  `}
`

const StyledDots = styled('span')`
	width: 24px;
	text-align: center;
`

const StyledSpan = styled('span')`
	border-left: 1px solid ${Colors.BorderMain}
	line-height: 20px;
	padding-left: 10px;
	width: 95px;
`

export const TablePagination = <TData,>({
	table,
	position = 'bottom',
}: Props<TData>) => {
	const {
		getState,
		setPageIndex,
		setPageSize,
		options: {
			muiTablePaginationProps,
			enableToolbarInternalActions,
			localization,
			rowCount,
			icons: { ChevronDownIcon, ArrowRightLongIcon },
		},
		refs: { tableContainerRef },
		constants: { totalRowCount: _totalRowCount },
	} = table
	const {
		pagination: { pageSize = 10, pageIndex = 0 },
		showGlobalFilter,
	} = getState()
	const [error, setError] = useState<boolean | null>(null)
	const [value, setValue] = useState('')
	const inputRef = useRef<HTMLInputElement>(null)

	const totalRowCount = rowCount ?? _totalRowCount

	const tablePaginationProps =
		muiTablePaginationProps instanceof Function
			? muiTablePaginationProps({ table })
			: muiTablePaginationProps

	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus()
		}
	}, [value])

	const handleIconClick = () => {
		if (!error) {
			handlePageChange(Number(value) - 1)
		}
	}

	const handleKeyPress = (e) => {
		if (e.key === 'Enter' && !error) {
			handlePageChange(Number(e.target.value) - 1)
		}
	}

	const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
		setPageSize(+event.target.value)
		tableContainerRef.current.scrollTo({ top: 0 })
	}

	const handlePageChange = (newPage: number) => {
		setPageIndex(newPage)
		tableContainerRef.current.scrollTo({ top: 0 })
	}

	const lastPage = Math.ceil(totalRowCount / pageSize) - 1

	const handleFirstPageButtonClick = () => {
		handlePageChange(0)
	}

	const handleLastPageButtonClick = () => {
		handlePageChange(lastPage)
	}

	const handleBackButtonClick = () => {
		handlePageChange(pageIndex - 1)
	}

	const handleNextButtonClick = () => {
		handlePageChange(pageIndex + 1)
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
			// tslint:disable-next-line:no-empty
			labelDisplayedRows={noop}
			labelRowsPerPage={localization.rowsPerPage}
			onPageChange={(_: any, newPage: number) => handlePageChange(newPage)}
			onRowsPerPageChange={handleChangeRowsPerPage}
			page={pageIndex}
			rowsPerPage={pageSize}
			rowsPerPageOptions={[
				5,
				10,
				15,
				20,
				25,
				30,
				50,
				100,
				{ label: 'All', value: totalRowCount },
			]}
			showFirstButton={false}
			showLastButton={false}
			{...tablePaginationProps}
			SelectProps={{
				sx: { m: '0 1rem 0 1ch' },
				MenuProps: {
					MenuListProps: { disablePadding: true },
					sx: {
						m: 0,
						'& .MuiMenuItem-root': {
							fontSize: '14px',
							fontFamily: DEFAULT_FONT_FAMILY,
						},
					},
				},
				IconComponent: ChevronDownIcon,
				...tablePaginationProps?.SelectProps,
			}}
			ActionsComponent={() => (
				<Flex
					alignItems="center"
					sx={{ marginLeft: 'auto', paddingRight: '16px' }}
				>
					<IconButton
						onClick={handleBackButtonClick}
						disabled={pageIndex === 0}
						sx={{
							'&:hover': {
								backgroundColor: 'unset',
							},
						}}
					>
						<NavigateBefore />
					</IconButton>
					{lastPage <= 4 ? ( // When pages are less than or equal 5
						Array.from({ length: lastPage + 1 }, (_, i) => (
							<StyledButton
								key={i}
								onClick={() => handlePageChange(i)}
								currentPage={pageIndex === i}
							>
								{i + 1}
							</StyledButton>
						))
					) : pageIndex < 3 ? ( // if we are on 1, 2, 3 page
						<>
							{Array.from({ length: 4 }, (_, i) => (
								<StyledButton
									key={i}
									onClick={() => handlePageChange(i)}
									currentPage={pageIndex === i}
								>
									{i + 1}
								</StyledButton>
							))}
							<StyledDots>...</StyledDots>
							<StyledButton onClick={handleLastPageButtonClick}>
								{lastPage + 1}
							</StyledButton>
						</>
					) : pageIndex > lastPage - 3 ? ( // if we are on one of the last 3 pages
						<>
							<StyledButton onClick={handleFirstPageButtonClick}>
								{1}
							</StyledButton>
							<StyledDots>...</StyledDots>
							{Array.from({ length: 4 }, (_, i) => (
								<StyledButton
									key={i}
									onClick={() => handlePageChange(lastPage - 3 + i)}
									currentPage={pageIndex === lastPage - 3 + i}
								>
									{lastPage - 2 + i}
								</StyledButton>
							))}
						</>
					) : (
						// if we are between 4 page and 3d from the end
						<>
							<StyledButton onClick={handleFirstPageButtonClick}>
								{1}
							</StyledButton>
							<StyledDots>...</StyledDots>
							{Array.from({ length: 3 }, (_, i) => (
								<StyledButton
									key={i}
									onClick={() => handlePageChange(pageIndex + i - 1)}
									currentPage={pageIndex === pageIndex + i - 1}
								>
									{pageIndex + i}
								</StyledButton>
							))}
							<StyledDots>...</StyledDots>
							<StyledButton onClick={handleLastPageButtonClick}>
								{lastPage + 1}
							</StyledButton>
						</>
					)}
					<IconButton
						onClick={handleNextButtonClick}
						disabled={pageIndex === lastPage}
						sx={{
							'&:hover': {
								backgroundColor: 'unset',
							},
						}}
					>
						<NavigateNext />
					</IconButton>
					<StyledSpan>Jump to page:</StyledSpan>
					<TextField
						size="small"
						InputProps={{
							endAdornment: (
								<InputAdornment position="end">
									<IconButton
										size="small"
										sx={{
											position: 'absolute',
											right: -7,
											top: -2,
											'&:hover': {
												backgroundColor: 'unset',
											},
										}}
										onClick={handleIconClick}
									>
										<ArrowRightLongIcon
											color={
												value === '' ||
												(!error && document.activeElement !== inputRef.current)
													? 'action'
													: error
													? 'error'
													: 'primary'
											}
										/>
									</IconButton>
								</InputAdornment>
							),
						}}
						type="number"
						value={value}
						inputRef={inputRef}
						onChange={(e) => {
							const val = e.target.value
							setValue(val)

							if (
								(Number(val) < 1 && val !== '') ||
								Number(val) > lastPage + 1
							) {
								setError(true)
							} else {
								setError(false)
							}
						}}
						onKeyPress={handleKeyPress}
						error={error !== null ? error : false}
						sx={{
							width: '70px',
							height: '24px',
							'& input': {
								padding: '2px',
								paddingLeft: '8px',
								fontSize: '14px',
							},
							'& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button':
								{
									'-webkit-appearance': 'none',
									margin: 0,
								},
							'& input[type=number]': {
								'-moz-appearance': 'textfield',
							},
						}}
					/>
				</Flex>
			)}
			sx={(theme) => ({
				width: '100%',
				'& .MuiTablePagination-spacer': {
					flex: '0 1',
				},
				'& .MuiTablePagination-selectLabel': {
					m: '0 -1px',
					order: 0,
					fontFamily: DEFAULT_FONT_FAMILY,
					fontSize: '14px',
					borderRight: `1px solid ${Colors.BorderMain}`,
					paddingRight: '10px',
				},
				'& .MuiInputBase-root': {
					m: '0 1px',
				},
				'& .MuiTablePagination-select': {
					m: '0 1px',
					order: 1,
					marginRight: '5px',
					'&:focus': {
						backgroundColor: 'unset',
					},
				},
				'& .MuiTablePagination-selectIcon': {
					width: '24px',
					height: '24px',
				},

				'& .MuiTablePagination-displayedRows': {
					m: '0 1px',
				},
				'& .MuiTablePagination-actions': {
					m: '0 1px',
				},
				'& .MuiTablePagination-selectRoot': {
					order: -1,
				},
				mt:
					position === 'top' &&
					enableToolbarInternalActions &&
					!showGlobalFilter
						? '3.5rem'
						: undefined,
				position: 'relative',
				zIndex: 2,
				overflow: 'visible',
				fontFamily: DEFAULT_FONT_FAMILY,
				color: TextColor.Primary,
				...(tablePaginationProps?.sx instanceof Function
					? tablePaginationProps.sx(theme)
					: (tablePaginationProps?.sx as any)),
			})}
		/>
	)
}
