import { useMemo } from 'react'

import {
	MultirowColumn,
	Table_Column,
	TableData,
} from '../../../../TableComponent'
import {
	ColumnsMenuItem,
	ColumnsMenuItemProps,
} from '../ColumnsMenu/ColumnsMenuItem'

import { MultirowColumnParent } from './multirowMenu.types'
import { MultiRowTreeItem, MultiRowTreeItemProps } from './MultiRowTreeItem'

export type MultiRowTreeProps<TData = TableData> = {
	multirowGroups: (MultirowColumnParent<TData> | MultirowColumn)[]
	multirowColumnsDisplayDepth: number
} & Omit<ColumnsMenuItemProps<TData>, 'column'> &
	Omit<MultiRowTreeItemProps<TData>, 'depth' | 'groups'>

const pullOutParents = (group: MultirowColumnParent) => {
	if (!group.parent) {
		return group
	}

	return [{ ...group, parent: group.parent.id }, pullOutParents(group.parent)]
}
const buildParentsTree = (
	items: MultirowColumnParent[],
	parent: string | null = null
) => {
	const result: MultirowColumnParent[] = []

	items.forEach((item) => {
		if (!item.text) {
			result.push(item)

			return
		}

		if (item.parent === parent) {
			result.push(item)
			item.children = buildParentsTree(
				items.filter((el) => el.text),
				item.id
			)

			if (!item.children.length) {
				delete item.children
			}
		}
	})

	return result
}
const makeParentsTree = (groups: MultirowColumnParent[]) => {
	const flattenGroups = groups
		.reduce((acc, curr) => {
			acc.push(pullOutParents(curr))

			return acc
		}, [] as MultirowColumnParent[])
		.flat(Infinity)
		.reduce((arr, el) => {
			if (!arr.find(({ id }) => el.id === id)) {
				arr.push(el)
			}

			return arr
		}, [] as MultirowColumnParent[])

	return buildParentsTree(flattenGroups)
}
export const MultiRowTree = (props: MultiRowTreeProps) => {
	const { multirowGroups, multirowColumnsDisplayDepth, ...rest } = props
	const parentsTree = useMemo(
		() => makeParentsTree(multirowGroups),
		[multirowGroups]
	)

	return (
		<>
			{parentsTree.map((group: MultirowColumnParent) => {
				if (!group.text && group.columns) {
					return group.columns.map((column: Table_Column) => (
						<ColumnsMenuItem key={column.id} column={column} {...rest} />
					))
				}

				return (
					<MultiRowTreeItem
						key={group.id}
						depth={1}
						multirowColumnsDisplayDepth={multirowColumnsDisplayDepth}
						groups={[group]}
						{...rest}
					/>
				)
			})}
		</>
	)
}
