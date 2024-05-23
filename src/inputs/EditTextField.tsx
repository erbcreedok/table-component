import { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { isNumeric, roundDecimalPlaces } from '../utils/numeric'
import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { getCellFieldId, NumericColumn, TableData } from '../'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { isEditInputDisabled } from '../utils/isEditingEnabled'

import { EditCellControllerProps, EditCellFieldProps } from './EditCellField'
import { Input, InputProps } from './Input'

export const EditTextField = <TData extends TableData>({
	table,
	cell,
	showLabel,
	field,
	fieldState,
	onCellSave,
	onCellCancel,
}: EditCellFieldProps<TData> & EditCellControllerProps) => {
	const { row, column } = cell
	const cellDataProps = {
		cell,
		column,
		row,
		table,
	}
	const {
		options: { editingMode, muiEditInputProps },
		refs: { editInputRefs },
	} = table
	const { columnDef } = column
	const { editVariant, minValue, maxValue, enableEditing } = columnDef
	const decimalPlaces = (columnDef as NumericColumn).decimalPlaces

	const { setValue } = useFormContext()
	const fieldId = getCellFieldId(cell)
	const error = fieldState.error?.message

	const mInputProps =
		getValueOrFunctionHandler(muiEditInputProps)(cellDataProps)
	const mcInputProps = getValueOrFunctionHandler(columnDef.muiEditInputProps)(
		cellDataProps
	)
	const muiInputProps = { ...mInputProps, ...mcInputProps }
	const isReadOnly = editVariant === 'formula'

	const handleChange: InputProps['onChange'] = (event) => {
		muiInputProps.onChange?.(event)
		if (event.isPropagationStopped()) return
		if (!isReadOnly) {
			field.onChange(event)
		}
	}

	const handleBlur: InputProps['onBlur'] = (event) => {
		if (decimalPlaces !== undefined && isNumeric(field.value)) {
			setValue(fieldId, roundDecimalPlaces(decimalPlaces, Number(field.value)))
		}
		muiInputProps.onBlur?.(event)
		if (event.isPropagationStopped()) return
		field.onBlur()
		if (editingMode === 'cell') {
			onCellSave()
		}
	}

	const handleEnterKeyDown: InputProps['onKeyDown'] = (event) => {
		muiInputProps.onKeyDown?.(event)
		if (event.key === 'Enter') {
			editInputRefs.current[column.id]?.blur()
		}
		if (event.key === 'Escape') {
			onCellCancel()
		}
	}

	const cellRef = useRef<HTMLInputElement | null>(null)
	const handleClickOutside = (event) => {
		event.stopPropagation()
		if (error) {
			onCellCancel()
		}
	}

	useOnClickOutside(cellRef, handleClickOutside)

	const inputProps: InputProps = {
		disabled: isEditInputDisabled(enableEditing, { table, row }),
		inputRef: (inputRef) => {
			if (inputRef) {
				cellRef.current = inputRef
				editInputRefs.current[column.id] = inputRef
				editInputRefs.current[getCellFieldId(cell)] = inputRef
				if (muiInputProps.inputRef) {
					muiInputProps.inputRef = inputRef
				}
			}
		},
		editVariant,
		minValue,
		maxValue,
		label: showLabel ? column.columnDef.header : undefined,
		name: column.id,
		placeholder: columnDef.header,
		...muiInputProps,
		onClick: (e) => {
			e.stopPropagation()
			muiInputProps?.onClick?.(e)
		},
		onClear: (e) => {
			muiInputProps.onClear?.(e)
			setValue(fieldId, '')
		},
		value: field.value,
		error,
		hideErrorOnFocus: true,
		onBlur: handleBlur,
		onChange: handleChange,
		onKeyDown: handleEnterKeyDown,
	}

	return <Input {...inputProps} />
}
