import { TextField, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { TextFieldProps } from '@mui/material/TextField'
import { PartialKeys } from '@tanstack/table-core'
import {
	ChangeEventHandler,
	forwardRef,
	MouseEventHandler,
	useCallback,
	useRef,
} from 'react'

import { ErrorTooltipIconWithTable, handleRef, NumberStepButtons } from '../../'
import { useTableContext } from '../../context/useTableContext'
import { useFocusEvents } from '../../hooks/useFocusEvents'
import { TableColumnEditProps } from '../../TableComponent'
import { createNativeChangeEvent } from '../../utils/createNativeChangeEvent'
import { isGreaterThan } from '../../utils/isGreaterThan'
import { isLessThan } from '../../utils/isLessThan'
import { mergeSx } from '../../utils/mergeSx'
import { sanitizeNumeric } from '../../utils/numeric'
import { sumAnyTwoValues } from '../../utils/sumAnyTwoValues'
import { useStopPropagation } from '../../utils/withStopPropagation'

import { iconButtonSx, inputSx } from './styles'

export type InputProps = Omit<
	PartialKeys<TextFieldProps, 'variant'>,
	'color' | 'error'
> &
	Pick<TableColumnEditProps<never>, 'editVariant'> & {
		onClear?: MouseEventHandler
		/** @deprecated use `editVariant` */
		isNumeric?: boolean
		step?: number
		minValue?: number
		maxValue?: number
		error?: string | null | boolean
		hideErrorOnFocus?: boolean
	}

export const Input = forwardRef<HTMLDivElement, InputProps>(
	(
		{
			onClear,
			isNumeric,
			editVariant,
			step = 1,
			minValue,
			maxValue,
			hideErrorOnFocus,
			error,
			onChange,
			...props
		},
		ref
	) => {
		if (editVariant === undefined && isNumeric) editVariant = 'number'

		const {
			table: {
				options: {
					icons: { CloseIcon },
				},
			},
		} = useTableContext()
		const textFieldRef = useRef<HTMLDivElement>(null)
		const inputRef = useRef<HTMLInputElement>(null)
		const {
			focused,
			focusProps: { handleFocus, handleBlur },
		} = useFocusEvents<HTMLInputElement>(props)

		const onBlur = useCallback(
			(event) => {
				if (
					textFieldRef.current &&
					event.relatedTarget &&
					textFieldRef.current.contains(event.relatedTarget)
				) {
					queueMicrotask(() => {
						inputRef.current?.focus()
					})
					event.stopPropagation()

					return
				}
				handleBlur(event)
			},
			[handleBlur]
		)

		const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
			(event) => {
				if (editVariant === 'number' || editVariant === 'percent') {
					event.target.value = sanitizeNumeric(event.target.value)
				}
				onChange?.(event)
			},
			[editVariant, onChange]
		)

		const isError = typeof error === 'string' || error === true
		const showError = hideErrorOnFocus && focused ? false : isError

		const handleStepClick = (step: number) => () => {
			if (inputRef.current) {
				createNativeChangeEvent(
					inputRef.current,
					Number(props.value || inputRef.current.value) + step
				)
				queueMicrotask(() => {
					inputRef.current?.focus()
				})
			}
		}

		const onClearStop = useStopPropagation(onClear, [onClear])

		const compoundRef = useCallback(
			(element) => {
				handleRef(textFieldRef)(element)
				handleRef(ref)(element)
			},
			[ref]
		)
		const compoundInputRef = useCallback(
			(element) => {
				handleRef(inputRef)(element)
				handleRef(props.inputRef)(element)
			},
			[props.inputRef]
		)

		return (
			<TextField
				ref={compoundRef}
				variant="outlined"
				size="small"
				margin="none"
				fullWidth
				{...props}
				onChange={handleChange}
				onFocus={handleFocus}
				onBlur={onBlur}
				error={showError}
				InputProps={{
					inputRef: compoundInputRef,
					...props.InputProps,
					endAdornment: (
						<>
							{showError && <ErrorTooltipIconWithTable error={error} />}
							{!!props.value && onClear && (
								<IconButton onClick={onClearStop} sx={iconButtonSx}>
									<CloseIcon style={{ width: '18px', height: '18px' }} />
								</IconButton>
							)}
							{editVariant === 'number' && (
								<NumberStepButtons
									sx={{ mr: '6px' }}
									onClickUp={handleStepClick(step)}
									onClickDown={handleStepClick(-step)}
									iconButtonUpProps={{
										disabled: isGreaterThan(
											sumAnyTwoValues(props.value, step),
											maxValue
										),
									}}
									iconButtonDownProps={{
										disabled: isLessThan(
											sumAnyTwoValues(props.value, -step),
											minValue
										),
									}}
								/>
							)}
							{editVariant === 'percent' && (
								<Typography
									sx={{
										mr: 1,
									}}
								>
									%
								</Typography>
							)}
							{props.InputProps?.endAdornment}
						</>
					),
					inputProps: props.inputProps,
				}}
				sx={mergeSx(inputSx, props.sx)}
			/>
		)
	}
)
