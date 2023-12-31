import { Box } from '@mui/material'
import { Meta, Story } from '@storybook/react'
import ModeIcon from '@mui/icons-material/Mode'
import LinearProgress from '@mui/material/LinearProgress'
import MuiTableCell from '@mui/material/TableCell'
import {
	ColumnOrderState,
	VisibilityState,
	SortingState,
} from '@tanstack/react-table'
import React, { useCallback, useState } from 'react'
import { getColumnId } from '../../column.utils'
import { LocationRight } from '../../icons/LocationRight'
import { LockedIcon } from '../../icons/LockedIcon'
import { TrashIcon } from '../../icons/TrashIcon'
import TableComponent, {
	GetRowDragValuesChangeMessageProp,
	MuiTableBodyRowDragHandleFnProps,
	Table_ColumnDef,
	Table_Row,
	TableComponentProps,
	TableInstance,
	utilColumns,
} from '../../index'
import {
	CustomNoRecordsToDisplay,
	CustomNoResultsFound,
} from '../components/CustomNoResultsFound'
import { TeamMember, UnitTreeItem, User } from '../types/TeamMember'
import { getTablePresetProps } from '../utils/getTablePresetProps'
import { getDndTargetGroupingUpdateValues } from '../utils/getDndTargetGroupingUpdateValues'
import {
	getExpandingTeamMembers,
	getTeamMembers,
	getUnitTreeItems,
	isUnitTreeItem,
} from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { reorderMembersInUnits } from '../utils/reorderMembersInUnits'
import { getDefaultRowActionMenuItems } from '../utils/rowActionMenuItems'
import { ColumnActionsFiltersMenu } from './components/ColumnActionsFiltersMenu'
import { UnitRow } from './components/UnitRow'

const dataTree = getExpandingTeamMembers(5, '', 3)
const columns = getTeamMembersColumns()
const manyColumns: Table_ColumnDef<TeamMember>[] = [
	...columns,
	{
		header: 'Zip Code',
		accessorKey: 'zipCode',
		notDisplayed: true,
	},
	{
		header: 'City',
		accessorKey: 'city',
	},
	{
		header: 'State',
		accessorKey: 'state',
	},
	{
		header: 'Country',
		accessorKey: 'country',
		size: 200,
	},
	{
		header: 'Favorite Color',
		accessorKey: 'favoriteColor',
		Cell: ({ cell }) => (
			<>
				<Box
					sx={{ width: 10, height: 10, background: cell.getValue<string>() }}
				></Box>
				{cell.getValue()}
			</>
		),
	},
	{
		header: 'Favorite Quote',
		accessorKey: 'favoriteQuote',
	},
	{
		header: 'Pet Name',
		accessorKey: 'petName',
	},
	{
		header: 'Pet Type',
		accessorKey: 'petType',
	},
]
const multiHeader = [
	{
		depth: 1,
		pin: true,
		columns: [
			{
				text: 'WORKLOAD',
				columnIds: [
					'impact',
					'performance',
					'riskOfLeaving',
					'successionStatus',
					'location',
					'hiredAt',
				],
			},
		],
	},
	{
		depth: 2,
		pin: true,
		columns: [
			{
				text: 'WORKLOAD 1',
				shorthandText: 'WL1',
				columnIds: ['impact', 'performance'],
			},
			{
				text: 'WORKLOAD 2',
				columnIds: ['riskOfLeaving', 'successionStatus', 'location', 'hiredAt'],
			},
		],
	},
	{
		depth: 3,
		pin: true,
		columns: [
			{
				text: 'WORKLOAD 1_2',
				columnIds: ['impact', 'performance'],
			},
			{
				text: 'WORKLOAD 2_1',
				shorthandText: 'WL2.1',
				columnIds: ['riskOfLeaving', 'successionStatus'],
			},
			{
				text: 'WORKLOAD 2_2',
				columnIds: ['location', 'hiredAt'],
			},
		],
	},
]

