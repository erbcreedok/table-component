import { useCallback, useEffect, useRef } from 'react'

interface Props {
	enabled: boolean
	onHorizontalScrollbarHeight: (height: number) => void
	parent?: HTMLElement | null
}

export const useStickyScrollbar = ({
	enabled,
	onHorizontalScrollbarHeight,
	parent,
}: Props) => {
	const parentRef = useRef<HTMLElement | null | undefined>()
	const containerRef = useRef<HTMLDivElement | null>(null)
	const scrollbarRef = useRef<HTMLDivElement | null>(null)
	const fakeContentRef = useRef<HTMLElement | undefined>()
	const destructorsRef = useRef<{
		containerScroll?: Destructor
		containerResizeObserver?: Destructor
		scrollbarScroll?: Destructor
	}>({})

	// Show the virtual scrollbar when the container's scrollbar is out of view.
	const handleScrollbarVisibility = useCallback(() => {
		const parent = parentRef.current
		const scrollbar = scrollbarRef.current

		if (!scrollbar) return

		const height = parent ? parent.clientHeight : window.innerHeight

		const { top, bottom } = containerRef.current?.getBoundingClientRect() ?? {
			top: 0,
			bottom: 0,
		}
		scrollbar.classList.toggle('visible', top < height && bottom >= height)
	}, [])

	useEffect(() => {
		parentRef.current = parent
		;(parent ?? document).addEventListener('scroll', handleScrollbarVisibility)

		return () =>
			(parent ?? document).removeEventListener(
				'scroll',
				handleScrollbarVisibility
			)
	}, [handleScrollbarVisibility, parent])

	const handleScrollbarRef = useCallback(
		(scrollbar: HTMLDivElement | null) => {
			destructorsRef.current.scrollbarScroll?.()

			if (enabled && scrollbar) {
				// Scroll the container by the virtual scrollbar.
				let lastScrollLeft: number
				const handleScrollbarScroll = () => {
					if (scrollbar.scrollLeft === lastScrollLeft) return
					lastScrollLeft = scrollbar.scrollLeft
					if (containerRef.current) {
						containerRef.current.scrollLeft = lastScrollLeft
					}
				}
				scrollbar.addEventListener('scroll', handleScrollbarScroll)
				destructorsRef.current.scrollbarScroll = () => {
					scrollbar.removeEventListener('scroll', handleScrollbarScroll)
				}
			}

			fakeContentRef.current = scrollbar?.firstElementChild as HTMLElement
			scrollbarRef.current = scrollbar
		},
		[enabled]
	)

	const handleContainerRef = useCallback(
		(container: HTMLDivElement | null) => {
			destructorsRef.current.containerScroll?.()
			destructorsRef.current.containerResizeObserver?.()

			if (enabled && container) {
				// Scroll the virtual scrollbar by the container.
				{
					let lastScrollLeft: number
					const handleContainerScroll = () => {
						if (container.scrollLeft === lastScrollLeft) return
						lastScrollLeft = container.scrollLeft
						if (scrollbarRef.current) {
							scrollbarRef.current.scrollLeft = lastScrollLeft
						}
					}
					container.addEventListener('scroll', handleContainerScroll)
					destructorsRef.current.containerScroll = () => {
						container.removeEventListener('scroll', handleContainerScroll)
					}
				}

				// If the container's resizing occurs or on initial calculation.
				{
					const observer = new ResizeObserver(() => {
						if (scrollbarRef.current) {
							// Resize the virtual scrollbar width to match the container's scrollbar width in case of vertical scrollbar presence.
							scrollbarRef.current.style.width = `${container.clientWidth}px`
						}
						if (fakeContentRef.current) {
							// Resize the virtual scrollbar size to match the container's scrollbar size.
							fakeContentRef.current.style.width = `${container.scrollWidth}px`
						}
						handleScrollbarVisibility()
						onHorizontalScrollbarHeight(
							container.offsetHeight - container.clientHeight
						)
					})
					observer.observe(container)
					destructorsRef.current.containerResizeObserver = () => {
						observer.disconnect()
					}
				}
			}

			containerRef.current = container
		},
		[enabled, handleScrollbarVisibility, onHorizontalScrollbarHeight]
	)

	useEffect(() => {
		if (scrollbarRef.current) {
			handleScrollbarRef(scrollbarRef.current)
		}
		if (containerRef.current) {
			handleContainerRef(containerRef.current)
		}
		if (!enabled) {
			scrollbarRef.current?.classList.toggle('visible', false)
			onHorizontalScrollbarHeight(0)
		}
	}, [
		enabled,
		handleContainerRef,
		handleScrollbarRef,
		onHorizontalScrollbarHeight,
	])

	return {
		handleContainerRef,
		handleScrollbarRef,
	}
}

type Destructor = () => void
