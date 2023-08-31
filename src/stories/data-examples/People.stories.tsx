import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import TableComponent, { TableComponentProps, Sidebar, ExpandByClick, utilColumns } from '../../'
import { Typography } from '@mui/material'
import { OpenIcon } from '../../icons/OpenIcon'
import {
	getPeopleColumns,
	getSeparatedPeopleMembers,
} from '../utils/getPeopleColumns'
import { Table_DisplayColumnIdsArray } from '../../column.utils'
import MuiTableCell from '@mui/material/TableCell'
import LinearProgress from '@mui/material/LinearProgress'
import { getTablePresetProps } from '../utils/getTablePresetProps'
import { ColumnActionsFiltersMenu } from './components/ColumnActionsFiltersMenu'

interface DetailedPannelProps {
	userId: string
	rowId: string
	openedDetailedPanels: any
}

const DetailedPanel = (props: DetailedPannelProps) => {
	const clickedCell = props?.openedDetailedPanels?.[props?.rowId]?.cell || {}

	if (
		clickedCell?.row?.original.member.id === props.userId &&
		['lastTalk', 'mood', 'riskOfLeaving', 'performance'].includes(
			clickedCell?.column?.id
		)
	) {
		return (
			<div>
				<Typography variant={'h6'}>{clickedCell.column.id}123123123</Typography>
				<Typography variant={'body1'}>userId: {props.userId}</Typography>
			</div>
		)
	}

	return <div>{props.userId}</div>
}

const SummaryRowExampleCellValue = (props) => {
	const { column, defaultStyles } = props

	const rows = column.getFacetedRowModel().rows

	const getColumnValues = (columnId) => {
		return rows.reduce((result, row) => {
			if (!result.hasOwnProperty(row.original[columnId])) {
				return {
					...result,
					[row.original[columnId]]: 1,
				}
			}
			return {
				...result,
				[row.original[columnId]]: result[row.original[columnId]] + 1,
			}
		}, {})
	}

	if (Table_DisplayColumnIdsArray.includes(column.id)) {
		return null
	}

	if (column.id === 'member') {
		return <span>Statistics of your team:</span>
	}

	const getProgressBarValue = (columnId) => {
		const colValues = getColumnValues(columnId)
		let partialCount = 0

		if (columnId === 'performance') {
			partialCount += colValues['Often exceeds']
			partialCount += colValues['Sometimes exceeds']
		}

		if (columnId === 'riskOfLeaving') {
			partialCount += colValues['Leaver']
			partialCount += colValues['High']
		}

		return Math.round(100 - (100 * partialCount) / rows.length)
	}

	if (column.id === utilColumns.column) {
		return <MuiTableCell sx={{ ...defaultStyles }}></MuiTableCell>
	}

	if (column.id === 'member') {
		return (
			<MuiTableCell sx={{ ...defaultStyles }}>
				Statistics of your team:
			</MuiTableCell>
		)
	}

	return (
		<MuiTableCell sx={{ ...defaultStyles }}>
			<LinearProgress
				sx={{
					width: '100%',
					height: '12px',
					backgroundColor: '#FED7D7',
					'& > span': {
						backgroundColor: '#93E98C',
					},
				}}
				variant="determinate"
				value={getProgressBarValue(column.id)}
			/>
		</MuiTableCell>
	)
}

const columns = getPeopleColumns()
const data = getSeparatedPeopleMembers()
const innerTableData = getSeparatedPeopleMembers(50)

export const PeopleTable: Story<TableComponentProps> = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const columnsWithCellActions = columns.map((column) => {
		if (column.accessorKey === 'riskOfLeaving') {
			return {
				...column,
				cellAction: ({ row, table }) => setIsSidebarOpen(true),
				cellActionIcon: <OpenIcon />,
			}
		}
		return column
	})

	return (
		<>
			<Sidebar
				open={isSidebarOpen}
				onClose={() => setIsSidebarOpen(false)}
				withHeader
				headerTitle="Sidebar title"
				innerTable
			>
				<TableComponent
					innerTable
					innerTableTitle="Title"
					data={innerTableData}
					columns={columns}
					enableRowNumbers={false}
					enableBottomToolbar={false}
					initialState={{
						// @ts-ignore
						expanded: false,
						showColumnFilters: true,

					}}
					{...getTablePresetProps('PeoplePresets')}
				/>
			</Sidebar>
			<TableComponent
				data={data}
				isTablePlugSlotActive={false}
				tablePlugSlot={<Typography variant={'h6'}>No data</Typography>}
				// enableExpanding
				// manualExpanding
				enableDetailedPanel
				enableGrouping
				enableColumnFilters
				enablePinning
				// enableStickyHeader
				ColumnActionsFiltersMenu={ColumnActionsFiltersMenu}
				enableColumnFilterModes
				summaryRowCell={(props) => <SummaryRowExampleCellValue {...props} />}
				// enableSummaryRow
				detailedRowBackgroundColor={'#fafafc'}
				enableRowSelection
				hideRowSelectionColumn
				expandByClick={ExpandByClick.CellAction}
				muiTableStatusBarWrapperProps={{ sx: { p: '9px 15px' } }}
				// enableRowVirtualization
				cellStyleRules={{
					performance: {
						executeStyleCondition: ({ cell, column, isCurrentCellClicked }) => {
							if (cell.getValue() === 'Meets') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? { borderBottom: 'none' }
										: { borderRight: '1px solid #FED7D7' }),
								}
							}
						},
					},
					riskOfLeaving: {
						executeStyleCondition: ({ cell, column, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							if (cellValue === 'High') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}

							if (cellValue === 'Leaver') {
								return {
									backgroundColor: '#FED7D7',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FFAEAE' }),
								}
							}
						},
					},
					mood: {
						executeStyleCondition: ({ cell, column, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							if (cellValue === 'Netral') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}

							if (cellValue === 'Demotivated') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}
						},
					},
					lastTalk: {
						executeStyleCondition: ({ cell, column, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							const isDateInPastForMonth = (date) => {
								const monthAgo = new Date()
								monthAgo.setMonth(monthAgo.getMonth() - 1)
								return date < monthAgo
							}

							if (isDateInPastForMonth(cellValue)) {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}
						},
					},
					totalWorkload: {
						executeStyleCondition: ({ cell, column, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							if (cellValue === '100%') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}

							if (cellValue === 'On bench') {
								return {
									backgroundColor: '#FED7D7',
									color: '#B32424',
									...(isCurrentCellClicked || column.getIsGrouped()
										? {}
										: { borderRight: '1px solid #FFAEAE' }),
								}
							}
						},
					},
				}}
				columns={columnsWithCellActions}
				initialState={{
					// @ts-ignore
					expanded: false,
					showColumnFilters: true,

				}}
				renderDetailPanel={({ row, ...rest }) => (
					<DetailedPanel
						userId={row?.original?.member?.id}
						rowId={row?.id}
						openedDetailedPanels={rest.table.getState().openedDetailedPanels}
					/>
				)}
				hideDefaultExpandIcon
				{...getTablePresetProps('PeoplePresets')}
			/>
		</>
	)
}

const meta: Meta = {
	title: 'Data Examples/People',
}

export default meta
