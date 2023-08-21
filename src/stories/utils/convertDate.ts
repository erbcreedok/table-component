export const convertDate = (date?: Date) => {
	if (date === undefined || !date) return ''

	try {
		const options: any = { year: 'numeric', month: 'short', day: 'numeric' }
		return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
	} catch (error) {
		console.error(error)
		return ''
	}
}
