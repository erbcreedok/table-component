import { FormGroup } from '@mui/material'
import FormControlLabel from '@mui/material/FormControlLabel'
import React, { FC, MouseEvent, ReactNode } from 'react'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import Tooltip from '@mui/material/Tooltip'
import Radio from '@mui/material/Radio'
import type { Theme } from '@mui/material/styles'

import type { Table_Row, TableInstance } from '..'

interface Props {
	row?: Table_Row
	selectAll?: boolean
	table: TableInstance
	parentRow?: Table_Row
	label?: ReactNode | ((props: CheckboxProps) => ReactNode)
}

export const SelectCheckbox: FC<Props> = ({
	row,
	selectAll,
	table,
	parentRow,
	label,
}) => {
	const {
		getState,
		options: {
			localization,
			enableMultiRowSelection,
			muiSelectCheckboxProps,
			muiSelectAllCheckboxProps,
			selectAllMode,
			icons: { CheckboxIcon, CheckboxCheckedIcon, CheckboxIndeterminateIcon },
		},
	} = table
	const { isLoading } = getState()

	const checkboxProps = !row
		? muiSelectAllCheckboxProps instanceof Function
			? muiSelectAllCheckboxProps({ table })
			: muiSelectAllCheckboxProps
		: muiSelectCheckboxProps instanceof Function
		? muiSelectCheckboxProps({ row, table })
		: muiSelectCheckboxProps

	const commonProps: CheckboxProps = {
		disableRipple: true,
		indeterminateIcon: <CheckboxIndeterminateIcon />,
		checkedIcon: <CheckboxCheckedIcon />,
		icon: <CheckboxIcon />,
		indeterminate: parentRow
			? parentRow.getIsSomeSelected()
			: selectAll
			? table.getIsSomeRowsSelected() &&
			  !(selectAllMode === 'page'
					? table.getIsAllPageRowsSelected()
					: table.getIsAllRowsSelected())
			: row?.getIsSomeSelected(),
		checked: parentRow
			? parentRow.getIsAllSubRowsSelected()
			: selectAll
			? selectAllMode === 'page'
				? table.getIsAllPageRowsSelected()
				: table.getIsAllRowsSelected()
			: row?.getIsSelected(),
		disabled: (row && !row.getCanSelect()) || isLoading,
		inputProps: {
			'aria-label': selectAll
				? localization.toggleSelectAll
				: localization.toggleSelectRow,
		},
		onChange: parentRow
			? (e) =>
					parentRow.subRows?.map((row) => row.getToggleSelectedHandler()(e))
			: row
			? row.getToggleSelectedHandler()
			: selectAllMode === 'all'
			? table.getToggleAllRowsSelectedHandler()
			: table.getToggleAllPageRowsSelectedHandler(),
		size: 'medium' as const,
		...checkboxProps,
		onClick: (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation()
			checkboxProps?.onClick?.(e)
		},
		sx: (theme: Theme) => ({
			height: '2.5rem',
			width: '2.5rem',
			m: '-0.4rem',
			...(checkboxProps?.sx instanceof Function
				? checkboxProps.sx(theme)
				: (checkboxProps?.sx as any)),
		}),
		title: undefined,
	}

	const checkbox =
		enableMultiRowSelection === false ? (
			<Radio {...commonProps} />
		) : (
			<Checkbox {...commonProps} />
		)

	return (
		<Tooltip
			arrow
			enterDelay={1000}
			enterNextDelay={1000}
			title={
				checkboxProps?.title ??
				(selectAll
					? localization.toggleSelectAll
					: localization.toggleSelectRow)
			}
		>
			{label ? (
				<FormGroup>
					<FormControlLabel
						sx={{ mx: 0 }}
						control={checkbox}
						label={label instanceof Function ? label(commonProps) : label}
					/>
				</FormGroup>
			) : (
				checkbox
			)}
		</Tooltip>
	)
}
