import React from 'react'
import { Meta, Story } from '@storybook/react'
import TableComponent, { TableComponentProps, Table_ColumnDef } from '../../'
import { faker } from '@faker-js/faker'
import { Tooltip, Typography } from '@mui/material'
import {
	getPeopleColumns,
	getSeparatedPeopleMembers,
} from '../utils/getPeopleColumns'
import { GroupedCellBase } from '../../body/GroupedCellBase'
import { Table_DisplayColumnIdsArray } from '../../column.utils'

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
	const { column } = props

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

	return (
		<Tooltip
			arrow
			title={
				<>
					<ul>
						{Object.entries(getColumnValues(column.id)).map((el) => (
							<li>
								{el[0]}: {el[1]}
							</li>
						))}
					</ul>
				</>
			}
		>
			<span>Column info</span>
		</Tooltip>
	)
}

const columns = getPeopleColumns()
const data = getSeparatedPeopleMembers()

export const PeopleTable: Story<TableComponentProps> = () => {
	return (
		<TableComponent
			data={data}
			enableDetailedPanel
			notClickableCells={['member']}
			detailedRowBackgroundColor={'#fafafc'}
			enableRowSelection
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
						const cellValue = cell.getValue();

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
					executeStyleCondition: ({cell, isCurrentCellClicked}) => {
						const cellValue = cell.getValue();

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
					executeStyleCondition: ({cell, isCurrentCellClicked}) => {
						const cellValue = cell.getValue();

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
					executeStyleCondition: ({cell, isCurrentCellClicked}) => {
						const cellValue = cell.getValue();

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
			columns={columns}
			summaryRowCellValue={(column) => (
				<SummaryRowExampleCellValue column={column} />
			)}
			// @ts-ignore
			initialState={{ expanded: false }}
			renderDetailPanel={({ row, ...rest }) => (
				<DetailedPanel
					userId={row?.original?.member?.id}
					clickedCells={rest.table.getState().clickedCells}
				/>
			)}
			hideDefaultExpandIcon
		/>
	)
}

const meta: Meta = {
	title: 'Data Examples/People',
}

export default meta
