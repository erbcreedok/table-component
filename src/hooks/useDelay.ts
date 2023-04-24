import { useEffect, useState } from 'react'

export const useDelay = <T>(value: T, delay = 250): T => {
	const [delayValue, setDelayValue] = useState<T>(value)

	useEffect(() => {
		const handler = setTimeout(() => {
			setDelayValue(value)
		}, delay)

		return (): void => {
			clearTimeout(handler)
		}
	}, [value, delay])

	return delayValue
}
