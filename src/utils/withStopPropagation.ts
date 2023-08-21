import { MouseEvent } from 'react'

export const withStopPropagation =
	<T>(cb?: (e: MouseEvent) => T) =>
	(e: MouseEvent) => {
		e.persist()
		e.stopPropagation()

		return cb?.(e)
	}
