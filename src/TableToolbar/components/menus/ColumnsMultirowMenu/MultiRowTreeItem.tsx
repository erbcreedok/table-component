import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React from 'react'

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
}
export const MultiRowTreeItem = <TData extends TableData = TableData>({
	groups,
	depth = 1,
	...rest
}: MultiRowTreeItemProps<TData>) => {
	return (
		<>
			{groups.map((group, index) => {
				if (group.children && group.children.length) {
					return (
						<Box key={group.id} sx={{ position: 'relative' }}>
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
														47 + (groups[index - 1].children?.length || 0) * 25
												  }px`
												: '22px',
										left: `${(depth - 1) * 24 + 2}px`,
										top:
											// position depends on previous group children
											index > 0
												? `-${
														31 + (groups[index - 1].children?.length || 0) * 25
												  }px`
												: '-6px',
										borderLeft: `1px solid ${Colors.Gray}`,
										borderBottom: `1px solid ${Colors.Gray}`,
										borderBottomLeftRadius: '3px',
									}}
								/>
							)}
							{group.children && (
								<MultiRowTreeItem
									groups={group.children}
									depth={depth + 1}
									{...rest}
								/>
							)}
						</Box>
					)
				}

				return (
					<Box key={group.id} sx={{ position: 'relative' }}>
						{/* vertical gray line */}
						<Box
							sx={{
								position: 'absolute',
								width: '1px',
								height: index > 0 ? '38px' : '24px',
								left: `${(depth - 1) * 24 + 2}px`,
								bottom: '18px',
								borderLeft: `1px solid ${Colors.Gray}`,
							}}
						/>
						{group.columns && (
							<ColumnsMultirowMenuGroupItem
								depth={depth}
								parent={group.parent}
								{...rest}
								group={group}
								drawAngle={depth > 1 && index + 1 === groups.length}
							/>
						)}
					</Box>
				)
			})}
		</>
	)
}
