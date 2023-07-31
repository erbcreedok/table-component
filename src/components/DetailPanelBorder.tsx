import { Portal, styled } from '@mui/material'
import React, {
	CSSProperties,
	MutableRefObject,
	useCallback,
	useEffect,
	useState,
} from 'react'
import { useResizeDetector } from 'react-resize-detector'

const BorderSVG = styled('svg')`
	position: absolute;
	pointer-events: none;
`

export const DetailPanelBorder = (props: {
	panelRef?: MutableRefObject<HTMLTableCellElement | null>
	cellRef?: MutableRefObject<HTMLTableCellElement | null>
	tableContainerRef?: MutableRefObject<HTMLDivElement>
}) => {
	const { cellRef, panelRef, tableContainerRef } = props
	const [wrapperStyles, setWrapperStyles] = useState<CSSProperties>({
		width: 0,
		height: 0,
		left: 0,
		bottom: 0,
	})
	const [points, setPoints] = useState<string[]>([])
	const calculatePointsAndBounds = useCallback(() => {
		if (!panelRef?.current || !cellRef?.current || !tableContainerRef?.current)
			return
		const panel = panelRef.current.getBoundingClientRect()
		const cell = cellRef.current.getBoundingClientRect()
		const container = tableContainerRef.current.getBoundingClientRect()
		const topBorderWidth = Math.max(
			parseFloat(getComputedStyle(cellRef.current).borderTopWidth),
			1
		)

		const wrapper = {
			height: cell.height + panel.height,
			top: cell.top - container.top,
			left: panel.left - container.left,
			width: panel.width,
		}

		const leftBound = 1
		const rightBound = wrapper.width - 1
		const topBound = topBorderWidth
		const bottomBound = wrapper.height - 1
		const cellLeftBound = cell.left - panel.left
		const cellRightBound = cellLeftBound + cell.width

		setWrapperStyles({
			height: `${wrapper.height}px`,
			top: `${wrapper.top}px`,
			left: `${wrapper.left}px`,
			width: `${wrapper.width}px`,
		})
		setPoints([
			`${leftBound} ${cell.height}`,
			`${cellLeftBound} ${cell.height}`,
			`${cellLeftBound} ${topBound}`,
			`${cellRightBound} ${topBound}`,
			`${cellRightBound} ${cell.height}`,
			`${rightBound} ${cell.height}`,
			`${rightBound} ${bottomBound}`,
			`${leftBound} ${bottomBound}`,
		])
	}, [cellRef, panelRef, tableContainerRef])

	useResizeDetector({ onResize: calculatePointsAndBounds, targetRef: panelRef })
	useResizeDetector({ onResize: calculatePointsAndBounds, targetRef: cellRef })

	useEffect(() => {
		const observer = new IntersectionObserver(() => {
			calculatePointsAndBounds()
		})
		const panel = panelRef?.current
		if (panel) observer.observe(panel)

		return () => {
			if (panel) observer.unobserve(panel)
		}
	}, [calculatePointsAndBounds, cellRef, panelRef])

	return (
		<Portal container={tableContainerRef?.current}>
			<BorderSVG
				viewBox={`0 0 ${wrapperStyles.width} ${wrapperStyles.height}`}
				xmlns="http://www.w3.org/2000/svg"
				style={wrapperStyles}
			>
				<polygon points={points.join(', ')} fill="none" stroke="#009ECC" />
			</BorderSVG>
		</Portal>
	)
}
