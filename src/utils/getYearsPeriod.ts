import { getYear } from 'date-fns'

export const getYearsPeriod = (date: Date, yearItemNumber = 20) => {
	const endPeriod = Math.ceil(getYear(date) / yearItemNumber) * yearItemNumber
	const startPeriod = endPeriod - (yearItemNumber - 1)

	return { startPeriod, endPeriod }
}
