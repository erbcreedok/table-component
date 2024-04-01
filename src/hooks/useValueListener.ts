import { useEffect } from 'react'

export type Cleanup = () => void
export type StateListener<T = any> = (item: T) => void | Cleanup
export const useValueListener = <T = any>(
	value: T,
	listener: StateListener<T>
) => {
	useEffect(() => {
		return listener(value)
	}, [value, listener])
}
