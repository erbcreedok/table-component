import { FC, useCallback, useRef } from 'react'
import { MenuList, Popper } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import zIndex from '@mui/material/styles/zIndex'

import { MenuPaper } from '../components/Menu'
import { useHoverEffects } from '../hooks/useHoverEffects'
import { Table_Column, TableData, SetColumns } from '../TableComponent'
import { useTableContext } from '../context/useTableContext'
import { ExpandMoreMenuChevron } from '../components/ExpandMoreMenuChevron'
import { withNativeEvent } from '../utils/withNativeEvent'
import { getPascalCase } from '../utils/getPascalCase'
import { getTestAttributes } from '../utils/getTestAttributes'

import { commonListItemStyles, commonMenuItemStyles } from './constants'
import { CustomColumnInsertMenu } from './CustomColumnInsertMenu'

type Props<TData extends TableData = TableData> = {
	column: Table_Column
	setVisible: (visible: boolean) => void
	openCustomizer: () => void
	setColumns: SetColumns<TData>
}

export const CustomColumnMenuItems: FC<Props> = ({
	column,
	setVisible,
	openCustomizer,
	setColumns,
}) => {
	const anchorRef = useRef(null)
	const { hovered, hoverProps } = useHoverEffects(300)

	const {
		table,
		config: { originalColumns },
	} = useTableContext()
	const {
		options: {
			icons: { InsertColumnLeftIcon, PencilIcon, DeleteIcon },
			localization,
			e2eLabels,
		},
		setColumnOrder,
	} = table

	const handleDeleteColumn = useCallback(() => {
		const index = originalColumns.findIndex((c) => c.accessorKey === column.id)
		const deletedColumn = originalColumns[index]
		const nextColumns = [...originalColumns]

		nextColumns.splice(index, 1)
		setColumns(nextColumns, deletedColumn, 'DELETE')
		setColumnOrder((o) => o.filter((id) => id !== column.id))
		setVisible(false)
	}, [column.id, originalColumns, setColumnOrder, setColumns, setVisible])

	return (
		<>
			{/* Insert - menu item */}
			<MenuItem
				ref={anchorRef}
				sx={(theme) => ({
					...commonMenuItemStyles,
					background: hovered ? theme.palette.action.hover : undefined,
				})}
				{...hoverProps}
				onMouseEnter={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_InsertButton`,
						type: 'hover',
					},
					table
				)(hoverProps.onMouseEnter)}
				{...getTestAttributes(e2eLabels, 'columnMenuInsert')}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>
						<InsertColumnLeftIcon />
					</ListItemIcon>
					{localization.insert}
					<ExpandMoreMenuChevron />
				</Box>
			</MenuItem>

			{/* Insert: Left, Right - menu items */}
			<Popper
				open={hovered}
				placement="right-start"
				anchorEl={anchorRef?.current}
				sx={{ zIndex: zIndex.tooltip, width: 260 }}
			>
				<MenuPaper sx={{ mx: '6px' }} {...hoverProps}>
					<MenuList>
						<CustomColumnInsertMenu
							column={column}
							setColumns={setColumns}
							insertPosition="left"
							setVisible={setVisible}
						/>
						<CustomColumnInsertMenu
							column={column}
							setColumns={setColumns}
							insertPosition="right"
							setVisible={setVisible}
						/>
					</MenuList>
				</MenuPaper>
			</Popper>

			{/* Edit, Delete - menu items */}
			{column.columnDef.enableCustomization && (
				<>
					<MenuItem
						sx={{ ...commonMenuItemStyles }}
						onClick={withNativeEvent(
							{
								el: `ColumnHeaderMenu_${getPascalCase(
									column.columnDef.header
								)}_EditButton`,
								type: 'click',
							},
							table
						)(() => {
							openCustomizer()
							setVisible(false)
						})}
						{...getTestAttributes(e2eLabels, 'columnMenuEdit')}
					>
						<Box sx={commonListItemStyles}>
							<ListItemIcon>
								<PencilIcon />
							</ListItemIcon>
							{localization.editSettings}
						</Box>
					</MenuItem>
					<MenuItem
						sx={{ ...commonMenuItemStyles }}
						onClick={withNativeEvent(
							{
								el: `ColumnHeaderMenu_${getPascalCase(
									column.columnDef.header
								)}_DeleteButton`,
								type: 'click',
							},
							table
						)(handleDeleteColumn)}
						{...getTestAttributes(e2eLabels, 'columnMenuDelete')}
					>
						<Box sx={{ ...commonListItemStyles, color: '#FA4B4B' }}>
							<ListItemIcon>
								<DeleteIcon fill="#FA4B4B" />
							</ListItemIcon>
							{localization.delete}
						</Box>
					</MenuItem>
				</>
			)}
		</>
	)
}
