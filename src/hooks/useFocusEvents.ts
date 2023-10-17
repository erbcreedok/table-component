import { FocusEventHandler, useCallback, useState } from 'react'

export const useFocusEvents = <
	E extends HTMLElement = HTMLInputElement
>(props?: {
	onFocus?: FocusEventHandler<E>
	onBlur?: FocusEventHandler<E>
}) => {
	const [focused, setFocused] = useState(false)
	const { onFocus, onBlur } = props ?? {}

	const focusProps = {
		handleFocus: useCallback<FocusEventHandler<E>>(
			(...args) => {
				setFocused(true)
				onFocus?.(...args)
			},
			[onFocus]
		),
		handleBlur: useCallback<FocusEventHandler<E>>(
			(...args) => {
				setFocused(false)
				onBlur?.(...args)
			},
			[onBlur]
		),
	}

	return {
		focused,
		focusProps,
	}
}
