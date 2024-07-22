let seed = 1

export const random = () => {
	const x = Math.sin(seed++) * 10000

	return x - Math.floor(x)
}

/** The maximum is exclusive and the minimum is inclusive */
export const getRandomInt = (min: number, max: number) => {
	const minCeiled = Math.ceil(min)
	const maxFloored = Math.floor(max)

	return Math.floor(random() * (maxFloored - minCeiled) + minCeiled)
}

export const getRandomItem = (array: readonly any[]) => {
	return array[getRandomInt(0, array.length)]
}
