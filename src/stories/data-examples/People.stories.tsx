import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import TableComponent, { TableComponentProps, Sidebar } from '../../'
import { Box, Button, Checkbox, Typography } from '@mui/material'
import {
	getPeopleColumns,
	getSeparatedPeopleMembers,
} from '../utils/getPeopleColumns'
import { Table_DisplayColumnIdsArray } from '../../column.utils'
import MuiTableCell from '@mui/material/TableCell'
import LinearProgress from '@mui/material/LinearProgress'
import { getTablePresetProps } from '../utils/getTablePresetProps'

interface DetailedPannelProps {
	userId: string
	clickedCells: any
}

const DetailedPanel = (props: DetailedPannelProps) => {
	const clickedCell =
		props?.clickedCells?.find((cell) => {
			return cell.row.original.member.id === props.userId
		}) || {}

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

	if (column.id === 'mrt-row-select') {
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

interface SubFilterItemProps {
	value: string
	isChecked: boolean
	onClick: () => void
}
const SubFilterItem = (props: SubFilterItemProps) => {
	const { value, isChecked, onClick } = props

	return (
		<Box
			sx={{
				display: 'flex',
				alignItems: 'center',
				marginTop: '15px',
			}}
		>
			<Checkbox
				onClick={onClick}
				checked={isChecked}
				sx={{ padding: 0, marginRight: '2px' }}
			/>
			<Typography variant="body2" color="#303240">
				{value}
			</Typography>
		</Box>
)
}

const columns = getPeopleColumns()
const data = getSeparatedPeopleMembers()

export const PeopleTable: Story<TableComponentProps> = () => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false)
	const columnsWithCellActions = columns.map((column) => {
		if (column.accessorKey === 'riskOfLeaving') {
			return ({
				...column,
				cellAction: ({ row, table }) => setIsSidebarOpen(true)
			})
		}
		return column
	})

	return (
		<>
			<Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} withHeader headerTitle="Sidebar title"></Sidebar>
			<TableComponent
				data={data}
				// enableExpanding
				// manualExpanding
				// enableDetailedPanel
				enableColumnFilters
				enablePinning
				enableColumnFiltersSelection
				// enableStickyHeader
				subFilterSelection={(props) => {
					const {
						selectedFilters,
						filterValues,

						onCheckFilter,
						onCheckAllFilters,
						onApplyFilters,
					} = props

					return (
						<div style={{ minWidth: 245, padding: '0 15px' }}>
							<Typography
								variant="body2"
								color="#303240"
								style={{ fontWeight: 600 }}
							>
								Filters
							</Typography>

							<Box>
								<Box
									sx={{
										borderBottom: '1px solid #E1E3EB',
										paddingBottom: '15px',
									}}
								>
									<SubFilterItem
										value="Select All"
										onClick={onCheckAllFilters}
										isChecked={selectedFilters.length === filterValues.length}
									/>
								</Box>

								{filterValues.map((value) => {
									return (
										<SubFilterItem
											key={value}
											isChecked={selectedFilters.includes(value)}
											onClick={() => onCheckFilter(value)}
											value={value}
										/>
									)
								})}
							</Box>

							<Box
								sx={{
									borderTop: '1px solid #E1E3EB',
									display: 'flex',
									justifyContent: 'flex-end',
									paddingTop: '10px',
									marginTop: '15px',
								}}
							>
								<Button
									type="button"
									variant="contained"
									color="primary"
									onClick={onApplyFilters}
									sx={{ backgroundColor: '#009ECC', color: '#FFFFFF' }}
								>
									Apply
								</Button>
							</Box>
						</div>
					)
				}}
				enableColumnFilterModes
				summaryRowCell={(props) => <SummaryRowExampleCellValue {...props} />}
				// enableSummaryRow
				notClickableCells={['member']}
				detailedRowBackgroundColor={'#fafafc'}
				enableRowSelection
				// enableRowVirtualization
				cellStyleRules={{
					performance: {
						executeStyleCondition: ({ cell, isCurrentCellClicked }) => {
							if (cell.getValue() === 'Meets') {
								return {
									backgroundColor: isCurrentCellClicked ? '#fafafc' : '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked
										? { borderBottom: 'none' }
										: { borderRight: '1px solid #FED7D7' }),
								}
							}
						},
					},
					riskOfLeaving: {
						executeStyleCondition: ({ cell, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							if (cellValue === 'High') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}

							if (cellValue === 'Leaver') {
								return {
									backgroundColor: '#FED7D7',
									color: '#B32424',
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FFAEAE' }),
								}
							}
						},
					},
					mood: {
						executeStyleCondition: ({ cell, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							if (cellValue === 'Netral') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}

							if (cellValue === 'Demotivated') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}
						},
					},
					lastTalk: {
						executeStyleCondition: ({ cell, isCurrentCellClicked }) => {
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
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}
						},
					},
					totalWorkload: {
						executeStyleCondition: ({ cell, isCurrentCellClicked }) => {
							const cellValue = cell.getValue()

							if (cellValue === '100%') {
								return {
									backgroundColor: '#FEF8F8',
									color: '#B32424',
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FED7D7' }),
								}
							}

							if (cellValue === 'On bench') {
								return {
									backgroundColor: '#FED7D7',
									color: '#B32424',
									...(isCurrentCellClicked
										? {}
										: { borderRight: '1px solid #FFAEAE' }),
								}
							}
						},
					},
				}}
				columns={columnsWithCellActions}
				// @ts-ignore
				initialState={{ expanded: false, showColumnFilters: true }}
				renderDetailPanel={({ row, ...rest }) => (
					<DetailedPanel
						userId={row?.original?.member?.id}
						clickedCells={rest.table.getState().clickedCells}
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
