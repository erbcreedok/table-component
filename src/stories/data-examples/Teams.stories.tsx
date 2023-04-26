import { Meta, Story } from '@storybook/react'
import ModeIcon from '@mui/icons-material/Mode';
import { ColumnOrderState, VisibilityState, SortingState } from '@tanstack/react-table'
import React, { useState } from 'react'
import { getColumnId } from '../../column.utils'
import TableComponent, { Table_ColumnDef, Table_Row, TableComponentProps } from '../../index'
import { TeamMember } from '../types/TeamMember'
import { getExpandingTeamMembers, getSeparatedTeamMembers, getTeamMembers } from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { getDefaultRowActionMenuItems } from '../utils/rowActionMenuItems'
import { sortByArrayOrder } from '../utils/sortByArrayOrder'

const groupsSorting = {
	impact: sortByArrayOrder(['Critical', 'High', 'Medium', 'Low']),
	performance: sortByArrayOrder(['Often exceeds', 'Sometimes exceeds', 'Meets']),
	riskOfLeaving: sortByArrayOrder(['Leaver', 'High', 'Medium', 'Low']),
}

const data = getSeparatedTeamMembers()
const dataTree = getExpandingTeamMembers(10)
const columns = getTeamMembersColumns()

type TeamsTableConfigs = TableComponentProps<TeamMember> & {
	bulkActions?: object[]
	disableHidingFor?: string[]
	disableSortingFor?: string[]
	defaultSorting?: SortingState
	defaultColumnOrder?: ColumnOrderState
	defaultColumnVisibility?: VisibilityState
}

type TeamsTableExample = Omit<TeamsTableConfigs, 'data' | 'columns'>

const disableSortingForColumns = (disableSortingFor: string[], columns: Table_ColumnDef<TeamMember>[]) => {
	return columns.map((column) => ({
		...column,
		enableSorting: !disableSortingFor.includes(getColumnId(column)),
	}))
}
const disableHidingForColumns = ( disableHidingFor: string[], columns: Table_ColumnDef<TeamMember>[]) => {
	return columns.map((column) => ({
		...column,
		enableHiding: !disableHidingFor.includes(getColumnId(column)),
	}))
}

const getPropsHandledColumns = (columns: Table_ColumnDef<TeamMember>[], args: TeamsTableConfigs) => {
	const { disableSortingFor, disableHidingFor } = args
	return disableHidingForColumns(
		[(disableHidingFor ?? [])].flat(),
		disableSortingForColumns(
			[(disableSortingFor ?? [])].flat(),
			columns,
		),
	)
}

const TeamsTable: Story<TeamsTableConfigs> = (args) => {
	const { columns, defaultSorting, defaultColumnOrder, defaultColumnVisibility, ...rest } = args
	return (
		<TableComponent
			columns={getPropsHandledColumns(columns, args)}
			groupsSorting={groupsSorting}
			groupBorder={{ left: '12px solid white', top: '20px solid white' }}
			initialState={{ sorting: defaultSorting, columnOrder: defaultColumnOrder, columnVisibility: defaultColumnVisibility }}
			renderRowActionMenuItems={getDefaultRowActionMenuItems}
			{...rest}
		/>
	)
}

export const TeamsTableDefault: Story<TeamsTableExample> = (args) => (
	<TeamsTable
		columns={columns}
		data={data}
		{...args}
	/>
);

export const TeamsTableSubtree: Story<TeamsTableExample> = (args) => (
	<TeamsTable
		columns={columns}
		data={dataTree}
		enableExpanding
		{...args}
	/>
);

export const TeamsTableRowOrdering: Story<TeamsTableExample> = (args) => {
	const [data, setData] = useState(() => getTeamMembers(100));
	const [draggingRow, setDraggingRow] = useState<Table_Row<TeamMember> | null>(null);
	const [hoveredRow, setHoveredRow] = useState<Table_Row<TeamMember> | null>(null);

	return (
		<TeamsTable
			columns={columns}
			data={data}
			enableRowOrdering
			autoResetPageIndex={false}
			muiTableBodyRowDragHandleProps={{
				onDragEnd: () => {
					if (hoveredRow && draggingRow) {
						data.splice(
							hoveredRow.index,
							0,
							data.splice(draggingRow.index, 1)[0],
						);
						setData([...data]);
					}
				},
			}}
			onDraggingRowChange={setDraggingRow}
			onHoveredRowChange={setHoveredRow}
			state={{
				draggingRow,
				hoveredRow,
			}}
			{...args}
		/>
	);
}


const meta: Meta = {
	title: 'Data Examples/Teams',
	argTypes: {
		bulkActions: {
			control: 'object',
			defaultValue: [{
				icon: <ModeIcon />,
				text: 'Console log',
				action: (props) => console.log('log', props)
			}],
		},
		enableRowSelection: {
			defaultValue: (row) => row.original.impact !== 'Medium'
			// defaultValue: (row) => true
		},
		uppercaseHeader: {
			control: 'boolean',
			defaultValue: true,
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
		enableSorting: {
			control: 'boolean',
			defaultValue: true,
		},
		enableMultiSort: {
			control: 'boolean',
			defaultValue: true,
		},
		enableRowActions: {
			control: 'boolean',
			defaultValue: false,
			description: 'Row actions column will not be visible, if column order state is provided',
		},
		enablePinning: {
			control: 'boolean',
			defaultValue: false,
			description: 'Pin columns to left or right side of the table',
		},
		disableHidingFor: {
			options: columns.map((column) => getColumnId(column)),
			control: {
				type: 'check',
				labels: columns.reduce((acc, column) => ({
					...acc,
					[getColumnId(column)]: column.header,
				}), {})
			},
			defaultValue: ['teamMember'],
			description: '***THIS IS NOT A PROP***\n' +
				'Disable hiding for specific columns',
		},
		disableSortingFor: {
			options: columns.map((column) => getColumnId(column)),
			control: {
				type: 'check',
				labels: columns.reduce((acc, column) => ({
					...acc,
					[getColumnId(column)]: column.header,
				}), {})
			},
			defaultValue: [],
			description: '***THIS IS NOT A PROP***\n' +
				'Disable sorting for specific columns',
		},
		defaultSorting: {
			options: columns.map((column) => [`${column.header} - ASC`, `${column.header} - DESC`]).flat(),
			mapping: columns.reduce((acc, column) => ({
				...acc,
				[`${column.header} - ASC`]: [{ id: getColumnId(column) }],
				[`${column.header} - DESC`]: [{ id: getColumnId(column), desc: true }],
			}), {}),
			control: { type: 'select' },
			description: '***THIS IS NOT A PROP***\n' +
				'Set Default sorting for Table. Rerender Table to apply value',
		},
		defaultColumnOrder: {
			control: { type: 'object' },
			defaultValue: columns.map(getColumnId),
			description: '***THIS IS NOT A PROP***\n' +
				'Set Default column order for Table. Rerender Table to apply value',
		},
		defaultColumnVisibility: {
			control: { type: 'object' },
			defaultValue: columns.map(getColumnId).reduce((acc, columnId) => ({
				...acc,
				[columnId]: true,
			}), {}),
			description: '***THIS IS NOT A PROP***\n' +
				'Set Default column visibility for Table. Rerender Table to apply value',
		},
	},
};

export default meta;
