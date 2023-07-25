import { useState, useEffect } from 'react'

export type StickyType = {
	id: number | string
	element: HTMLTableRowElement
	order: number | string
}

export type StickyElement = StickyType & {
	top: number
}

export const useMultiSticky = () => {
	const [originalSticky, setOriginalSticky] = useState<StickyType[]>([])
	const [stickyElements, setStickyElements] = useState<StickyElement[]>([])

	const getTop = (prevEl: HTMLTableRowElement, prevTop: number) => {
		return prevEl.clientHeight + prevTop
	}

	const calculateTop = () => {
		const sortedStickyByNumberFirst = [...originalSticky].sort((a, b) => {
			if (b.order === 'last') {
				return -1
			}

			if (typeof a.order === 'number' && typeof b.order === 'number') {
				return a.order - b.order
			}

			return 0
		})

		const result = sortedStickyByNumberFirst.reduce(
			(res: StickyElement[], current: StickyType, index: number) => {
				const stickyWithTop = {
					...current,
					top:
						index === 0
							? 0
							: getTop(res?.[index - 1]?.element, res?.[index - 1]?.top),
				}

				return [...res, stickyWithTop]
			},
			[]
		)

		setStickyElements(result)
	}

	const registerSticky = (
		el: HTMLTableRowElement,
		id: number | string,
		order: number | string
	) => {
		if (el && !originalSticky.find((sticky) => sticky.id === id)) {
			setOriginalSticky([...originalSticky, { id, order, element: el }])
		}
	}

	useEffect(() => {
		calculateTop()
	}, [originalSticky])

	return {
		registerSticky,
		stickyElements,
	}
}
