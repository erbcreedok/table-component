import React, { useMemo } from 'react'

import { TableData } from '../TableComponent'
import { getCellFieldId } from '../utils'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { normalizeSelectOptions } from '../utils/normalizeSelectOptions'
import { isEditInputDisabled } from '../utils/isEditingEnabled'

import { EditCellControllerProps, EditCellFieldProps } from './EditCellField'
import { Select, SelectProps } from './Select'

export const EditSelectField = <TData extends TableData>({
	table,
	cell,
	showLabel,
	field,
	fieldState,
	onCellSave,
}: EditCellFieldProps<TData> & EditCellControllerProps) => {
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
			? value.map((el) => el.value ?? el)
			: value?.value
		field.onChange(computedValue)
	}

	const handleBlur = (event) => {
		muiSelectProps.onBlur?.(event)
		field.onBlur()
		onCellSave()
	}

	const value = useMemo(() => {
		if (!multiple) return field.value
		if (Array.isArray(field.value)) return field.value
		if (field.value === null || field.value === undefined) return []

		return [field.value]
	}, [field.value, multiple])

	const selectProps: SelectProps = {
		disabled: isEditInputDisabled(enableEditing, { table, row }),
		multiple,
		options: editSelectOptions ? normalizeSelectOptions(editSelectOptions) : [],
		placeholder: columnDef.header,
		...muiSelectProps,
		onClick: (e) => {
			e.stopPropagation()
			muiSelectProps?.onClick?.(e)
		},
		value: value ?? null,
		onBlur: handleBlur,
		onChange: handleChange,
		inputProps: {
			error: fieldState.error?.message,
			inputRef: (inputRef) => {
				if (inputRef) {
					editInputRefs.current[column.id] = inputRef
					editInputRefs.current[getCellFieldId(cell)] = inputRef
					if (muiSelectProps.inputRef) {
						muiSelectProps.inputRef = inputRef
					}
				}
			},
			label: showLabel ? column.columnDef.header : undefined,
			name: column.id,
			hideErrorOnFocus: table.constants.hideInputErrorOnFocus,
			...muiSelectProps.inputProps,
		},
	}

	return <Select {...selectProps} />
}
