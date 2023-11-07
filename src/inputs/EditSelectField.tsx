import React, { FocusEvent } from 'react'

import { TableData } from '../TableComponent'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { normalizeSelectOptions } from '../utils/normalizeSelectOptions'
import { useEditField } from '../hooks/useEditField'
import { isEditInputDisabled } from '../utils/isEditingEnabled'

import { EditCellFieldProps } from './EditCellField'
import { Select, SelectProps } from './Select'

export const EditSelectField = <TData extends TableData>({
	table,
	cell,
	showLabel,
}: EditCellFieldProps<TData>) => {
	const { row, column } = cell
	const cellDataProps = {
		cell,
		column,
		row,
		table,
	}
	const {
		options: { muiEditSelectProps },
		refs: { editInputRefs },
	} = table
	const { columnDef } = column
	const { editVariant, editSelectOptions, enableEditing } = columnDef
	const { setValue, saveData, value, error } = useEditField(cellDataProps)
	const mSelectProps =
		getValueOrFunctionHandler(muiEditSelectProps)(cellDataProps)
	const mcSelectProps = getValueOrFunctionHandler(columnDef.muiEditSelectProps)(
		cellDataProps
	)
	const muiSelectProps = { ...mSelectProps, ...mcSelectProps }
	const multiple = editVariant === 'multi-select'
	const handleChange: SelectProps['onChange'] = (event, value, ...rest) => {
		muiSelectProps.onChange?.(event, value, ...rest)
		const computedValue = Array.isArray(value)
			? value.map(({ value }) => value)
			: value?.value
		setValue(computedValue)
	}

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		muiSelectProps.onBlur?.(event)
		saveData(value)
	}

	const selectProps: SelectProps = {
		disabled: isEditInputDisabled(enableEditing, { table, row }),
		multiple,
		options: editSelectOptions ? normalizeSelectOptions(editSelectOptions) : [],
		placeholder: columnDef.header,
		value,
		...muiSelectProps,
		onClick: (e) => {
			e.stopPropagation()
			muiSelectProps?.onClick?.(e)
		},
		onBlur: handleBlur,
		onChange: handleChange,
		inputProps: {
			inputRef: (inputRef) => {
				if (inputRef) {
					editInputRefs.current[column.id] = inputRef
					if (muiSelectProps.inputRef) {
						muiSelectProps.inputRef = inputRef
					}
				}
			},
			label: showLabel ? column.columnDef.header : undefined,
			name: column.id,
			error,
			hideErrorOnFocus: true,
			...muiSelectProps.inputProps,
		},
	}

	return <Select {...selectProps} />
}