type TeamsTableConfigs = Omit<TableComponentProps<TeamMember>, 'data'> &
	Partial<TableComponentProps<TeamMember>> & {
		bulkActions?: object[]
		disableHidingFor?: string[]
		disableSortingFor?: string[]
		defaultSorting?: SortingState
		defaultColumnOrder?: ColumnOrderState
		defaultColumnVisibility?: VisibilityState
		defaultColumnFilterFns?: string[]
		enableLoremIpsumColumn?: boolean
		columnSubtitles: Record<string, string>
		rowsCount: number
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

const getMultiHeaderByOption = (option: string) => {
	switch (option) {
		case 'pinned':
			return multiHeader
		case 'nonPinned':
			return multiHeader.map((el) => ({ ...el, pin: false }))
		case 'partialPinned':
			return multiHeader.map((el, i) => {
				if (i === multiHeader.length - 1) {
					return {
						...el,
						pin: false,
					}
				}

				return el
			})
		case 'withAdditionalRows':
			return multiHeader.map((el, i) => {
				if (i === 0) {
					return {
						...el,
						additionalRowContent: (table, cellsPropsArray) => {
							const colSpan = cellsPropsArray.reduce((colSpan, cellProps) => {
								return colSpan + cellProps.colSpan
							}, 0)

							return (
								<th colSpan={colSpan} style={{ backgroundColor: '#F5F6FA' }}>
									Additional Content
								</th>
							)
						},
					}
				}

				return el
			})
		default:
			return multiHeader
	}
}

const SummaryRowExampleCellValue = (props) => {
	const { column, table, defaultStyles } = props

	const rows = (table as TableInstance).getPaginationRowModel().rows

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

		const value = Math.round(100 - (100 * partialCount) / rows.length)
		return isNaN(value) ? 0 : value
	}

	if (column.id === utilColumns.column) {
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
					width: 'calc(100% - 12px)',
					mx: '6px',
					height: '12px',
					backgroundColor: '#FED7D7',
					'& > span': {
						backgroundColor: '#93E98C',
						transition: '300ms',
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
		rowsCount = 100,
		multirowHeader,
		...rest
	} = args
	const [data, setData] = useState(propsData || getTeamMembers(rowsCount))

	const setNewRow = (row, values) => {
		const newData = [...data]
		const newRow = newData[row.index]
		Object.entries(values).forEach(([key, value]) => {
			if (key === 'teamMember') {
				newRow.member = value as User
			} else if (key === 'completion') {
				newRow.completion =
					value !== null && value !== undefined ? Number(value) : value
			} else {
				newRow[key] = value
			}
		})
		newData[row.index] = newRow
		setData(newData)
	}

	const handleSaveRows = ({ exitEditingMode, rows, values }) => {
		if (Array.isArray(rows)) {
			rows.forEach((row) => {
				setNewRow(row, values)
			})
		} else {
			setNewRow(rows, values)
		}
		exitEditingMode()
	}

	const handleRowsDrop = ({ hoveredRow, draggingRows, grouping, table }) => {
		const newGroupingData = getDndTargetGroupingUpdateValues(
			hoveredRow?.row,
			grouping
		)

		const rowsToSave = draggingRows.map((row) => table.getRow(row.id))

		handleSaveRows({
			exitEditingMode: () => table.setEditingRow(null),
			rows: rowsToSave,
			values: newGroupingData ?? {},
		})
	}

	return (
		<TableComponent
			data={data}
			multirowHeader={multirowHeader}
			columns={getPropsHandledColumns(columns, args)}
			groupBorder={{ left: '6px solid white', top: '6px solid white' }}
			initialState={{
				sorting: defaultSorting ?? [],
				columnOrder: defaultColumnOrder,
				columnVisibility: defaultColumnVisibility,
				...initialState,
			}}
			onEditingRowsSave={handleSaveRows}
			onEditingCellSave={({ cell, value, error, exitEditingMode }) => {
				console.log(value, error, cell)
				if (error) return
				setNewRow(cell.row, { [cell.column.id]: value })
				exitEditingMode()
			}}
			handleRowsDrop={handleRowsDrop}
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
				const { grouping } = table.getState()
				if (grouping.length === 0) return true
				if (row?.original.impact === 'Medium') {
					return {
						text: 'Rows group cannot be changed to "Impact: Medium"',
						type: 'danger',
					}
				}

				return true
			}}
			onNativeEvent={(props) => console.log(props)}
			{...getTablePresetProps('teamsDefaultTable')}
			{...rest}
		/>
	)
}

