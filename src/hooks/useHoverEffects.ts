import { useRef, useState } from 'react'

export const useHoverEffects = (delay?: number) => {
	const [hovered, setHovered] = useState(false)
	const ref = useRef<ReturnType<typeof setTimeout>>()

	const hoverProps = {
		onMouseEnter: () => {
			if (ref.current) clearTimeout(ref.current)
			setHovered(true)
		},
		onMouseLeave: () => {
			ref.current = setTimeout(() => setHovered(false), delay)
		},
	}

	return {
		hovered,
		hoverProps,
	}
}
