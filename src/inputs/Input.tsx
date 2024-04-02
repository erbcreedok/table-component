import {
	inputBaseClasses,
	outlinedInputClasses,
	TextField,
	Typography,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { TextFieldProps } from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { PartialKeys } from '@tanstack/table-core'
import {
	ChangeEventHandler,
	MouseEventHandler,
	useCallback,
	useRef,
} from 'react'

import { TableColumnEditProps } from '../TableComponent'
import { Tooltip } from '../components/Tooltip'
import { NumberStepButtons } from '../components/NumberStepButtons'
import { Colors, IconsColor, TextColor } from '../components/styles'
import { useTableContext } from '../context/useTableContext'
import { useFocusEvents } from '../hooks/useFocusEvents'
import { isGreaterThan } from '../stories/utils/isGreaterThan'
import { isLessThan } from '../stories/utils/isLessThan'
import { sumAnyTwoValues } from '../stories/utils/sumAnyTwoValues'
import { createNativeChangeEvent } from '../utils/createNativeChangeEvent'
import { sanitizeNumeric } from '../utils/numeric'
import { mergeSx } from '../utils/mergeSx'
import {
	handleStopPropagation,
	useStopPropagation,
} from '../utils/withStopPropagation'

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

export const Input = ({
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
}: InputProps) => {
	if (editVariant === undefined && isNumeric) editVariant = 'number'

	const {
		table: {
			options: {
				icons: { CloseIcon, WarningOutlineIcon },
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
		}
	}

	const onClearStop = useStopPropagation(onClear, [onClear])

	return (
		<TextField
			ref={textFieldRef}
			variant="outlined"
			size="small"
			margin="none"
			fullWidth
			{...props}
			onChange={handleChange}
			onFocus={handleFocus}
			onBlur={onBlur}
			error={showError}
			onMouseDown={handleStopPropagation} // for DragScrollingContainer to not mess things up
			InputProps={{
				inputRef: (node) => {
					if (node) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						inputRef.current = node
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						props.inputRef?.(node)
					}
				},
				...props.InputProps,
				endAdornment: (
					<>
						{showError && (
							<Tooltip
								placement="top"
								arrow
								disabled={typeof error !== 'string'}
								title={error}
							>
								<Box sx={{ display: 'flex', mr: '9px' }}>
									<WarningOutlineIcon sx={{ color: Colors.Red, m: 'auto' }} />
								</Box>
							</Tooltip>
						)}
						{!!props.value && onClear && (
							<IconButton
								onClick={onClearStop}
								sx={{
									visibility: 'hidden',
									right: 0,
									background: 'white',
									display: 'none',
									height: 18,
									p: 0,
									mr: 1,
									[`&:hover`]: {
										background: Colors.White,
									},
									[`.${outlinedInputClasses.root}:hover &`]: {
										display: 'flex',
										alignItems: 'center',
										visibility: 'visible',
									},
								}}
							>
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
			sx={mergeSx(
				{
					my: '6px',
					backgroundColor: '#FFFFFF',
					borderRadius: '6px',
					[`& .${outlinedInputClasses.root}`]: {
						borderRadius: '6px',
						[`&:not(.${outlinedInputClasses.focused}):not(.${outlinedInputClasses.disabled}):not(.${outlinedInputClasses.error}):hover`]:
							{
								[`& .${outlinedInputClasses.notchedOutline}`]: {
									borderColor: Colors.Gray40,
									borderWidth: 1,
								},
							},
						[`&.${outlinedInputClasses.disabled}`]: {
							backgroundColor: Colors.LightestGray,
							[`.${outlinedInputClasses.notchedOutline}`]: {
								borderColor: Colors.Gray20,
							},
						},
						[`&.${outlinedInputClasses.error}`]: {
							[`.${outlinedInputClasses.notchedOutline}`]: {
								borderColor: Colors.Red,
							},
						},
					},
					[`& .${outlinedInputClasses.input}`]: {
						fontSize: '14px',
						padding: '9px 12px',
						lineHeight: '18px',
						height: '18px',
						color: TextColor.Dark,
						[`&::placeholder`]: {
							color: IconsColor.disabled,
							opacity: 1,
						},
						[`&::-webkit-outer-spin-button, &::-webkit-inner-spin-button`]: {
							WebkitAppearance: 'none',
							margin: 0,
						},
						[`&[type=number]`]: {
							MozAppearance: 'textfield',
						},
					},
					[`& .${outlinedInputClasses.notchedOutline}`]: {
						borderColor: Colors.BorderMain,
						borderWidth: 1,
					},
					[`& .${inputBaseClasses.adornedEnd}`]: {
						pr: 0,
					},
				},
				props.sx
			)}
		/>
	)
}
