export const subtractMonth = (months: number) => {
	const newDate = new Date()
	newDate.setMonth(newDate.getMonth() - months)

	return newDate
}
