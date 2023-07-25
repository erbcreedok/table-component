import React from 'react'

import { Flex } from '../../components/Flex'
import { Avatar, Typography } from '@mui/material'
import { faker } from '@faker-js/faker'
import { SelectCheckbox, RowActionMenuButton, HeaderBase } from '../../'
import { getRandomFromArray } from './getRandomFromArray'
import { TextEllipsis } from '../../components/TextEllipsis'

const ClickableCell = ({ row, accessorKey }) => {
	const title = row.original[accessorKey]

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
				flexGrow: 1,
			}}
		>
			{cellContent}
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
			enableFiltering: true,
			enableDividerRight: true,
			Header: ({ header, table }) => (
				<Flex gap="0.75rem" sx={{ padding: '0 0.575rem' }}>
					<SelectCheckbox table={table} selectAll />
					<HeaderBase column={header.column} />
				</Flex>
			),
			Cell: ({ row, table }) => {
				const user = row.original.member

				return (
					<Flex
						center="y"
						gap="0.75rem"
						style={{ minWidth: '100%', padding: '0 0.575rem' }}
						title={user.fullName}
					>
						<SelectCheckbox table={table} row={row} />
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
			enableFiltering: true,
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			Cell: ({ row }) => (
				<ClickableCell
					row={row}
					accessorKey="performance"
				/>
			),
			cellAction: 'expand',
		},
		{
			header: 'Risk of leaving',
			accessorKey: 'riskOfLeaving',
			enableFiltering: true,
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			sortDescFirst: false,
			Cell: ({ row }) => (
				<ClickableCell
					row={row}
					accessorKey="riskOfLeaving"
				/>
			),
			cellAction: 'expand'
		},
		{
			header: 'Mood',
			accessorKey: 'mood',
			filterVariant: 'multi-select',
			enableFiltering: true,
			enableColumnOrdering: true,
			enableSorting: false,
			Cell: ({ row }) => (
				<ClickableCell row={row} accessorKey="mood" />
			),
			cellAction: 'expand'
		},
		{
			header: 'Last talk',
			accessorKey: 'lastTalk',
			enableFiltering: true,
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			enableGrouping: false,
			Cell: ({ row }) => (
				<ClickableCell
					row={row}
					accessorKey="lastTalk"
				/>
			),
			cellAction: 'expand'
		},
		{
			header: 'Total workload',
			enableFiltering: true,
			accessorKey: 'totalWorkload',
			filterVariant: 'multi-select',
			enableColumnOrdering: true,
			Cell: ({ row }) => (
				<ClickableCell
					row={row}
					accessorKey="totalWorkload"
				/>
			),
			cellAction: 'expand'
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
export const getSeparatedPeopleMembers = (length = 10): ReturnType<typeof getPeopleMember>[] =>
	[...Array(length)].map(() => getPeopleMember(getRandomFromArray(savedUsers)))
