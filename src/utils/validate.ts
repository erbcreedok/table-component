import { NumericColumn, Table_ColumnDef, TableData } from '../TableComponent'

import { isNumeric } from './numeric'

type Validator<TData = TableData> = Exclude<
	Table_ColumnDef<TData>['validator'],
	undefined
>

export const validateValue = ({
	value,
	cell: {
		column: { columnDef },
	},
	table: {
		options: { localization },
	},
}: Parameters<Validator>[0]): ReturnType<Validator> => {
	if (value === undefined || value === '') return true

	const { dataType, minValue, maxValue } = columnDef

	if (dataType === 'numeric' || dataType === 'percent') {
		if (!isNumeric(value)) return localization.notNumeric

		const numer = Number(value)

		if (minValue !== undefined && numer < minValue)
			return localization.smallerThanMinValue.replace(
				'{minValue}',
				String(minValue)
			)

		if (maxValue !== undefined && numer > maxValue)
			return localization.biggerThanMaxValue.replace(
				'{maxValue}',
				String(maxValue)
			)

		const { decimalPlaces } = columnDef as NumericColumn

		if (decimalPlaces !== undefined) {
			const string = String(value)
			const start = string.indexOf('.')
			const end = string.length - 1

			if (start >= 0 && end - start > decimalPlaces)
				return localization.exceedsDecimalPlaces.replace(
					'{decimalPlaces}',
					String(decimalPlaces)
				)
		}
	}

	return true
}
