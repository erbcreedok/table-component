import { PropsWithChildren, RefObject } from 'react'

import { useTableContext } from '../context/useTableContext'

import { DateInput, DateInputProps } from './DateInput'
import { DayPicker, DayPickerProps } from './DayPicker'

export type DayPickerInputProps = PropsWithChildren<
	Omit<DayPickerProps, 'children'>
> & {
	inputProps?: DateInputProps
}
export const DayPickerInput = ({
	inputProps,
	...props
}: DayPickerInputProps) => {
	const { table } = useTableContext()
	const {
		refs: { tableContainerRef },
	} = table

	return (
		<DayPicker container={tableContainerRef.current} {...props}>
			{({ value, handleSelect, bind: { ref, ...bind } }) => (
				<DateInput
					ref={ref as RefObject<HTMLDivElement>}
					onChange={handleSelect}
					value={value}
					{...inputProps}
					{...bind}
				/>
			)}
		</DayPicker>
	)
}
