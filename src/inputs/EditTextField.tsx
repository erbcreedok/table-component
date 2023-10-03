import { debounce } from '@mui/material/utils'
import React, {
	ChangeEvent,
	FocusEvent,
	KeyboardEvent,
	useMemo,
	useState,
} from 'react'

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
	const [isAfteredit, setAfteredit] = useState(false)
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
		getState,
	} = table
	const { editingRow } = getState()
	const { columnDef } = column
	const { editVariant, minValue, maxValue, validator } = columnDef
	const { setValue, saveRow, value, setEditingRowErrors, editingRowErrors } =
		useEditField(cellDataProps)
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
	const isValueValid = (value) => {
		return validator?.({ value, cell, row, table }) === true
	}

	const getErrorExplanation = (value) => {
		const validationResult = validator?.({ value, cell, row, table })

		return typeof validationResult === 'string' ? validationResult : null
	}

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		muiInputProps.onChange?.(event)
		if (!isReadOnly) {
			if (
				(isNumeric && minValue && Number(event.target.value) < minValue) ||
				Number(event.target.value) < 0
			) {
				setValue(String(minValue ?? 0))
			} else {
				setValue(event.target.value)
			}
			setRowValue(event.target.value)
			if (editingRow && validator) {
				setEditingRowErrors({
					...editingRowErrors,
					[column.id]: isValueValid(value),
				})
			}
		}
	}

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		muiInputProps.onBlur?.(event)
		if (validator && !isValueValid(value)) {
			setAfteredit(true)
		} else {
			setAfteredit(false)
			saveRow(value)
			setEditingCell(null)
		}
	}

	const handleFocus = () => {
		if (editingRow) {
			setEditingRowErrors({ ...editingRowErrors, [column.id]: false })
		}
		setAfteredit(false)
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
			if (muiInputProps?.select) {
				saveRow('')
			}
		},
		error:
			isAfteredit && validator && value ? isValueValid(value) === false : false,
		errorExplanation: getErrorExplanation(value),
		onBlur: handleBlur,
		onChange: handleChange,
		onKeyDown: handleEnterKeyDown,
		onFocus: handleFocus,
	}

	return <Input {...inputProps} />
}
