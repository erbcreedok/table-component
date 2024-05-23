export const sumAnyTwoValues = (a: any, b: any) => {
	const numberA = Number(a)
	const numberB = Number(b)

	if (Number.isNaN(numberA) || Number.isNaN(numberB)) return a

	return numberA + numberB
}
