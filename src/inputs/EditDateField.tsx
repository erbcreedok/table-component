import React, { FocusEvent } from 'react'

import { SimpleEvent, TableData } from '../TableComponent'

import { DayPickerInput, DayPickerInputProps } from './DayPickerInput'
import { EditCellFieldProps } from './EditCellField'
import { callOrReturnProps } from './utils/callOrReturnProps'
import { useEditField } from './utils/useEditField'

export const EditDateField = <TData extends TableData>({
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
		options: { muiEditDayPickerInputProps },
		setEditingCell,
		refs: { editInputRefs },
	} = table
	const { columnDef } = column
	const { editVariant } = columnDef
	const { setValue, saveRow, value } = useEditField<Date | null, TData>(
		cellDataProps
	)
	const mDayPickerInputProps = callOrReturnProps(
		muiEditDayPickerInputProps,
		cellDataProps
	)
	const mcDayPickerInputProps = callOrReturnProps(
		columnDef.muiEditDayPickerInputProps,
		cellDataProps
	)
	const muiDayPickerInputProps = {
		...mDayPickerInputProps,
		...mcDayPickerInputProps,
	}
	const isDateRange = editVariant === 'date-range'
	const handleChange = (event: SimpleEvent<Date>) => {
		muiDayPickerInputProps.onChange?.(event)
		setValue(event.target.value)
		saveRow(event.target.value)
	}

	const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
		muiDayPickerInputProps.inputProps?.onBlur?.(event)
		setEditingCell(null)
	}

	const dayPickerInputProps: DayPickerInputProps = {
		disabled: columnDef.enableEditing === false,
		inputProps: {
			inputRef: (inputRef) => {
				if (inputRef) {
					editInputRefs.current[column.id] = inputRef
					if (muiDayPickerInputProps.inputRef) {
						muiDayPickerInputProps.inputRef = inputRef
					}
				}
			},
			placeholder: columnDef.header,
			label: showLabel ? column.columnDef.header : undefined,
			onClear: (e) => {
				muiDayPickerInputProps.inputProps?.onClear?.(e)
				setValue(null)
				saveRow(null)
			},
			onClick: (e) => {
				e.stopPropagation()
				muiDayPickerInputProps?.inputProps?.onClick?.(e)
			},
			onBlur: handleBlur,
		},
		isDateRange,
		name: column.id,
		value,
		...muiDayPickerInputProps,
		onChange: handleChange,
	}

	return <DayPickerInput {...dayPickerInputProps} />
}
