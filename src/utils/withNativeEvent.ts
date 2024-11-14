import { MouseEvent } from 'react'

import { NativeEventArgs, TableInstance } from '../TableComponent'

export const withNativeEvent =
	<E = MouseEvent<HTMLElement>, TData = {}>(
		args: Omit<NativeEventArgs, 'event'>,
		table: TableInstance | TableInstance<TData>
	) =>
	(callback?: (event: E) => void) =>
	(event: E) => {
		const {
			options: { onNativeEvent },
		} = table

		onNativeEvent?.({
			...args,
			[typeof event === 'string' ? 'value' : 'event']: event,
		})
		callback?.(event)
	}
