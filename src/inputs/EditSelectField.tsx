import React, { ChangeEvent, FocusEvent } from 'react'

import { TableData } from '../TableComponent'
import { normalizeSelectOptions } from '../utils/normalizeSelectOptions'

import { EditCellFieldProps } from './EditCellField'
import { Select, SelectProps } from './Select'
import { callOrReturnProps } from './utils/callOrReturnProps'
import { useEditField } from './utils/useEditField'

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
		setEditingCell,
		refs: { editInputRefs },
	} = table
	const { columnDef } = column
	const { editVariant, editSelectOptions } = columnDef
	const { setValue, saveRow, value } = useEditField(cellDataProps)
	const mSelectProps = callOrReturnProps(muiEditSelectProps, cellDataProps)
	const mcSelectProps = callOrReturnProps(
		columnDef.muiEditSelectProps,
		cellDataProps
	)
	const muiSelectProps = { ...mSelectProps, ...mcSelectProps }
	const multiple = editVariant === 'multi-select'
	const handleChange = (event: ChangeEvent<HTMLInputElement>, value) => {
		muiSelectProps.onChange?.(event)
		setValue(value.value)
		saveRow(value.value)
	}

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		muiSelectProps.onBlur?.(event)
		setEditingCell(null)
	}

	const selectProps: SelectProps = {
		disabled: columnDef.enableEditing === false,
		inputProps: {
			inputRef: (inputRef) => {
				if (inputRef) {
					editInputRefs.current[column.id] = inputRef
					if (muiSelectProps.inputRef) {
						muiSelectProps.inputRef = inputRef
					}
				}
			},
		},
		label: showLabel ? column.columnDef.header : undefined,
		multiple,
		name: column.id,
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
	}

	return <Select {...selectProps} />
}
