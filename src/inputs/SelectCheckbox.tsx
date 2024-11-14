import { FormGroup } from '@mui/material'
import Checkbox, { CheckboxProps } from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Radio, { RadioProps } from '@mui/material/Radio'
import Tooltip from '@mui/material/Tooltip'
import { ChangeEvent, MouseEvent, ReactNode } from 'react'

import type { Table_Row, TableInstance } from '..'
import { getIsMockRow } from '../utils/getIsMockRow'
import { mergeSx } from '../utils/mergeSx'
import { withNativeEvent } from '../utils/withNativeEvent'

type Props = {
	row?: Table_Row
	selectAll?: boolean
	table: TableInstance
	parentRow?: Table_Row
	label?: ReactNode | ((props: CheckboxProps) => ReactNode)
} & (CheckboxProps | RadioProps)

export const SelectCheckbox = ({
	row,
	selectAll,
	table,
	parentRow,
	label,
	...rest
}: Props) => {
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

	const muiCheckboxProps = !row
		? muiSelectAllCheckboxProps instanceof Function
			? muiSelectAllCheckboxProps({ table } as any)
			: muiSelectAllCheckboxProps
		: muiSelectCheckboxProps instanceof Function
		? muiSelectCheckboxProps({ row, table } as any)
		: muiSelectCheckboxProps

	const checkboxProps = {
		...muiCheckboxProps,
		...rest,
	}

	const indeterminate = parentRow
		? parentRow.getIsSomeSelected()
		: selectAll
		? table.getIsSomeRowsSelected() &&
		  !(selectAllMode === 'page'
				? table.getIsAllPageRowsSelected()
				: table.getIsAllRowsSelected())
		: row?.getIsSomeSelected()

	const commonProps: CheckboxProps = {
		disableRipple: true,
		indeterminateIcon: <CheckboxIndeterminateIcon />,
		checkedIcon: <CheckboxCheckedIcon />,
		icon: <CheckboxIcon />,
		indeterminate,
		checked: parentRow
			? parentRow.getIsAllSubRowsSelected()
			: selectAll
			? selectAllMode === 'page'
				? table.getIsAllPageRowsSelected()
				: table.getIsAllRowsSelected()
			: row?.getIsSelected(),
		disabled:
			table.constants.disableActionButtons ||
			(parentRow && parentRow.subRows
				? [...parentRow.subRows].every((row) => !row.getCanSelect())
				: (row && !row.getCanSelect()) || isLoading),
		inputProps: {
			'aria-label': selectAll ? localization.selectAll : localization.selectRow,
		},
		onChange: parentRow
			? withNativeEvent<ChangeEvent<HTMLInputElement>>(
					{
						el: 'Table_SelectRow',
						type: 'click',
					},
					table
			  )(() =>
					indeterminate
						? parentRow.subRows?.forEach((row) => {
								row.toggleSelected(false)
						  })
						: parentRow.subRows?.map(
								(row) => !getIsMockRow(row) && row.toggleSelected()
						  )
			  )
			: row
			? withNativeEvent<ChangeEvent<HTMLInputElement>>(
					{
						el: 'Table_SelectRow',
						type: 'click',
					},
					table
			  )(row.getToggleSelectedHandler())
			: selectAllMode === 'all'
			? table.getToggleAllRowsSelectedHandler()
			: table.getToggleAllPageRowsSelectedHandler(),
		size: 'medium' as const,
		...checkboxProps,
		onClick: (e: MouseEvent<HTMLButtonElement>) => {
			e.stopPropagation()
			checkboxProps?.onClick?.(e)
		},
		sx: mergeSx(
			{
				height: '2.5rem',
				width: '2.5rem',
				m: '-0.4rem',
			},
			checkboxProps?.sx
		),
		title: undefined,
	}

	// todo refactor to 2 separate components
	const checkbox =
		enableMultiRowSelection === false ? (
			<Radio {...(commonProps as RadioProps)} />
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
				(selectAll ? localization.selectAll : localization.selectRow)
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
