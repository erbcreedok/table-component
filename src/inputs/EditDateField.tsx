import React, { useRef } from 'react'

import { useOnClickOutside } from '../hooks/useOnClickOutside'
import { SimpleEvent, TableData } from '../TableComponent'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'
import { useEditField } from '../hooks/useEditField'
import { isEditInputDisabled } from '../utils/isEditingEnabled'

import { DayPickerInput, DayPickerInputProps } from './DayPickerInput'
import { EditCellFieldProps } from './EditCellField'

export const EditDateField = <TData extends TableData>({
	table,
	cell,
	showLabel,
}: EditCellFieldProps<TData>) => {
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
		setEditingCell,
	} = table
	const { columnDef } = column
	const { editVariant, enableEditing } = columnDef
	const { setValue, saveData, value, error } = useEditField<TData, Date | null>(
		cellDataProps
	)
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
		setValue(event.target.value)
	}

	const handleDayPickerBlur = () => {
		muiDayPickerInputProps.onBlur?.()
		saveData(value)
	}

	const handleClickOutside = (event) => {
		event.stopPropagation()
		if (error) {
			setEditingCell(null)
		}
	}
	useOnClickOutside([cellRef, dayPickerRef], handleClickOutside)

	const dayPickerInputProps: DayPickerInputProps = {
		disabled: isEditInputDisabled(enableEditing, { table, row }),
		inputProps: {
			placeholder: columnDef.header,
			label: showLabel ? column.columnDef.header : undefined,
			error,
			hideErrorOnFocus: true,
			...muiDayPickerInputProps.inputProps,
			inputRef: (inputRef) => {
				if (inputRef) {
					cellRef.current = inputRef
					editInputRefs.current[column.id] = inputRef
					if (muiDayPickerInputProps.inputRef) {
						muiDayPickerInputProps.inputRef = inputRef
					}
				}
			},
			onClear: (e) => {
				muiDayPickerInputProps.inputProps?.onClear?.(e)
				setValue(null)
			},
			onClick: (e) => {
				e.stopPropagation()
				muiDayPickerInputProps?.inputProps?.onClick?.(e)
			},
			onKeyDown: (e) => {
				muiDayPickerInputProps?.inputProps?.onKeyDown?.(e)
				if (!e.isPropagationStopped() && e.key === 'Escape') {
					setEditingCell(null)
				}
			},
		},
		isDateRange,
		name: column.id,
		value,
		...muiDayPickerInputProps,
		onChange: handleChange,
		onBlur: handleDayPickerBlur,
		floatingRef: dayPickerRef,
	}

	return <DayPickerInput {...dayPickerInputProps} />
}
