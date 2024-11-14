import ModeIcon from '@mui/icons-material/Mode'
import MuiTableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import { Meta, Story } from '@storybook/react'
import {
	ColumnOrderState,
	SortingState,
	VisibilityState,
} from '@tanstack/react-table'
import React from 'react'
import { getColumnId, Table_DisplayColumnIdsArray } from '../../column.utils'
import TableComponent, {
	Table_ColumnDef,
	TableComponentProps,
} from '../../index'
import { TeamMember } from '../types/TeamMember'
import { getSeparatedTeamMembers } from '../utils/getTeamMembers'
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns'
import { getDefaultRowActionMenuItems } from '../utils/rowActionMenuItems'

const data = getSeparatedTeamMembers()
const columns = getTeamMembersColumns()

type TableConfigs = TableComponentProps<TeamMember> & {
	bulkActions?: object[]
	disableHidingFor?: string[]
	disableSortingFor?: string[]
	defaultSorting?: SortingState
	defaultColumnOrder?: ColumnOrderState
	defaultColumnVisibility?: VisibilityState
	defaultColumnFilterFns?: string[]
}

type SummaryRowTableExample = Omit<TableConfigs, 'data' | 'columns'>

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

const setColumnFilterFns = (filterFns: string[], columns: Table_ColumnDef<TeamMember>[]) => {
	columns.map((column) => {
		if (column.id  && filterFns.hasOwnProperty(column.id) && filterFns[column.id]) {
			column.filterFn = filterFns[column.id]
		}
		if (column.accessorKey  && filterFns.hasOwnProperty(column.accessorKey) && filterFns[column.accessorKey]) {
			column.filterFn = filterFns[column.accessorKey]
		}
		return column;
	})

	return columns
}

const getPropsHandledColumns = (columns: Table_ColumnDef<TeamMember>[], args: TableConfigs) => {
	const { disableSortingFor, disableHidingFor, defaultColumnFilterFns } = args
	return disableHidingForColumns(
		[(disableHidingFor ?? [])].flat(),
		disableSortingForColumns(
			[(disableSortingFor ?? [])].flat(),
			setColumnFilterFns(defaultColumnFilterFns ?? [], columns),
		),
	)
}

const SummaryRowExampleCellValue = (props) => {
    const { column } = props;

    const rows = column.getFacetedRowModel().rows;

    const getColumnValues = (columnId) => {
        return rows.reduce((result, row) => {
            if (!result.hasOwnProperty(row.original[columnId])) {
                return {
                    ...result,
                    [row.original[columnId]]: 1
                }
            }
            return {
                ...result,
                [row.original[columnId]]: result[row.original[columnId]] + 1
            }
        }, {})
    }

    if (Table_DisplayColumnIdsArray.includes(column.id)) {
        return <MuiTableCell sx={{ width: '20px' }}/>
    }

    if (column.id === 'teamMember') {
        return (
			<MuiTableCell>
				Team member
			</MuiTableCell>
		)
    }

    return (
		<MuiTableCell>
			<Tooltip
				arrow
				title={
					<>
						<ul>
							{
								Object.entries(getColumnValues(column.id)).map((el) => <li>
									{el[0]}: {el[1]}
								</li>)
							}
						</ul>
					</>
				}
			>
				<span>
					Column info
				</span>
			</Tooltip>
		</MuiTableCell>
    )
}

const SummaryRowTable: Story<TableConfigs> = (args) => {
	const { columns, defaultSorting, defaultColumnOrder, defaultColumnVisibility, ...rest } = args
	return (
		<TableComponent
			columns={getPropsHandledColumns(columns, args)}
			groupBorder={{ left: '12px solid white', top: '20px solid white' }}
			initialState={{ sorting: defaultSorting, columnOrder: defaultColumnOrder, columnVisibility: defaultColumnVisibility }}
			renderRowActionMenuItems={getDefaultRowActionMenuItems}
			enableRowVirtualization
			renderDetailPanel={() => <div>hello</div>}
			{...rest}
		/>
	)
}

export const SummaryRowDefault: Story<SummaryRowTableExample> = (args) => (
	<SummaryRowTable
		columns={columns}
		data={data}
        summaryRowCell={(props) => <SummaryRowExampleCellValue {...props} />}
		{...args}
	/>
);

const meta: Meta = {
	title: 'Data Examples/Summary Row',
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
			defaultValue: true
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
		enableSummaryRow: {
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
		defaultColumnFilterFns: {
			control: { type: 'object' },
			defaultValue: columns.map(getColumnId).reduce((acc, columnId) => ({
				...acc,
				[columnId]: undefined,
			}), {}),
			description: '***THIS IS NOT A PROP***\n' +
				'Set Default column filter function for Table. Rerender Table to apply value',
		}
	},
};

export default meta;
