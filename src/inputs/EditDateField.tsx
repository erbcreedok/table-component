import React, { useRef } from 'react'
import { useFormContext } from 'react-hook-form'

import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { getCellFieldId, SimpleEvent, TableData } from '../'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { isEditInputDisabled } from '../utils/isEditingEnabled'

import { DayPickerInput } from './DayPickerInput'
import { EditCellControllerProps, EditCellFieldProps } from './EditCellField'

export const EditDateField = <TData extends TableData>({
	table,
	cell,
	showLabel,
	field,
	fieldState,
	onCellSave,
	onCellCancel,
}: EditCellFieldProps<TData> & EditCellControllerProps) => {
	const cellRef = useRef<HTMLInputElement | null>(null)
	const dayPickerRef = useRef<HTMLInputElement | null>(null)
	const { row, column } = cell
	const cellDataProps = {
		cell,
		column,
		row,
		table,
	}
	const {
		options: { muiEditDayPickerInputProps },
		refs: { editInputRefs },
	} = table
	const { columnDef } = column
	const { editVariant, enableEditing } = columnDef
	const fieldId = getCellFieldId(cell)
	const { setValue } = useFormContext()
	const error = fieldState.error?.message
	const mDayPickerInputProps = getValueOrFunctionHandler(
		muiEditDayPickerInputProps
	)(cellDataProps)
	const mcDayPickerInputProps = getValueOrFunctionHandler(
		columnDef.muiEditDayPickerInputProps
	)(cellDataProps)
	const muiDayPickerInputProps = {
		...mDayPickerInputProps,
		...mcDayPickerInputProps,
	}
	const isDateRange = editVariant === 'date-range'
	const handleChange = (event: SimpleEvent<Date>) => {
		muiDayPickerInputProps.onChange?.(event)
		field.onChange(event.target.value)
	}

	const handleDayPickerBlur = () => {
		muiDayPickerInputProps.onBlur?.()
		field.onBlur()
		onCellSave()
	}

	const handleClickOutside = (event) => {
		event.stopPropagation()
		if (error) {
			onCellCancel()
		}
	}
	useOnClickOutside([cellRef, dayPickerRef], handleClickOutside)

	const dayPickerInputProps = {
		disabled: isEditInputDisabled(enableEditing, { table, row }),
		inputProps: {
			error,
			placeholder: columnDef.header,
			label: showLabel ? column.columnDef.header : undefined,
			hideErrorOnFocus: true,
			...muiDayPickerInputProps.inputProps,
			inputRef: (inputRef) => {
				if (inputRef) {
					cellRef.current = inputRef
					editInputRefs.current[column.id] = inputRef
					editInputRefs.current[getCellFieldId(cell)] = inputRef
					if (muiDayPickerInputProps.inputRef) {
						muiDayPickerInputProps.inputRef = inputRef
					}
				}
			},
			onClear: (e) => {
				muiDayPickerInputProps.inputProps?.onClear?.(e)
				setValue(fieldId, null)
			},
			onClick: (e) => {
				e.stopPropagation()
				muiDayPickerInputProps?.inputProps?.onClick?.(e)
			},
			onKeyDown: (e) => {
				muiDayPickerInputProps?.inputProps?.onKeyDown?.(e)
				if (!e.isPropagationStopped() && e.key === 'Escape') {
					onCellCancel()
				}
			},
		},
		isDateRange,
		...field,
		onChange: handleChange,
		onBlur: handleDayPickerBlur,
		...muiDayPickerInputProps,
		floatingRef: dayPickerRef,
	}

	return <DayPickerInput {...dayPickerInputProps} />
}
