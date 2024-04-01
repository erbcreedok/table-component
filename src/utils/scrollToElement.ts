export const scrollToElement = (
	el: HTMLElement,
	tableContainer: HTMLDivElement
) => {
	const rect = el.getBoundingClientRect()
	const x =
		rect?.left + tableContainer.scrollLeft - tableContainer.clientWidth / 2
	tableContainer.scrollTo({
		left: x,
		behavior: 'smooth',
	})
}
