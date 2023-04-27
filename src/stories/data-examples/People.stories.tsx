import React from 'react'
import { Meta, Story } from '@storybook/react'
import TableComponent, { TableComponentProps, Table_ColumnDef } from '../../'
import { faker } from '@faker-js/faker'
import { Typography } from '@mui/material'
import { getPeopleColumns, getSeparatedPeopleMembers } from "../utils/getPeopleColumns";

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
		['lastTalk', 'mood', 'riskOfLeaving', 'performance'].includes(clickedCell?.column?.id)
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

const columns = getPeopleColumns()
const data = getSeparatedPeopleMembers()

export const PeopleTable: Story<TableComponentProps> = () => {
	return (
		<TableComponent
			data={data}
			enableExpanding
			manualExpanding
			enableDetailedPanel
			detailedRowBackgroundColor={'#fafafc'}
			notClickableCells={['member']}
			columns={columns}
			// @ts-ignore
			initialState={{ expanded: false }}
			renderDetailPanel={({ row, ...rest }) => (
				<DetailedPanel
					userId={row.original.member.id}
					clickedCells={rest.table.getState().clickedCells}
				/>
			)}
		/>
	)
}

const meta: Meta = {
	title: 'Data Examples/People',
}

export default meta