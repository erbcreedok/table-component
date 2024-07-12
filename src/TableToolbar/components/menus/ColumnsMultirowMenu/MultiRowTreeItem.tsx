import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { Fragment } from 'react'

import { Colors, TextColor } from '../../../../components/styles'
import { TableData } from '../../../../TableComponent'

import {
	ColumnsMultirowMenuGroupItem,
	ColumnsMultirowMenuGroupItemProps,
} from './ColumnsMultirowMenuGroupItem'
import { MultirowColumnParent } from './multirowMenu.types'

export type MultiRowTreeItemProps<TData extends TableData = TableData> = Omit<
	ColumnsMultirowMenuGroupItemProps<TData>,
	'group'
> & {
	groups: MultirowColumnParent<TData>[]
	depth?: number
	multirowColumnsDisplayDepth: number
}
export const MultiRowTreeItem = <TData extends TableData = TableData>({
	groups,
	depth = 1,
	multirowColumnsDisplayDepth,
	...rest
}: MultiRowTreeItemProps<TData>) => {
	const getNestedChildrenCount = (prevGroup, depth) => {
		let childrenCount = 0
		if (prevGroup.children && prevGroup.children.length) {
			childrenCount += prevGroup.children.length

			if (depth < multirowColumnsDisplayDepth) {
				const childrenCountIncrement = prevGroup.children.reduce(
					(acc, curr) => acc + getNestedChildrenCount(curr, depth + 1),
					0
				)
				childrenCount += childrenCountIncrement
			}
		}

		return childrenCount
	}

	return (
		<>
			{groups.map((group, index) => {
				if (group.children && group.children.length) {
					return [
						<MenuItem
							disableRipple
							sx={{
								p: 0,
								m: 0,
								cursor: 'default',
								'&:hover': {
									backgroundColor: 'unset',
								},
							}}
							key={`${group.id}-menu-item`}
						>
							{group.text && (
								<Typography
									key={group.text}
									sx={{
										maxWidth: '300px',
										padding: `6px ${depth * 24}px`,
										color: TextColor.Primary,
										fontSize: '14px',
										fontWeight: 400,
									}}
								>
									{group.text}
								</Typography>
							)}
							{/* vertical gray line and angle */}
							{depth > 1 && (
								<Box
									sx={{
										position: 'absolute',
										width: '16px',
										// position depends on previous group children
										height:
											index > 0
												? `${
														47 +
														getNestedChildrenCount(groups[index - 1], depth) *
															29
												  }px`
												: '22px',
										left: `${(depth - 1) * 24 + 2}px`,
										top:
											// position depends on previous group children
											index > 0
												? `-${
														31 +
														getNestedChildrenCount(groups[index - 1], depth) *
															29
												  }px`
												: '-6px',
										borderLeft: `1px solid ${Colors.Gray}`,
										borderBottom: `1px solid ${Colors.Gray}`,
										borderBottomLeftRadius: '3px',
									}}
								/>
							)}
						</MenuItem>,
						group.children && (
							<MultiRowTreeItem
								groups={group.children}
								depth={depth + 1}
								multirowColumnsDisplayDepth={multirowColumnsDisplayDepth}
								key={`${group.id}-multirow-tree-item`}
								{...rest}
							/>
						),
					]
				}

				return (
					<Fragment key={group.id}>
						{group.columns && (
							<ColumnsMultirowMenuGroupItem
								depth={depth}
								parent={group.parent}
								{...rest}
								group={group}
								drawVerticalLine
								itemIndex={index}
								drawAngle={depth > 1 && index + 1 === groups.length}
							/>
						)}
					</Fragment>
				)
			})}
		</>
	)
}
