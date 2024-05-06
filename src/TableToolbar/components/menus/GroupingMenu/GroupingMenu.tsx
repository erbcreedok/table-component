import { Divider, IconButton, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { useCallback, useMemo, useState } from 'react'

import { getColumnId, reorderColumn } from '../../../../column.utils'
import {
	ButtonLink,
	ListTitle,
	SidebarPropsWithOnCloseEnd,
	SidebarWithMuiProps,
	SidebarSearch,
	Table_Column,
	TableData,
	TableInstance,
} from '../../../../'
import { DeleteIcon } from '../../../../icons/DeleteIcon'
import { createComponentWithMuiProps } from '../../../../utils/createComponentWithMuiProps'
import { getE2EAttributes } from '../../../../utils/getE2EAttributes'
import { getOrderedColumns } from '../../../../utils/getOrderedColumns'
import { getSuggestedColumns } from '../../../../utils/getSuggestedColumns'
import { getTestAttributes } from '../../../../utils/getTestAttributes'
import { getValueOrFunctionHandler } from '../../../../utils/getValueOrFunctionHandler'
import { mergeMuiProps } from '../../../../utils/mergeMuiProps'
import { resetGroupingWithMultirow } from '../../../../utils/resetGroupingWithMultirow'
import { sortByStringArray } from '../../../../utils/sortByStringArray'
import { splitArrayItems } from '../../../../utils/splitArrayItems'
import {
	SimpleMenuItem,
	SimpleMenuItemProps,
} from '../components/SimpleMenuItem'

export interface GroupingMenuProps<TData extends Record<string, any> = {}> {
	anchorEl: HTMLElement | null
	isSubMenu?: boolean
	setAnchorEl(anchorEl: HTMLElement | null): void
	table: TableInstance<TData>
	sidebarProps?: SidebarPropsWithOnCloseEnd
}

export const defaultOrganizeGroupingMenu = <TData extends TableData = {}>(
	allColumns: readonly Table_Column<TData>[]
) => allColumns.filter((col) => col.getIsVisible() && col.getCanGroup())

export const GroupingMenu = <TData extends Record<string, any> = {}>({
	anchorEl,
	setAnchorEl,
	table,
	sidebarProps,
}: GroupingMenuProps<TData>) => {
	const {
		getState,
		getAllColumns,
		setGrouping,
		options: {
			innerTable,
			localization,
			suggestedColumns,
			organizeGroupingMenu,
		},
	} = table
	const [searchValue, setSearchValue] = useState('')
	const [hoveredColumn, setHoveredColumn] =
		useState<Table_Column<TData> | null>(null)

	const { grouping } = getState() // this updates memo below
	const { groupedColumns, ungroupedColumns, areSuggestedShown } =
		useMemo(() => {
			const allColumns = getOrderedColumns(
				getAllColumns(),
				defaultOrganizeGroupingMenu,
				organizeGroupingMenu
			)

			const [groupedColumns, ungroupedColumns] = splitArrayItems(
				allColumns,
				(col) => grouping.includes(getColumnId(col))
			)

			let result: Table_Column<TData>[]
			let areSuggestedShown = false

			if (searchValue)
				result = ungroupedColumns.filter((col) =>
					col.columnDef.header.toLowerCase().includes(searchValue)
				)
			else
				[result, areSuggestedShown] = getSuggestedColumns(
					ungroupedColumns,
					suggestedColumns?.grouping
				)

			return {
				groupedColumns: sortByStringArray(
					groupedColumns,
					grouping,
					getColumnId
				),
				ungroupedColumns: result,
				areSuggestedShown,
			}
		}, [
			grouping,
			getAllColumns,
			organizeGroupingMenu,
			searchValue,
			suggestedColumns?.grouping,
		])

	const onCloseEnd = sidebarProps?.onCloseEnd
	const handleCloseClick = useCallback(() => {
		setAnchorEl(null)
		onCloseEnd?.()
	}, [setAnchorEl, onCloseEnd])

	const removeAllGroup = () => {
		resetGroupingWithMultirow(table)
	}

	const onColumnOrderChanged = (
		column: Table_Column<TData>,
		hovered: Table_Column<TData>
	) => {
		setGrouping((old) => reorderColumn(column, hovered, old))
	}

	return (
		<SidebarWithMuiProps
			table={table as TableInstance}
			open={!!anchorEl}
			onClose={handleCloseClick}
			withHeader
			headerTitle={localization.group}
			topPanel={
				<>
					<SidebarSearch value={searchValue} onValueChange={setSearchValue} />
					<Divider />
				</>
			}
			innerTableSidebar={innerTable}
			{...sidebarProps}
			PaperProps={mergeMuiProps(
				{
					sx: { minWidth: 500 },
				},
				getTestAttributes(table.options.e2eLabels, 'sidebarGrouping'),
				sidebarProps?.PaperProps
			)}
		>
			<Box sx={{ marginTop: '12px' }}>
				{searchValue ? (
					ungroupedColumns.length > 0 ? (
						ungroupedColumns.map((column) => (
							<MenuItem
								column={column}
								key={column.id}
								hoveredColumn={hoveredColumn}
								onColumnOrderChange={onColumnOrderChanged}
								setHoveredColumn={setHoveredColumn}
								onClick={(e) => {
									setSearchValue('')
									column.toggleGrouping()
									e.stopPropagation()
								}}
							/>
						))
					) : (
						<Typography
							sx={{ display: 'flex', justifyContent: 'center', mt: '20px' }}
						>
							No options
						</Typography>
					)
				) : (
					<>
						{groupedColumns.length > 0 && (
							<>
								<Box
									sx={{
										padding: '0 24px',
										margin: '20px 0 20px 0',
										display: 'flex',
										justifyContent: 'space-between',
										alignItems: 'center',
									}}
								>
									<ListTitle>Grouped</ListTitle>
									<ButtonLink
										onClick={removeAllGroup}
										{...getTestAttributes(
											table.options.e2eLabels,
											'sidebarGroupingRemoveAll'
										)}
									>
										Remove all
									</ButtonLink>
								</Box>

								{groupedColumns.map((column) => (
									<MenuItem
										column={column}
										key={column.id}
										enableDrag={groupedColumns.length > 1}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										isCompact
										disableRipple
									/>
								))}
							</>
						)}

						{ungroupedColumns.length > 0 && (
							<>
								{(groupedColumns.length > 0 || areSuggestedShown) && (
									<ListTitle sx={{ padding: '0 24px', margin: '20px 0 ' }}>
										{areSuggestedShown
											? localization.suggested
											: localization.columns}
									</ListTitle>
								)}

								{ungroupedColumns.map((column) => (
									<MenuItem
										column={column}
										key={column.id}
										hoveredColumn={hoveredColumn}
										onColumnOrderChange={onColumnOrderChanged}
										setHoveredColumn={setHoveredColumn}
										onClick={(e) => {
											column.toggleGrouping()
											e.stopPropagation()
										}}
									/>
								))}
							</>
						)}
					</>
				)}
			</Box>
		</SidebarWithMuiProps>
	)
}

const MenuItem = <TData extends Record<string, any> = {}>({
	column,
	isCompact,
	onClick,
	...rest
}: SimpleMenuItemProps<TData>) => {
	return (
		<SimpleMenuItem
			column={column}
			key={column.id}
			isCompact={isCompact}
			onClick={onClick}
			{...getE2EAttributes(
				'sidebarGroupingMenuItem',
				`sidebarGroupingMenuItem_${column.id}`
			)}
			{...rest}
		>
			{isCompact ? (
				<IconButton
					disableRipple
					onClick={column.toggleGrouping}
					size="small"
					{...getE2EAttributes(
						'sidebarGroupingRemoveItem',
						`sidebarGroupingRemoveItem_${column.id}`
					)}
				>
					<DeleteIcon />
				</IconButton>
			) : (
				<ButtonLink
					onClick={onClick}
					style={{ fontWeight: 600 }}
					{...getE2EAttributes(
						'sidebarGroupingAddItem',
						`sidebarGroupingAddItem_${column.id}`
					)}
				>
					Add Item +
				</ButtonLink>
			)}
		</SimpleMenuItem>
	)
}

export const GroupingMenuWithMuiProps = createComponentWithMuiProps(
	GroupingMenu,
	({ table }) =>
		getValueOrFunctionHandler(table.options.muiGroupingMenuProps)({
			table,
		})
)
