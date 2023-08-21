import { debounce } from '@mui/material/utils'
import React, { ChangeEvent, FocusEvent, KeyboardEvent, useMemo } from 'react'

import { TableData } from '../TableComponent'

import { EditCellFieldProps } from './EditCellField'
import { Input, InputProps } from './Input'
import { callOrReturnProps } from './utils/callOrReturnProps'
import { useEditField } from './utils/useEditField'

export const EditTextField = <TData extends TableData>({
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
		options: { muiEditInputProps },
		setEditingCell,
		refs: { editInputRefs },
	} = table
	const { columnDef } = column
	const { editVariant } = columnDef
	const { setValue, saveRow, value } = useEditField(cellDataProps)
	const mInputProps = callOrReturnProps(muiEditInputProps, cellDataProps)
	const mcInputProps = callOrReturnProps(
		columnDef.muiEditInputProps,
		cellDataProps
	)
	const muiInputProps = { ...mInputProps, ...mcInputProps }
	const isNumeric = editVariant === 'number'
	const isReadOnly = editVariant === 'formula'
	const setRowValue = useMemo(
		() =>
			debounce((value) => {
				saveRow(value)
			}, 500),
		[saveRow]
	)
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		muiInputProps.onChange?.(event)
		if (!isReadOnly) {
			setValue(event.target.value)
			setRowValue(event.target.value)
		}
	}

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		muiInputProps.onBlur?.(event)
		saveRow(value)
		setEditingCell(null)
	}

	const handleEnterKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
		muiInputProps.onKeyDown?.(event)
		if (event.key === 'Enter') {
			editInputRefs.current[column.id]?.blur()
		}
	}

	const inputProps: InputProps = {
		disabled: columnDef.enableEditing === false,
		inputRef: (inputRef) => {
			if (inputRef) {
				editInputRefs.current[column.id] = inputRef
				if (muiInputProps.inputRef) {
					muiInputProps.inputRef = inputRef
				}
			}
		},
		isNumeric,
		label: showLabel ? column.columnDef.header : undefined,
		name: column.id,
		placeholder: columnDef.header,
		value,
		...muiInputProps,
		onClick: (e) => {
			e.stopPropagation()
			muiInputProps?.onClick?.(e)
		},
		onClear: (e) => {
			muiInputProps.onClear?.(e)
			setValue('')
			if (muiInputProps?.select) {
				saveRow('')
			}
		},
		onBlur: handleBlur,
		onChange: handleChange,
		onKeyDown: handleEnterKeyDown,
	}

	return <Input {...inputProps} />
}