export const TeamsTableDefault: Story<TeamsTableExample> = (args) => {
	return <TeamsTable columns={columns} {...args} />
}
export const TeamsTableWithManyColumns: Story<TeamsTableExample> = (args) => {
	return <TeamsTable columns={manyColumns} {...args} />
}

export const TeamsTableSubtree: Story<TeamsTableExample> = (args) => (
	<TeamsTable
		columns={columns}
		data={dataTree}
		groupBorder={{ left: '6px solid white', top: '6px solid white' }}
		{...args}
		enableExpanding
	/>
)

export const HierarchyGroupTableExample: Story = (args) => {
	const [data, setData] = useState(getUnitTreeItems(3, 10))
	const getRowDragValuesChangeMessage = useCallback<
		GetRowDragValuesChangeMessageProp<UnitTreeItem>
	>(({ current, hoveredRow, draggingRows }) => {
		if (!hoveredRow) return current
		const getIsSameUnit = (
			rowA: Table_Row<UnitTreeItem>,
			rowB: Table_Row<UnitTreeItem>
		) => rowA.original.getParent() === rowB.original.getParent()
		const isSameUnit = draggingRows.every((row) =>
			getIsSameUnit(row, hoveredRow.row)
		)

		if (!isSameUnit) {
			return [
				{
					label: 'Unit',
					value: hoveredRow.row.original.getParent()?.name ?? 'N/A',
				},
				...current,
			]
		}
		return current
	}, [])
	const muiTableBodyRowDragHandleProps = useCallback<
		MuiTableBodyRowDragHandleFnProps<UnitTreeItem>
	>(
		({ table }) => ({
			onDragEnd: () => {
				const { draggingRows, hoveredRow, grouping } = table.getState()
				if (
					hoveredRow?.row &&
					'original' in hoveredRow.row &&
					draggingRows.length > 0
				) {
					// Modify draggingRows original values to take values from the grouped columns of hoveredRow
					const targetValues = hoveredRow.row.original
					draggingRows.forEach((draggingRow) => {
						for (const columnId of grouping) {
							draggingRow.original[columnId] = targetValues[columnId]
						}
					})

					setData(
						reorderMembersInUnits(
							draggingRows.map((row) => row.original),
							hoveredRow.row.original,
							data,
							hoveredRow.position
						)
					)
				}
			},
		}),
		[]
	)

	return (
		<>
			<TableComponent
				columns={
					(args.enableColumnVirtualization
						? manyColumns
						: columns) as unknown as Table_ColumnDef<UnitTreeItem>[]
				}
				data={data}
				CustomRow={UnitRow}
				groupBorder={{ left: '6px solid white', top: '6px solid white' }}
				{...args}
				enableExpanding
				hideExpandColumn
				hideTableHead
				filterFromLeafRows
				getIsUnitTreeItem={isUnitTreeItem}
				{...getTablePresetProps('teamsDefaultTable')}
				muiTableBodyRowDragHandleProps={muiTableBodyRowDragHandleProps}
				getRowDragValuesChangeMessage={getRowDragValuesChangeMessage}
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
		enableBulkActionsSelect: {
			control: 'boolean',
		},
		enableRowSelection: {
			options: ['enabled', 'disabled', 'Except "Impact" is not "Medium"'],
			mapping: {
				enabled: true,
				disabled: false,
				'Except "Impact" is not "Medium"': (row) =>
					row.original.impact !== 'Medium',
			},
			control: { type: 'select' },
			defaultValue: 'Except "Impact" is not "Medium"',
		},
		uppercaseHeader: {
			control: 'boolean',
			defaultValue: true,
		},
		editingMode: {
			options: ['table', 'modal', 'row', 'cell'],
			control: { type: 'select' },
			defaultValue: 'row',
		},
		enableBottomToolbar: {
			control: 'boolean',
			defaultValue: false,
		},
		enableExpandAll: {
			control: 'boolean',
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
		enableColumnVirtualization: {
			control: 'boolean',
			defaultValue: false,
		},
		enableDragScrolling: {
			control: 'radio',
			defaultValue: 'enabled',
			options: ['enabled', 'disabled', 'horizontal', 'vertical'],
			mapping: {
				enabled: true,
				disabled: false,
				horizontal: 'horizontal',
				vertical: 'vertical',
			}
		},
		enableEditing: {
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
		expandPaddingSize: {
			control: 'number',
			description: 'Size of padding for each child',
		},
		enablePinning: {
			control: 'boolean',
			defaultValue: false,
			description: 'Pin columns to left or right side of the table',
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
		enableRowVirtualization: {
			control: 'boolean',
			defaultValue: false,
		},
		enableStickyHeader: {
			control: 'boolean',
			defaultValue: true,
		},
		enableStickyScrollbars: {
			control: 'object',
			description: 'Example: { "horizontal": true }',
		},
		enableSummaryRow: {
			control: 'boolean',
			defaultValue: false,
		},
		enableTableHead: {
			control: 'boolean',
			defaultValue: true,
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
				...manyColumns.map(getColumnId),
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
		hideSummaryRowInEmptyTable: {
			control: 'boolean',
			defaultValue: false,
		},
		initialState: {
			control: { type: 'object' },
			defaultValue: {},
			description:
				'Set initial state for Table, this property rewrites `defaultSorting`, `defaultColumnVisibility`, `defaultColumnOrder`',
		},
		localization: {
			control: { type: 'object' },
			description: 'Redefine default translation phrases.',
		},
		multirowHeader: {
			control: { type: 'select' },
			defaultValue: 'Not enabled',
			options: [
				'Not enabled',
				'Workload Values Pinned',
				'Workload Values Non-pinned',
				'Workload Values Partially pinned',
				'Workload Values with additional row',
			],
			mapping: {
				'Not enabled': undefined,
				'Workload Values Pinned': getMultiHeaderByOption('pinned'),
				'Workload Values Non-pinned': getMultiHeaderByOption('nonPinned'),
				'Workload Values Partially pinned':
					getMultiHeaderByOption('partialPinned'),
				'Workload Values with additional row':
					getMultiHeaderByOption('withAdditionalRows'),
			},
		},
		multirowColumnsDisplayDepth: {
			control: { type: 'select' },
			defaultValue: '1',
			options: ['1', '2', '3'],
			mapping: {
				'1': 1,
				'2': 2,
				'3': 3,
			},
		},
		noRecordsToDisplaySlot: {
			options: ['Not provided', 'Custom component'],
			mapping: {
				'Not provided': undefined,
				'Custom component': <CustomNoRecordsToDisplay />,
			},
			control: { type: 'select' },
		},
		noResultsFoundSlot: {
			options: ['Not provided', 'Custom component'],
			mapping: {
				'Not provided': undefined,
				'Custom component': <CustomNoResultsFound />,
			},
			control: { type: 'select' },
		},
		cellGroupedPlaceholderText: {
			control: { type: 'text' },
			description: 'Set placeholder text for grouped cell with no data',
			defaultValue: 'N/A',
		},
		cellPlaceholderText: {
			control: { type: 'text' },
			description: 'Set placeholder text for cell with no data',
		},
		rowsCount: {
			control: { type: 'number' },
			defaultValue: 100,
			description:
				'***THIS IS NOT A PROP***\n' +
				'Set row count for Table default, does not work with Subtree and Hierarchy Group Tables. Refresh table to after setting new value',
		},
		suggestedColumns: {
			options: columns.map((column) => getColumnId(column)),
			control: { type: 'object' },
			description: `Example: { "filtering": null, "grouping": null, "sorting": ["${columns
				.map((col) => getColumnId(col))
				.join('", "')}"] }`,
		},
		toolbarProps: {
			control: { type: 'object' },
			defaultValue: {},
			description: 'Set props for toolbar component',
		},
		organizeGroupingMenu: {
			control: { type: 'array' },
			description: `Example: ["${columns
				.map((col) => getColumnId(col))
				.join('", "')}"]`,
		},
		organizeSortingMenu: {
			control: { type: 'array' },
			description: `Example: ["${columns
				.map((col) => getColumnId(col))
				.join('", "')}"]`,
		},
		organizeFilteringMenu: {
			control: { type: 'array' },
			description: `Example: ["${columns
				.map((col) => getColumnId(col))
				.join('", "')}"]`,
		},
		e2eLabels: {
			control: { type: 'object' },
			description: `manage data-testid attributes`,
		},
	},
}

export default meta
