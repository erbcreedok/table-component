import { FC, useCallback, useRef, MouseEvent } from 'react'
import { MenuList, Popper, capitalize } from '@mui/material'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import MenuItem from '@mui/material/MenuItem'
import zIndex from '@mui/material/styles/zIndex'

import { MenuPaper } from '../components/Menu'
import { useHoverEffects } from '../hooks/useHoverEffects'
import {
	Table_Column,
	TableData,
	SetColumns,
	Table_ColumnDef,
} from '../TableComponent'
import { useTableContext } from '../context/useTableContext'
import { ExpandMoreMenuChevron } from '../components/ExpandMoreMenuChevron'
import { withNativeEvent } from '../utils/withNativeEvent'
import { getPascalCase } from '../utils/getPascalCase'
import { getTestAttributes } from '../utils/getTestAttributes'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

const customColumnPrefix = 'customColumn'

type CustomDefault = Partial<Table_ColumnDef<TableData>>

const customDefaultText: CustomDefault = {
	dataType: 'textual',
	editVariant: 'text',
}
const customDefaultTextJson = JSON.stringify(customDefaultText)

const customDefaultNumber: CustomDefault = {
	dataType: 'numeric',
	editVariant: 'number',
	decimalPlaces: 2,
	displayFormat: 'SPACE_1000',
}
const customDefaultNumberJson = JSON.stringify(customDefaultNumber)

const customDefaultPercent: CustomDefault = {
	dataType: 'percent',
	editVariant: 'percent',
	decimalPlaces: 2,
	minValue: 0,
}
const customDefaultPercentJson = JSON.stringify(customDefaultPercent)

type Props<TData extends TableData = TableData> = {
	column: Table_Column
	setColumns: SetColumns<TData>
	insertPosition: 'left' | 'right'
	setVisible: (visible: boolean) => void
}

export const CustomColumnInsertMenu: FC<Props> = ({
	column,
	setColumns,
	insertPosition,
	setVisible,
}) => {
	const anchorRef = useRef(null)
	const { hovered, hoverProps } = useHoverEffects(50)

	const {
		table,
		config: { originalColumns },
	} = useTableContext()

	const {
		options: {
			icons: {
				InsertColumnLeftIcon,
				InsertColumnRightIcon,
				TextTypeIcon,
				NumericTypeIcon,
				PercentTypeIcon,
			},
			localization,
			e2eLabels,
			onNativeEvent,
		},
		setColumnOrder,
	} = table

	const handleInsertColumn = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			let columnNumber =
				Math.max.apply(
					null,
					originalColumns
						.filter((c) => c.enableCustomization !== undefined)
						.map((c) =>
							Number(c.accessorKey?.split(customColumnPrefix)[1] ?? 0)
						)
				) + 1

			if (columnNumber < 1) columnNumber = 1

			const accessorKey = `${customColumnPrefix}${columnNumber}`
			const { dataType, ...config } = JSON.parse(
				event.currentTarget.dataset.json!
			)
			const newColumn: Table_ColumnDef<TableData> = {
				header: `Column ${columnNumber}`,
				accessorKey,
				enableCustomization: true,
				dataType,
				...config,
			}

			const rightShift = insertPosition === 'right' ? 1 : 0
			const index =
				originalColumns.findIndex((c) => c.accessorKey === column.id) +
				rightShift
			const nextColumns = [...originalColumns]

			nextColumns.splice(index, 0, newColumn)

			setColumns(nextColumns, newColumn, 'INSERT')
			setColumnOrder((prev) => {
				const insertAt = prev.findIndex((id) => id === column.id) + rightShift
				const next = [...prev]

				next.splice(insertAt, 0, accessorKey)

				return next
			})
			setVisible(false)
			table.setCustomColumnEditor(accessorKey)

			onNativeEvent?.({
				el: `ColumnHeaderMenu_${getPascalCase(
					column.columnDef.header
				)}_Insert${capitalize(dataType)}Button`,
				type: 'click',
				event,
			})
		},
		[
			originalColumns,
			insertPosition,
			setColumns,
			setColumnOrder,
			setVisible,
			table,
			onNativeEvent,
			column.columnDef.header,
			column.id,
		]
	)

	return (
		<>
			<MenuItem
				ref={anchorRef}
				sx={commonMenuItemStyles}
				{...hoverProps}
				onMouseEnter={withNativeEvent(
					{
						el: `ColumnHeaderMenu_${getPascalCase(
							column.columnDef.header
						)}_Insert${capitalize(insertPosition)}Button`,
						type: 'hover',
					},
					table
				)(hoverProps.onMouseEnter)}
				{...getTestAttributes(
					e2eLabels,
					`columnMenuInsert${capitalize(insertPosition) as 'Left' | 'Right'}`
				)}
			>
				<Box sx={commonListItemStyles}>
					<ListItemIcon>
						{insertPosition === 'left' ? (
							<InsertColumnLeftIcon />
						) : (
							<InsertColumnRightIcon />
						)}
					</ListItemIcon>
					{insertPosition === 'left'
						? localization.InsertColumnLeft
						: localization.InsertColumnRight}
					<ExpandMoreMenuChevron />
				</Box>
			</MenuItem>

			<Popper
				open={hovered}
				placement="right-start"
				anchorEl={anchorRef?.current}
				sx={{ zIndex: zIndex.tooltip, width: 260 }}
			>
				<MenuPaper sx={{ mx: '6px' }} {...hoverProps}>
					<MenuList>
						{/* Textrual */}
						<MenuItem
							data-json={customDefaultTextJson}
							onClick={handleInsertColumn}
							{...getTestAttributes(e2eLabels, `columnMenuInsertText`)}
							sx={commonMenuItemStyles}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<TextTypeIcon />
								</ListItemIcon>
								{localization.text}
							</Box>
						</MenuItem>

						{/* Numeric */}
						<MenuItem
							data-json={customDefaultNumberJson}
							onClick={handleInsertColumn}
							{...getTestAttributes(e2eLabels, `columnMenuInsertNumeric`)}
							sx={commonMenuItemStyles}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<NumericTypeIcon />
								</ListItemIcon>
								{localization.numeric}
							</Box>
						</MenuItem>

						{/* Percent */}
						<MenuItem
							data-json={customDefaultPercentJson}
							onClick={handleInsertColumn}
							{...getTestAttributes(e2eLabels, `columnMenuInsertNumeric`)}
							sx={commonMenuItemStyles}
						>
							<Box sx={commonListItemStyles}>
								<ListItemIcon>
									<PercentTypeIcon />
								</ListItemIcon>
								{localization.percent}
							</Box>
						</MenuItem>
					</MenuList>
				</MenuPaper>
			</Popper>
		</>
	)
}
