import { ReactElement, useState } from 'react'

import { Table_Column } from 'src'

import { reorderColumn } from '../../../column.utils'
import { useGroupingControls } from '../../filter-bar-hooks/useGroupingControls'
import { NoOptions } from '../../../components/NoOptions'

import { ListGroupItem } from './ListGroupItem'

interface SelectedGroupsListProps {
	table: any
}

export const SelectedGroupsList = (
	props: SelectedGroupsListProps
): ReactElement => {
	const { table } = props
	const {
		setGrouping,
		options: { muiTableBodyRowDragHandleProps },
	} = table

	const [hoveredColumn, setHoveredColumn] = useState<any>(null)

	const { groupedList } = useGroupingControls(table)

	const onColumnOrderChanged = (
		column: Table_Column<any>,
		hovered: Table_Column<any>
	) => {
		setGrouping((old) => reorderColumn(column, hovered, old))
	}

	if (!groupedList?.length) {
		return <NoOptions />
	}

	return (
		<div>
			{groupedList.map((item) => {
				return (
					<ListGroupItem
						key={item.id}
						title={item?.columnDef?.header}
						columnDef={item.columnDef}
						column={item}
						table={table}
						iconButtonProps={muiTableBodyRowDragHandleProps}
						hoveredColumn={hoveredColumn}
						setHoveredColumn={setHoveredColumn}
						onColumnOrderChanged={onColumnOrderChanged}
					/>
				)
			})}
		</div>
	)
}
