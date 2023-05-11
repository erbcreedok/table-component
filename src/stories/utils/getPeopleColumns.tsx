import React from 'react'

import { Flex } from '../../components/Flex'
import { Avatar, Box, Typography } from '@mui/material'
import { faker } from '@faker-js/faker'
import { getRandomFromArray } from './getRandomFromArray'
import { Close } from '@mui/icons-material'
import { TextEllipsis } from '../../components/TextEllipsis'
import { RowActionMenuButton } from '../../buttons/RowActionMenuButton'

const ClickableCell = ({ row, table, cell, accessorKey }) => {
	const title = row.original[accessorKey]
	const clickedCells = table.getState()?.clickedCells || []
	const isCurrentCellClicked = clickedCells.some(
		(clickedCell) => cell?.id === clickedCell?.id
	)

	let cellContent = <></>

	if (accessorKey === 'lastTalk') {
		const convertDate = (date) =>{
			const options: any = { year: 'numeric', month: 'short', day: 'numeric' }
			return new Intl.DateTimeFormat('en-US', options).format(date)
		}
		cellContent = (
			<Typography variant={'body2'}>
				{convertDate(new Date(title))}
			</Typography>
		)
	}

	if (accessorKey === 'member') {
		cellContent = <Typography variant={'body2'}>{title.fullName}</Typography>
	}

	if (
		['performance', 'riskOfLeaving', 'mood', 'totalWorkload'].includes(
			accessorKey
		)
	) {
		cellContent = <Typography variant={'body2'}>{title}</Typography>
	}

	return (
		<Flex
			center="y"
			justifyContent="space-between"
			style={{
				minWidth: '100%',
				margin: '0 -5px',
			}}
		>
			{cellContent}
			{isCurrentCellClicked && (
				<Box
					sx={{
						border: '1px solid #ced0db',
						borderRadius: '5px',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						width: 25,
						height: 25,
					}}
				>
					<Close style={{ fontSize: 14 }} />
				</Box>
			)}
		</Flex>
	)
}

export const getPeopleColumns = () =>
	[
		{
			header: 'Team member',
			accessorKey: 'member',
			filterVariant: 'multi-select',
			enableColumnOrdering: false,
			enableHiding: false,
			Cell: ({ row, table }) => {
				const user = row.original.member

				return (
					<Flex
						center="y"
						gap="0.75rem"
						style={{ minWidth: '100%', padding: '0 0.575rem' }}
						title={user.fullName}
					>
						<Avatar
							sx={{ width: 32, height: 32 }}
							src={user.avatarUrl}
							alt={user.fullName}
						/>
						<Flex column style={{ overflow: 'hidden' }}>
							<TextEllipsis style={{ fontSize: '0.875rem' }}>
								{user.fullName}
							</TextEllipsis>
							<TextEllipsis
								style={{
									color: '#6C6F80',
									fontSize: '12px',
									fontWeight: '400',
								}}
							>
								{user.role}
							</TextEllipsis>
						</Flex>
						<RowActionMenuButton table={table} row={row} sx={{ ml: 'auto' }} />
					</Flex>
				)
			},
		},
		{
			header: 'Performance',
			accessorKey: 'performance',
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			Cell: ({ row, table, cell }) => (
				<ClickableCell
					row={row}
					table={table}
					cell={cell}
					accessorKey="performance"
				/>
			),
		},
		{
			header: 'Risk of leaving',
			accessorKey: 'riskOfLeaving',
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			sortDescFirst: false,
			Cell: ({ row, table, cell }) => (
				<ClickableCell
					row={row}
					table={table}
					cell={cell}
					accessorKey="riskOfLeaving"
				/>
			),
		},
		{
			header: 'Mood',
			accessorKey: 'mood',
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			enableSorting: false,
			Cell: ({ row, table, cell }) => (
				<ClickableCell row={row} table={table} cell={cell} accessorKey="mood" />
			),
		},
		{
			header: 'Last talk',
			accessorKey: 'lastTalk',
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			enableGrouping: false,
			Cell: ({ row, table, cell }) => (
				<ClickableCell
					row={row}
					table={table}
					cell={cell}
					accessorKey="lastTalk"
				/>
			),
		},
		{
			header: 'Total workload',
			accessorKey: 'totalWorkload',
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			Cell: ({ row, table, cell }) => (
				<ClickableCell
					row={row}
					table={table}
					cell={cell}
					accessorKey="totalWorkload"
				/>
			),
		},
	] as any

const performances = ['Often exceeds', 'Sometimes exceeds', 'Meets']
const risksOfLeaving = ['Leaver', 'High', 'Medium', 'Low']
const mood = ['Positive', 'Netral', 'Demotivated']
const totalWorkload = ['100%', '50%', '25%', 'On bench']

export const getUsers = (length = 200, prefix = '') =>
	[...Array(length)].map((_, index) => ({
		id: faker.datatype.uuid(),
		fullName: `${prefix}${index + 1}. ${faker.name.fullName()}`,
		avatarUrl: faker.image.avatar(),
		role: faker.name.jobTitle(),
	}))

const savedUsers = getUsers()

export const getPeopleMember = (user?: any) => ({
	id: faker.datatype.uuid(),
	member: getRandomFromArray(savedUsers),
	performance: getRandomFromArray(performances),
	riskOfLeaving: getRandomFromArray(risksOfLeaving),
	mood: getRandomFromArray(mood),
	lastTalk: faker.date.between(
		'2020-01-01T00:00:00.000Z',
		'2030-01-01T00:00:00.000Z'
	),
	totalWorkload: getRandomFromArray(totalWorkload),
})
export const getSeparatedPeopleMembers = (length = 20): any =>
	[...Array(length)].map(() => getPeopleMember(getRandomFromArray(savedUsers)))
