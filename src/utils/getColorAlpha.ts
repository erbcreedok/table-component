type HEX = `#${string}`
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`
export const getColorAlpha = (color: HEX, alpha: number): RGBA => {
	const r = parseInt(color.substring(1, 3), 16)
	const g = parseInt(color.substring(3, 5), 16)
	const b = parseInt(color.substring(5, 7), 16)

	return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
