import { styled } from '@mui/material'
import {
	autoUpdate,
	flip,
	shift,
	useClick,
	useDismiss,
	useFloating,
	useInteractions,
} from '@floating-ui/react'
import Box from '@mui/material/Box'
import { isDate } from 'date-fns'
import {
	ComponentProps,
	FC,
	HTMLProps,
	MutableRefObject,
	ReactElement,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react'
import ReactDayPicker from 'react-datepicker'
import { createPortal } from 'react-dom'

import { SimpleEvent } from '../../TableComponent'

import { getRenderCustomHeader } from './getRenderCustomHeader'
import { dayPickerStyles } from './DayPicker.styles'

const DEFAULT_POSITION = 'bottom'

const DayPickerWrapper = styled(Box)`
	${dayPickerStyles}
`

type DateValue = Date | null | undefined
type Value = DateValue
const isArray = Array.isArray

export type DayPickerProps = {
	children(arg: {
		value: Value
		bind: Omit<HTMLProps<any>, 'value' | 'size' | 'onChange'>
		handleSelect: (day: Value, close: boolean) => void
		handleClear(): void
	}): ReactElement
	value?: Value
	maxDate?: Date | null
	minDate?: Date | null
	onChange(arg: SimpleEvent<Value>): void
	onFocus?(): void
	onBlur?(): void
	isDateRange?: boolean
	container?: HTMLElement
	floatingRef?: MutableRefObject<HTMLElement | null>
} & Omit<
	ComponentProps<typeof ReactDayPicker>,
	'value' | 'onFocus' | 'onBlur' | 'onChange'
>

export const DayPicker: FC<DayPickerProps> = ({
	children,
	value,
	onChange,
	isDateRange,
	container,
	floatingRef: uFloatingRef,
	...props
}) => {
	const [mode, setMode] = useState<'month' | 'year'>()
	const [open, setOpen] = useState(false)
	const { onFocus, onBlur } = props

	const handleOpenChange = useCallback(
		(value: boolean) => {
			if (value) {
				onFocus?.()
			}

			setOpen(value)
		},
		[onFocus]
	)

	const {
		x,
		y,
		reference,
		floating,
		strategy,
		context,
		refs: { floating: floatingRef },
	} = useFloating({
		open,
		onOpenChange: handleOpenChange,
		whileElementsMounted: autoUpdate,
		placement: DEFAULT_POSITION,
		middleware: [shift(), flip()],
	})

	const { getReferenceProps, getFloatingProps } = useInteractions([
		useClick(context),
		useDismiss(context),
	])

	useEffect(() => {
		const handler = () => setOpen(false)
		window.addEventListener('scroll', handler, true)

		return () => window.removeEventListener('scroll', handler, true)
	}, [])

	const handleSelect = useCallback(
		(day: Value, close: boolean) => {
			if (isDateRange && isArray(day) && !day?.every((el) => isDate(el))) {
				onChange(new SimpleEvent(day))

				return
			}
			if (['month', 'year'].includes(mode as string)) {
				setMode(undefined)

				return
			}

			setMode(undefined)
			onChange(new SimpleEvent(day))
			if (close) {
				handleOpenChange(false)
			}
		},
		[handleOpenChange, isDateRange, mode, onChange]
	)

	const renderCustomHeader = useMemo(
		() =>
			getRenderCustomHeader({
				setMode,
				mode,
				monthsShown: props.monthsShown,
			}),
		[mode, props.monthsShown]
	)

	const handleInternalSelect = useCallback(
		(day: Value) => {
			handleSelect(day, true)
		},
		[handleSelect]
	)

	const handleReferenceBlur = useCallback(
		(event) => {
			// prevent blur when clicking on the floating element
			if (
				floatingRef.current &&
				floatingRef.current.contains(event.relatedTarget)
			) {
				setTimeout(() => {
					event.target.focus()
				})
				event.stopPropagation()

				return
			}
			onBlur?.()
		},
		[floatingRef, onBlur]
	)

	const defaultContainer = useMemo(() => document.body, [])

	return (
		<>
			{children({
				value,
				handleSelect,
				bind: {
					...getReferenceProps({ ref: reference }),
					onBlur: handleReferenceBlur,
				},
				handleClear: () => handleSelect(undefined, true),
			})}
			{createPortal(
				open && (
					<DayPickerWrapper
						{...getFloatingProps({
							ref: (node) => {
								floating(node)
								if (node && uFloatingRef) {
									uFloatingRef.current = node
								}
							},
							style: {
								position: strategy,
								left: x ?? '',
								top: y ?? '',
								zIndex: 2,
							},
						})}
					>
						<ReactDayPicker
							selectsRange={isDateRange}
							inline
							closeOnScroll
							showFullMonthYearPicker
							renderCustomHeader={renderCustomHeader}
							onChange={(date) =>
								handleInternalSelect(date as Date | undefined)
							}
							selected={isArray(value) ? undefined : value}
							startDate={isArray(value) ? value?.[0] : undefined}
							endDate={isArray(value) ? value?.[1] : undefined}
							calendarStartDay={1}
							yearItemNumber={20}
							showMonthYearPicker={mode === 'month'}
							showYearPicker={mode === 'year'}
							formatWeekDay={(day) => day.substr(0, 3)}
							{...props}
						/>
					</DayPickerWrapper>
				),
				container ?? defaultContainer
			)}
		</>
	)
}
