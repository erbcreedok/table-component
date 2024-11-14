import { DependencyList, SyntheticEvent, useCallback } from 'react'

export const withStopPropagation =
	<E extends SyntheticEvent = SyntheticEvent, R = void>(
		callback?: (event: E) => R
	) =>
	(event: E) => {
		event.stopPropagation()

		return callback?.(event)
	}

export const useStopPropagation = <
	E extends SyntheticEvent = SyntheticEvent,
	R = void
>(
	callback: ((event: E) => R) | undefined,
	deps: DependencyList
) => useCallback(withStopPropagation(callback), deps)

export const handleStopPropagation = (e: SyntheticEvent) => {
	e.stopPropagation()
}
