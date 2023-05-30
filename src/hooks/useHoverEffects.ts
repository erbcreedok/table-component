import { useState } from 'react'

export const useHoverEffects = () => {
	const [hovered, setHovered] = useState(false)

	const hoverProps = {
		onMouseEnter: () => setHovered(true),
		onMouseLeave: () => setTimeout(() => setHovered(false)),
	}

	return {
		hovered,
		hoverProps,
	}
}
