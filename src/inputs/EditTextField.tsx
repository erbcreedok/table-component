import React, { useRef } from 'react'

import { useEditField } from '../hooks/useEditField'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { TableData } from '../TableComponent'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { isEditInputDisabled } from '../utils/isEditingEnabled'

import { EditCellFieldProps } from './EditCellField'
import { Input, InputProps } from './Input'

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
		refs: { editInputRefs },
		setEditingCell,
	} = table
	const { columnDef } = column
	const { editVariant, minValue, maxValue, enableEditing } = columnDef
	const { setValue, saveData, value, error } = useEditField(cellDataProps)

	const mInputProps =
		getValueOrFunctionHandler(muiEditInputProps)(cellDataProps)
	const mcInputProps = getValueOrFunctionHandler(columnDef.muiEditInputProps)(
		cellDataProps
	)
	const muiInputProps = { ...mInputProps, ...mcInputProps }
	const isNumeric = editVariant === 'number'
	const isReadOnly = editVariant === 'formula'

	const handleChange: InputProps['onChange'] = (event) => {
		muiInputProps.onChange?.(event)
		if (event.isPropagationStopped()) return
		if (!isReadOnly) {
			setValue(event.target.value)
		}
	}

	const handleBlur: InputProps['onBlur'] = (event) => {
		muiInputProps.onBlur?.(event)
		if (event.isPropagationStopped()) return
		saveData(value)
	}

	const handleEnterKeyDown: InputProps['onKeyDown'] = (event) => {
		muiInputProps.onKeyDown?.(event)
		if (event.key === 'Enter') {
			editInputRefs.current[column.id]?.blur()
		}
		if (event.key === 'Escape') {
			setEditingCell(null)
		}
	}

	const cellRef = useRef<HTMLInputElement | null>(null)
	const handleClickOutside = (event) => {
		event.stopPropagation()
		if (error) {
			setEditingCell(null)
		}
	}
	useOnClickOutside(cellRef, handleClickOutside)

	const inputProps: InputProps = {
		disabled: isEditInputDisabled(enableEditing, { table, row }),
		inputRef: (inputRef) => {
			if (inputRef) {
				cellRef.current = inputRef
				editInputRefs.current[column.id] = inputRef
				if (muiInputProps.inputRef) {
					muiInputProps.inputRef = inputRef
				}
			}
		},
		isNumeric,
		minValue,
		maxValue,
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
		},
		error,
		hideErrorOnFocus: true,
		onBlur: handleBlur,
		onChange: handleChange,
		onKeyDown: handleEnterKeyDown,
	}

	return <Input {...inputProps} />
}
