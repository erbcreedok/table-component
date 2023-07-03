import { Meta, Story } from '@storybook/react'
import ModeIcon from '@mui/icons-material/Mode'
import LinearProgress from '@mui/material/LinearProgress'
import MuiTableCell from '@mui/material/TableCell'
import {
	ColumnOrderState,
	VisibilityState,
	SortingState,
} from '@tanstack/react-table'
import React, { useState } from 'react'
import { getColumnId } from '../../column.utils'
import { LocationRight } from '../../icons/LocationRight'
import { LockedIcon } from '../../icons/LockedIcon'
import { TrashIcon } from '../../icons/TrashIcon'
import TableComponent, {
	Table_ColumnDef,
	TableComponentProps,
	utilColumns,
} from '../../index'
import { TeamMember, UnitTreeItem } from '../types/TeamMember'
import { getTablePresetProps } from '../utils/getTablePresetProps'
import {
	getExpandingTeamMembers,
	getTeamMembers,
	getUnitTreeItems,
} from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { getDefaultRowActionMenuItems } from '../utils/rowActionMenuItems'
import { ColumnActionsFiltersMenu } from './components/ColumnActionsFiltersMenu'
import { UnitRow } from './components/UnitRow'

const dataTree = getExpandingTeamMembers(10)
const columns = getTeamMembersColumns()

type TeamsTableConfigs = Omit<TableComponentProps<TeamMember>, 'data'> &
	Partial<TableComponentProps<TeamMember>> & {
		bulkActions?: object[]
		disableHidingFor?: string[]
		disableSortingFor?: string[]
		defaultSorting?: SortingState
		defaultColumnOrder?: ColumnOrderState
		defaultColumnVisibility?: VisibilityState
		defaultColumnFilterFns?: string[]
		columnSubtitles: Record<string, string>
	}

type TeamsTableExample = Omit<TeamsTableConfigs, 'data' | 'columns'>

const disableSortingForColumns = (
	disableSortingFor: string[],
	columns: Table_ColumnDef<TeamMember>[]
) => {
	return columns.map((column) => ({
		...column,
		enableSorting: !disableSortingFor.includes(getColumnId(column)),
	}))
}
const disableHidingForColumns = (
	disableHidingFor: string[],
	columns: Table_ColumnDef<TeamMember>[]
) => {
	return columns.map((column) => ({
		...column,
		enableHiding: !disableHidingFor.includes(getColumnId(column)),
	}))
}
const addColumnSubtitle = (
	columnSubtitles: Record<string, string>,
	columns: Table_ColumnDef<TeamMember>[]
) => {
	return columns.map((column) => ({
		...column,
		subtitle: columnSubtitles[getColumnId(column)] ?? undefined,
	}))
}

const setColumnFilterFns = (
	filterFns: string[],
	columns: Table_ColumnDef<TeamMember>[]
) => {
	columns.map((column) => {
		if (
			column.id &&
			filterFns.hasOwnProperty(column.id) &&
			filterFns[column.id]
		) {
			column.filterFn = filterFns[column.id]
		}
		if (
			column.accessorKey &&
			filterFns.hasOwnProperty(column.accessorKey) &&
			filterFns[column.accessorKey]
		) {
			column.filterFn = filterFns[column.accessorKey]
		}
		return column
	})

	return columns
}

