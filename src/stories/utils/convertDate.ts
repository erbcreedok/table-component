export const convertDate = (
	date?: Date,
	dateTimeFormatOptions?: Record<string, string>
) => {
	if (date === undefined || !date) return ''

	try {
		const options: Record<string, string> = {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			...dateTimeFormatOptions,
		}
		return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
	} catch (error) {
		console.error(error)
		return ''
	}
}
