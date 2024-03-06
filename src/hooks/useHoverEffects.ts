import { useEffect, useRef, useState } from 'react'

export const useHoverEffects = (delay?: number) => {
	const [hovered, setHovered] = useState(false)
	const ref = useRef<ReturnType<typeof setTimeout>>()

	const hoverProps = {
		onMouseEnter: () => {
			if (ref.current) clearTimeout(ref.current)
			setHovered(true)
		},
		onMouseLeave: () => {
			ref.current = setTimeout(() => {
				if (!ref.current) return

				ref.current = undefined
				setHovered(false)
			}, delay)
		},
	}

	useEffect(() => () => {
		ref.current = undefined
	})

	return {
		hovered,
		hoverProps,
	}
}
