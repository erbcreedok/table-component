import { useMemo } from 'react'

import {
	ColumnsMenuItem,
	ColumnsMenuItemProps,
} from '../ColumnsMenu/ColumnsMenuItem'
import {
	MultirowColumn,
	Table_Column,
	TableData,
} from '../../../../TableComponent'

import { MultirowColumnParent } from './multirowMenu.types'
import { MultiRowTreeItem, MultiRowTreeItemProps } from './MultiRowTreeItem'

export type MultiRowTreeProps<TData extends TableData = TableData> = {
	multirowGroups: (MultirowColumnParent<TData> | MultirowColumn)[]
} & Omit<ColumnsMenuItemProps<TData>, 'column'> &
	Omit<MultiRowTreeItemProps<TData>, 'depth' | 'groups'>

const pullOutParents = <TData extends TableData = TableData>(
	group: MultirowColumnParent<TData>
) => {
	if (!group.parent) {
		return group
	}

	return [{ ...group, parent: group.parent.id }, pullOutParents(group.parent)]
}
const buildParentsTree = <TData extends TableData = TableData>(
	items: MultirowColumnParent<TData>[],
	parent: string | null = null
) => {
	const result: MultirowColumnParent<TData>[] = []

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
const makeParentsTree = <TData extends TableData = TableData>(
	groups: MultirowColumnParent<TData>[]
) => {
	const flattenGroups = groups
		.reduce((acc, curr) => {
			acc.push(pullOutParents(curr))

			return acc
		}, [] as MultirowColumnParent<TData>[])
		.flat(Infinity)
		.reduce((arr, el) => {
			if (!arr.find(({ id }) => el.id === id)) {
				arr.push(el)
			}

			return arr
		}, [] as MultirowColumnParent<TData>[])

	return buildParentsTree(flattenGroups)
}
export const MultiRowTree = <TData extends TableData = TableData>(
	props: MultiRowTreeProps<TData>
) => {
	const { multirowGroups, ...rest } = props
	const parentsTree = useMemo(
		() => makeParentsTree<TData>(multirowGroups),
		[multirowGroups]
	)

	return (
		<>
			{parentsTree.map((group: MultirowColumnParent<TData>) => {
				if (!group.text && group.columns) {
					return group.columns.map((column: Table_Column<TData>) => (
						<ColumnsMenuItem key={column.id} column={column} {...rest} />
					))
				}

				return (
					<MultiRowTreeItem
						key={group.id}
						depth={1}
						groups={[group]}
						{...rest}
					/>
				)
			})}
		</>
	)
}
