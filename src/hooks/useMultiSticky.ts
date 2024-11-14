import { useCallback, useEffect, useState } from 'react'

import { useTableContext } from '../context/useTableContext'

export type StickyType = {
	id: number | string
	element: HTMLTableRowElement
	order: number | string
}

export type StickyElement = StickyType & {
	top: number
}

/**
 * @deprecated
 * Refactor HeaderRows into separate component and create it one time for the whole table
 * Maybe in hierarchy these rows could be cloned (cloneNode) each time they appear.
 */
export const useMultiSticky = () => {
	const { table } = useTableContext()
	const { setStickyHeadersHeight } = table

	const [originalSticky, setOriginalSticky] = useState<StickyType[]>([])
	const [stickyElements, setStickyElements] = useState<StickyElement[]>([])

	const getTop = (prevEl: HTMLTableRowElement, prevTop: number) => {
		return prevEl.clientHeight + prevTop
	}

	const calculateTop = () => {
		let stickyHeadersHeight = 0

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

				stickyHeadersHeight += current.element.clientHeight

				return [...res, stickyWithTop]
			},
			[]
		)

		setStickyElements(result)
		setStickyHeadersHeight(stickyHeadersHeight)
	}

	const registerSticky = useCallback(
		(el: HTMLTableRowElement, id: number | string, order: number | string) => {
			if (el && !originalSticky.find((sticky) => sticky.id === id)) {
				setOriginalSticky([...originalSticky, { id, order, element: el }])
			}
		},
		[originalSticky]
	)

	useEffect(() => {
		calculateTop()
	}, [originalSticky])

	return {
		registerSticky,
		stickyElements,
	}
}