const getPropsHandledColumns = (
	columns: Table_ColumnDef<TeamMember>[],
	args: TeamsTableConfigs
) => {
	const {
		disableSortingFor,
		disableHidingFor,
		defaultColumnFilterFns,
		columnSubtitles,
	} = args
	return addColumnSubtitle(
		columnSubtitles,
		disableHidingForColumns(
			[disableHidingFor ?? []].flat(),
			disableSortingForColumns(
				[disableSortingFor ?? []].flat(),
				setColumnFilterFns(defaultColumnFilterFns ?? [], columns)
			)
		)
	)
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

	const getProgressBarValue = (columnId) => {
		const colValues = getColumnValues(columnId)
		let partialCount = 0

		if (columnId === 'impact') {
			partialCount += colValues['Critical']
			partialCount += colValues['High']
		}

		if (columnId === 'riskOfLeaving') {
			partialCount += colValues['Leaver']
			partialCount += colValues['High']
		}

		return Math.round(100 - (100 * partialCount) / rows.length)
	}

	if (column.id === 'table-row-select') {
		return <MuiTableCell sx={{ ...defaultStyles }}></MuiTableCell>
	}

	if (column.id === 'teamMember') {
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

const TeamsTable: Story<TeamsTableConfigs> = (args) => {
	const {
		data: propsData,
		columns,
		defaultSorting,
		defaultColumnOrder,
		defaultColumnVisibility,
		initialState = {},
		...rest
	} = args
	const [data, setData] = useState(propsData || getTeamMembers(100))
	return (
		<TableComponent
			data={data}
			columns={getPropsHandledColumns(columns, args)}
			groupBorder={{ left: '12px solid white', top: '20px solid white', divider: '3px solid #E1E3EB' }}
			initialState={{
				sorting: defaultSorting,
				columnOrder: defaultColumnOrder,
				columnVisibility: defaultColumnVisibility,
				...initialState,
			}}
			renderRowActionMenuItems={getDefaultRowActionMenuItems}
			ColumnActionsFiltersMenu={ColumnActionsFiltersMenu}
			summaryRowCell={(props) => <SummaryRowExampleCellValue {...props} />}
			muiTableBodyRowDragHandleProps={({ table }) => ({
				onDragEnd: () => {
					const { draggingRows, hoveredRow } = table.getState()
					if (hoveredRow && draggingRows.length > 0) {
						const filteredData = data.filter(
							(data, index) =>
								!draggingRows.some((draggingRow) => draggingRow.index === index)
						)
						filteredData.splice(
							filteredData.indexOf(hoveredRow.row.original) +
								(hoveredRow.position === 'bottom' ? 1 : 0),
							0,
							...draggingRows.map((row) => row.original)
						)
						setData(filteredData)
					}
				},
			})}
			validateHoveredRow={({ row }, table) => {
				const { draggingRows, grouping } = table.getState()
				if (grouping.length === 0) return true
				// prevent dragging over rows that are not in the same group
				const canDrag = grouping.every((group) =>
					draggingRows.every(
						(draggingRow) => draggingRow.getValue(group) === row.getValue(group)
					)
				)
				if (!canDrag) {
					return {
						text: 'Cannot reorder rows that are not in same group',
						type: 'danger',
					}
				}
				return canDrag
			}}
			{...getTablePresetProps('teamsDefaultTable')}
			{...rest}
		/>
	)
}

export const TeamsTableDefault: Story<TeamsTableExample> = (args) => (
	<TeamsTable columns={columns} {...args} />
)

export const TeamsTableSubtree: Story<TeamsTableExample> = (args) => (
	<TeamsTable
		columns={columns}
		data={dataTree}
		groupBorder={{ left: '12px solid white', top: '20px solid white', divider: '3px solid #E1E3EB' }}
		{...args}
		enableExpanding
	/>
)

export const HierarchyGroupTableExample: Story = (args) => {
	const [data, setData] = useState(getUnitTreeItems(3, 10))

	return (
		<>
			<TableComponent
				columns={columns as unknown as Table_ColumnDef<UnitTreeItem>[]}
				data={data}
				CustomRow={UnitRow}
				groupBorder={{ left: '12px solid white', top: '20px solid white', divider: '3px solid #E1E3EB' }}
				{...args}
				enableExpanding
				hideRowExpandColumn
				hideTableHead
				filterFromLeafRows
				{...getTablePresetProps('teamsDefaultTable')}
				muiTableBodyRowDragHandleProps={({ table }) => ({
					onDragEnd: () => {
						const { draggingRows, hoveredRow } = table.getState()
						if (
							hoveredRow?.row &&
							'original' in hoveredRow.row &&
							draggingRows.length > 0
						) {
							const unit = hoveredRow.row.original.getParent()
							if (!unit) return
							const filteredData =
								unit.subRows?.filter(
									(data) =>
										!draggingRows.some(
											(draggingRow) => draggingRow.original === data
										)
								) ?? []
							filteredData.splice(
								filteredData.indexOf(hoveredRow.row.original) +
									(hoveredRow.position === 'bottom' ? 1 : 0),
								0,
								...draggingRows.map((row) => row.original)
							)
							const traverse = (data: UnitTreeItem | TeamMember) => {
								if (data.id === unit.id) {
									data.subRows = filteredData
									return
								} else {
									data.subRows?.forEach((subRow) => traverse(subRow))
								}
							}
							const newData = [...data]
							traverse(newData[0])
							setData(newData)
						}
					},
				})}
				validateHoveredRow={({ row }, table) => {
					const { draggingRows, grouping } = table.getState()
					const sameParent = draggingRows.every(
						(draggingRow) =>
							draggingRow.original.getParent() === row.original.getParent()
					)
					if (!sameParent) {
						return {
							text: 'Cannot reorder rows that are not in same unit',
							type: 'danger',
						}
					}
					if (grouping.length > 0) {
						const sameGroup = grouping.every((group) =>
							draggingRows.every(
								(draggingRow) =>
									draggingRow.getValue(group) === row.getValue(group)
							)
						)
						if (!sameGroup) {
							return {
								text: 'Cannot reorder rows that are not in same group',
								type: 'danger',
							}
						}
					}

					return true
				}}
			/>
		</>
	)
}

const meta: Meta = {
	title: 'Data Examples/Teams',
	argTypes: {
		bulkActions: {
			control: 'object',
			defaultValue: [
				{
					icon: <LockedIcon />,
					text: 'Lock',
					enableCaption: false,
					onClick: (props) => console.log('Lock', props),
				},
				{
					icon: <LocationRight />,
					text: 'Change location',
					onClick: (props) => console.log('change location', props),
				},
				{
					icon: <ModeIcon />,
					text: 'Console log',
					onClick: (props) => console.log('log', props),
				},
				{
					icon: <TrashIcon />,
					text: 'Delete',
					onClick: (props) => console.log('Delete', props),
					sx: { color: '#FA4B4B' },
				},
			],
		},
		enableRowSelection: {
			control: 'boolean',
			defaultValue: (row) => row.original.impact !== 'Medium',
			// defaultValue: (row) => true
		},
		uppercaseHeader: {
			control: 'boolean',
			defaultValue: true,
		},
		enableBottomToolbar: {
			control: 'boolean',
			defaultValue: false,
		},
		enableExpanding: {
			control: 'boolean',
			defaultValue: false,
		},
		enableGrouping: {
			control: 'boolean',
			defaultValue: true,
		},
		enablePagination: {
			control: 'boolean',
			defaultValue: false,
		},
		enableColumnResizing: {
			control: 'boolean',
			defaultValue: true,
		},
		enableColumnOrdering: {
			control: 'boolean',
			defaultValue: true,
		},
		enableColumnDragging: {
			control: 'boolean',
			defaultValue: false,
		},
		enableColumnFilters: {
			control: 'boolean',
			defaultValue: true,
		},
		enableSorting: {
			control: 'boolean',
			defaultValue: true,
		},
		enableMultiSort: {
			control: 'boolean',
			defaultValue: true,
		},
		enableSummaryRow: {
			control: 'boolean',
			defaultValue: false,
		},
		enableStickyHeader: {
			control: 'boolean',
			defaultValue: true,
		},
		enableRowActions: {
			control: 'boolean',
			defaultValue: false,
			description:
				'Row actions column will not be visible, if column order state is provided',
		},
		enableRowNumbers: {
			control: 'boolean',
			defaultValue: true,
		},
		enableRowDragging: {
			options: ['enabled', 'disabled', 'Except "Successors identified"'],
			mapping: {
				enabled: true,
				disabled: false,
				'Except "Successors identified"': (row) =>
					row.original.successionStatus !== 'Successors identified',
			},
			control: { type: 'select' },
			defaultValue: 'enabled',
		},
		enablePinning: {
			control: 'boolean',
			defaultValue: false,
			description: 'Pin columns to left or right side of the table',
		},
		enableAggregationRow: {
			control: 'boolean',
			defaultValue: false,
			description: 'Enable aggregation row, when grouping is enabled',
		},
		hideRowSelectionColumn: {
			control: 'boolean',
			defaultValue: false,
			description:
				'Hides row selection column, but do not disables row selection',
		},
		disableHidingFor: {
			options: columns.map((column) => getColumnId(column)),
			control: {
				type: 'check',
				labels: columns.reduce(
					(acc, column) => ({
						...acc,
						[getColumnId(column)]: column.header,
					}),
					{}
				),
			},
			defaultValue: ['teamMember'],
			description:
				'***THIS IS NOT A PROP***\n' + 'Disable hiding for specific columns',
		},
		disableSortingFor: {
			options: columns.map((column) => getColumnId(column)),
			control: {
				type: 'check',
				labels: columns.reduce(
					(acc, column) => ({
						...acc,
						[getColumnId(column)]: column.header,
					}),
					{}
				),
			},
			defaultValue: [],
			description:
				'***THIS IS NOT A PROP***\n' + 'Disable sorting for specific columns',
		},
		defaultSorting: {
			options: columns
				.map((column) => [`${column.header} - ASC`, `${column.header} - DESC`])
				.flat(),
			mapping: columns.reduce(
				(acc, column) => ({
					...acc,
					[`${column.header} - ASC`]: [{ id: getColumnId(column) }],
					[`${column.header} - DESC`]: [
						{ id: getColumnId(column), desc: true },
					],
				}),
				{}
			),
			control: { type: 'select' },
			description:
				'***THIS IS NOT A PROP***\n' +
				'Set Default sorting for Table. Rerender Table to apply value',
		},
		defaultColumnOrder: {
			control: { type: 'object' },
			defaultValue: [
				utilColumns.column,
				utilColumns.expand,
				...columns.map(getColumnId),
			],
			description:
				'***THIS IS NOT A PROP***\n' +
				'Set Default column order for Table. Rerender Table to apply value',
		},
		defaultColumnVisibility: {
			control: { type: 'object' },
			defaultValue: columns.map(getColumnId).reduce(
				(acc, columnId) => ({
					...acc,
					[columnId]: true,
				}),
				{}
			),
			description:
				'***THIS IS NOT A PROP***\n' +
				'Set Default column visibility for Table. Rerender Table to apply value',
		},
		defaultColumnFilterFns: {
			control: { type: 'object' },
			defaultValue: columns.map(getColumnId).reduce(
				(acc, columnId) => ({
					...acc,
					[columnId]: undefined,
				}),
				{}
			),
			description:
				'***THIS IS NOT A PROP***\n' +
				'Set Default column filter function for Table. Rerender Table to apply value',
		},
		columnSubtitles: {
			control: { type: 'object' },
			defaultValue: columns.map(getColumnId).reduce(
				(acc, columnId) => ({
					...acc,
					[columnId]: undefined,
				}),
				{}
			),
			description:
				'***THIS IS NOT A PROP***\n' + 'Set subtitles for Column Headers',
		},
		hideTableHead: {
			control: 'boolean',
			defaultValue: false,
		},
		initialState: {
			control: { type: 'object' },
			defaultValue: {},
			description:
				'Set initial state for Table, this property rewrites `defaultSorting`, `defaultColumnVisibility`, `defaultColumnOrder`',
		},
		toolbarProps: {
			control: { type: 'object' },
			defaultValue: {},
			description: 'Set props for toolbar component',
		},
	},
}

export default meta
