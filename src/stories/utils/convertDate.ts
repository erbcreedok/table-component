export const convertDate = (date?: Date) =>{
	if (date === undefined) return ''

	const options: any = { year: 'numeric', month: 'short', day: 'numeric' }
	return new Intl.DateTimeFormat('en-US', options).format(new Date(date))
}
