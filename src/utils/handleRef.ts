import { isFunction } from '@tanstack/table-core'
import { ForwardedRef } from 'react'

export const handleRef =
	<T>(ref?: ForwardedRef<T>) =>
	(node: T) => {
		if (isFunction(ref)) {
			ref(node)
		} else if (ref) {
			ref.current = node
		}
	}
