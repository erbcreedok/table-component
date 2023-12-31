import { format, getYear, isValid, parse } from 'date-fns'
import React, {
	FC,
	forwardRef,
	MouseEventHandler,
	useCallback,
	useEffect,
	useState,
} from 'react'

import { Input, InputProps } from './Input'

const isArray = Array.isArray

type Value = Date | null | undefined

const formatDate = (value: Value, formatMask: string) => {
	if (isArray(value) && value[0] != null && value[1] != null) {
		return `${format(value[0], formatMask)} - ${format(value[1], formatMask)}`
	}

	if (!isArray(value) && value) return format(value, formatMask)

	return ''
}

export type DateInputProps = Omit<
	InputProps,
	'value' | 'step' | 'onChange' | 'onSubmit'
> & {
	value?: Value
	onChange?: (day: Value, close: boolean) => void
	formatMask?: string
	onClear?: MouseEventHandler
}

export const DateInput: FC<DateInputProps> = forwardRef(
	(
		{ value, onBlur, onChange, onFocus, formatMask = 'dd.MM.yyyy', ...props },
		ref
	) => {
		const [internalValue, setInternalValue] = useState<string>('')
		const [isError, setIsError] = useState<boolean>(false)

		useEffect(() => {
			setInternalValue(value ? formatDate(value, formatMask) : '')
		}, [formatMask, value])

		const handleChange = useCallback(
			({ target: { value } }) => {
				const parsedDate = parse(value, formatMask, new Date())
				if (isValid(parsedDate) && getYear(parsedDate) > 999) {
					onChange?.(parsedDate, false)
				}
				if (!isValid(parsedDate)) {
					setIsError(true)
				}
				setInternalValue(value)
			},
			[formatMask, onChange]
		)

		// clear value if it is invalid
		const handleBlur = useCallback(
			(event) => {
				onBlur?.(event)
				if (event.isPropagationStopped()) return
				const parsedDate = parse(event.target.value, formatMask, new Date())
				if (!isValid(parsedDate) || getYear(parsedDate) <= 999) {
					setInternalValue('')
					onChange?.(null, true)
				}
			},
			[formatMask, onBlur, onChange]
		)

		const handleFocus = useCallback(
			(event) => {
				onFocus?.(event)
				setIsError(false)
			},
			[onFocus]
		)

		return (
			<Input
				autoComplete="off"
				error={isError}
				{...props}
				InputProps={{
					ref,
				}}
				value={internalValue}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={handleBlur}
			/>
		)
	}
)
