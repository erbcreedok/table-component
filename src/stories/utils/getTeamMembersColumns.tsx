import { Avatar, CircularProgress, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import { TableCellProps } from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import { addDays, isAfter } from 'date-fns'
import React, { useCallback, useEffect, useState } from 'react'
import { AnalyticsIcon } from '../../icons/AnalyticsIcon'
import {
	CellBase,
	Flex,
	GroupedCellBase,
	HeaderBase,
	HeaderSearch,
	HeaderSearchOptionProps,
	Input,
	ReactHookForm,
	RowActionMenuButton,
	Select,
	TextEllipsis,
} from '../../index'
import {
	Table_Cell,
	Table_Column,
	Table_ColumnDef,
	Table_Row,
	TableInstance,
} from '../../TableComponent'
import { getGroupingValue, getNestedProp } from '../../utils/getNestedProp'
import { TeamMember, User } from '../types/TeamMember'
import { Colors, performanceValues } from './constants'
import { convertDate } from './convertDate'
import { createGetColors } from './createGetColors'
import { anyOfDateRange } from './customFilterFns'
import { getCellFieldId } from './getCellFieldId'
import { isTeamMember } from './getTeamMembers'
import { getTeamsBorderColorSet } from './getTeamsBorderColorSet'
import { getTeamsCellBackgroundSet } from './getTeamsCellBackgroundSet'
import { searchUsers } from './searchUsers'
import { sortByArrayOrder } from './sortByArrayOrder'

const getBorderColors = createGetColors(getTeamsBorderColorSet(), {
	fallback: Colors.lightestGrey,
})
const getBackgroundColors = createGetColors(getTeamsCellBackgroundSet())

export const ColoredGroupedCell: typeof GroupedCellBase = (props) => {
	const columnId = props.cell.column.id
	const groupId = props.row.groupIds[columnId]
	const value = props.row.groupRows[groupId]?.getValue(columnId)

	return (
		<GroupedCellBase
			borderColor={getBorderColors(columnId, value)}
			{...props}
		/>
	)
}

export const GroupedCellCollapsedContentExample = ({ table, row, cell }) => {
	return <Typography variant="body1">test</Typography>
}

export const coloredCellProps = <
	TData extends Record<string, any> = {}
>(props: {
	cell: Table_Cell<TData>
	column: Table_Column<TData>
	row: Table_Row<TData>
	table: TableInstance<TData>
}): TableCellProps => {
	const columnId = props.cell.column.id
	const value = props.cell.getValue()

	return {
		sx: { backgroundColor: getBackgroundColors(columnId, value) },
	}
}

export const teamMemberAccessorFn =
	(accessorKey: string) => (item: TeamMember) => {
		if (isTeamMember(item)) {
			return getNestedProp(item, accessorKey)
		}
		return ''
	}

const SearchOption = ({
	item,
	onClick,
}: HeaderSearchOptionProps<TeamMember>) => (
	<Box
		onClick={onClick}
		sx={{
			display: 'flex',
			alignItems: 'center',
			p: '9px 12px',
			gap: '12px',
			'&:hover': { background: Colors.bg },
		}}
	>
		<Avatar
			sx={{ width: 24, height: 24 }}
			src={item.member.avatarUrl}
			alt={item.member.fullName}
		/>
		<Typography>
			<TextEllipsis style={{ fontSize: '14px' }} title={item.member.fullName}>
				{item.member.fullName}
			</TextEllipsis>
		</Typography>
	</Box>
)

export const getTeamMembersColumns = () => {
	return [
		{
			header: 'Team member',
			accessorFn: teamMemberAccessorFn('member'),
			displayDataKey: 'member',
			sortingKey: 'member.fullName',
			filteringKey: 'member.fullName',
			id: 'teamMember',
			dataType: 'textual',
			filterVariant: 'text',
			filterFn: 'contains',
			required: true,
			Cell: ({ row, column, cell, table }) => {
				if (column.getIsGrouped()) {
					const { columnDef } = column
					const { groupingKey } = columnDef
					return (
						(groupingKey
							? getGroupingValue(row, groupingKey, table)
							: cell.getValue()) ?? 'N/A'
					)
				}
				const user = row.original.member
				if (!user) return <div>No user</div>
				return (
					<Flex center="y" gap="0.75rem" sx={{ flexGrow: 1, maxWidth: '100%' }}>
						<Avatar
							sx={{ width: 36, height: 36 }}
							src={user.avatarUrl}
							alt={user.fullName}
						/>
						<Flex column sx={{ overflow: 'hidden' }}>
							<TextEllipsis
								style={{ fontSize: '0.875rem' }}
								title={user.fullName}
							>
								{user.fullName}
							</TextEllipsis>
							<TextEllipsis
								sx={{
									color: '#6C6F80',
									fontSize: '0.75rem',
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
			GroupedCell: ColoredGroupedCell,
			enableColumnOrdering: false,
			enableDividerRight: true,
			enableGrouping: false,
			enableHiding: false,
			minSize: 250,
			Header: ({ column, header, table }) => (
				<HeaderSearch
					column={column}
					header={header}
					table={table}
					searchPath="member.fullName"
					placeholder="Search for employee"
					renderOption={SearchOption}
				/>
			),
			ColumnActionsFilterField: ({ value, onChange }) => (
				<Box sx={{ px: '12px', width: '100%', boxSizing: 'border-box' }}>
					<Typography>Custom Filter Head Field</Typography>
					<TextField
						fullWidth
						variant="outlined"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				</Box>
			),
			FilterField: ({ onChange, value, autoFocus }) => (
				<Box sx={{ px: '12px', width: '100%', boxSizing: 'border-box' }}>
					<Typography>Custom Filter Field</Typography>
					<TextField
						fullWidth
						variant="outlined"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						autoFocus={autoFocus}
					/>
				</Box>
			),
			FilterChipField: ({ onChange, value }) => (
				<Box sx={{ px: '12px', width: '100%', boxSizing: 'border-box' }}>
					<Typography>Custom Filter Chip Field</Typography>
					<TextField
						size="small"
						fullWidth
						variant="outlined"
						value={value}
						onChange={(e) => onChange(e.target.value)}
					/>
				</Box>
			),
			getEditValue: (rowOriginal: TeamMember) => rowOriginal.member,
			Edit: (props) => {
				const fieldId = getCellFieldId(props.cell)
				const { control } = ReactHookForm.useFormContext()
				const [loading, setLoading] = useState(false)
				const [options, setOptions] = useState<User[]>([])
				const value = ReactHookForm.useWatch({ name: props.row.id, control })

				const handleInputChange = useCallback(async (_, value: string) => {
					setLoading(true)
					setOptions(await searchUsers(value))
					setLoading(false)
				}, [])

				useEffect(() => {
					handleInputChange(null, '')
				}, [handleInputChange])

				if (!value) return null

				return (
					<ReactHookForm.Controller
						name={fieldId}
						control={control}
						rules={{ required: '`Team member` field is required' }}
						render={({ field, fieldState }) => (
							<Select<User, false>
								onInputChange={handleInputChange}
								options={options}
								{...field}
								onChange={(e, value) => {
									field.onChange(value)
								}}
								clearIcon={null}
								loading={loading}
								filterOptions={(options) => options}
								getOptionLabel={(option) => option.fullName}
								renderInput={(params) => (
									<Input
										{...params}
										error={fieldState.error?.message}
										InputProps={{
											...params.InputProps,
											startAdornment: (
												<Avatar
													sx={{ width: 24, height: 24 }}
													src={field.value?.avatarUrl}
													alt={field.value?.fullName}
												/>
											),
											endAdornment: (
												<>
													{params.InputProps.endAdornment}
													{loading && <CircularProgress size={16} />}
												</>
											),
										}}
									/>
								)}
								renderOption={(props, user) => {
									return (
										<li {...props}>
											<Flex
												center="y"
												gap="8px"
												style={{ minWidth: '100%', padding: '0 0' }}
											>
												<Avatar
													sx={{ width: 24, height: 24 }}
													src={user?.avatarUrl}
													alt={user?.fullName}
												/>
												<Flex column style={{ overflow: 'hidden' }}>
													<TextEllipsis
														style={{ fontSize: '12px' }}
														title={user?.fullName ?? 'N/A'}
													>
														{user?.fullName}
													</TextEllipsis>
													<TextEllipsis
														style={{
															color: '#6C6F80',
															fontSize: '10px',
															fontWeight: '400',
														}}
													>
														{user?.role}
													</TextEllipsis>
												</Flex>
											</Flex>
										</li>
									)
								}}
							/>
						)}
					/>
				)
			},
		},
		{
			header: 'Impact on the project',
			shortHeader: 'Impact',
			id: 'impact',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('impact'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			GroupedCellCollapsedContent: GroupedCellCollapsedContentExample,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			enableSorting: false,
		},
		{
			header: 'Performance',
			id: 'performance',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('performance'),
			filterVariant: 'multi-select',
			editVariant: 'select',
			editSelectOptions: [
				...performanceValues,
				{ label: 'N/A', value: undefined },
			],
			GroupedCell: ColoredGroupedCell,
			headerEndAdornment: <AnalyticsIcon />,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			filterSelectOptions: [
				...performanceValues,
				{ label: 'N/A', value: undefined },
			],
			sortingFn(rowA, rowB) {
				return sortByArrayOrder(performanceValues)(
					rowA.getValue('performance'),
					rowB.getValue('performance')
				)
			},
		},
		{
			header: 'Risk of leaving',
			id: 'riskOfLeaving',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('riskOfLeaving'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			muiTableBodyCellProps: coloredCellProps,
			enableColumnOrdering: true,
			sortDescFirst: false,
			editVariant: 'text',
			sortUndefined: -1,
			validator: ({ value }) => {
				if (!value) return true
				const validationResult = /^(?:Leaver|High|Medium|Low)*$/i.test(value)

				if (validationResult === false) {
					return 'Possible one of values: Leaver, High, Medium, Low'
				}
				return validationResult
			},
		},
		{
			header: 'Succession status',
			shortHeader: 'Succession',
			id: 'successionStatus',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('successionStatus'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
			enableGrouping: false,
		},
		{
			header: 'Location',
			id: 'location',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('location'),
			filterVariant: 'multi-select',
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
			editVariant: 'text',
			required: true,
		},
		{
			header: 'Hired At',
			id: 'hiredAt',
			accessorFn: teamMemberAccessorFn('hiredAt'),
			filterVariant: 'multi-select',
			GroupedCell: ({ children, ...props }) => (
				<ColoredGroupedCell {...props}>
					<CellBase
						{...props}
						text={convertDate(props.cell.getValue() as Date, {
							weekday: 'short',
						})}
					/>
				</ColoredGroupedCell>
			),
			Header: HeaderBase,
			enableColumnOrdering: true,
			Cell: ({ cell }) => (
				<div onClick={() => console.log(cell.getValue())}>
					{convertDate(cell.getValue() as Date)}
				</div>
			),
			filterSelectOptions: [
				'Less than 1 months',
				'Between 1 and 3 months',
				'More than 3 months',
				'N/A',
			],
			filterFn: anyOfDateRange,
			editVariant: 'date',
			validator: ({ value }) => {
				if (!value) return true
				if (isAfter(new Date(value), addDays(new Date(), 1))) {
					return 'Date should be before today'
				}

				return true
			},
		},
		{
			header: 'Project completion',
			shortHeader: 'Completion',
			id: 'completion',
			accessorFn: teamMemberAccessorFn('completion'),
			GroupedCell: ColoredGroupedCell,
			Header: HeaderBase,
			enableColumnOrdering: true,
			editVariant: 'number',
			minValue: -100,
			maxValue: 100000,
			sortingType: 'numeric',
			enableColumnActions: false,
			validator: ({ value }) => {
				if (!value) return true
				if (Number(value) % 5 !== 0) {
					return 'Only multiples of 5 are allowed'
				}

				return true
			},
			cellPlaceholderText: '-',
			muiTableBodyCellWrapperProps: {
				sx: { justifyContent: 'flex-end' },
			},
			formatCellValue: (value: unknown) => {
				if (value == null) return value

				const number = Number(value)
				return `${
					!isNaN(number) ? Math.trunc(number * 100) / 100 : value
				}`.replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
			},
		},
		{
			header: 'User agent',
			id: 'userAgent',
			dataType: 'textual',
			accessorFn: teamMemberAccessorFn('userAgent'),
			filterVariant: 'multi-select',
			notDisplayed: true,
		},
		// {
		// 	header: 'Lorem Ipsum',
		// 	id: 'lorem',
		// 	dataType: 'textual',
		// 	accessorFn: teamMemberAccessorFn('lorem'),
		// 	filterVariant: 'multi-select',
		// 	GroupedCell: ColoredGroupedCell,
		// 	muiTableBodyCellProps: coloredCellProps,
		// 	enableColumnOrdering: true,
		// 	enableSorting: false,
		// 	enableGrouping: false,
		// },
	] as Array<Table_ColumnDef<TeamMember>>
}
