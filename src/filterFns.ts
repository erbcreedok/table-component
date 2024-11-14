import { RankingInfo, rankings, rankItem } from '@tanstack/match-sorter-utils'
import { filterFns, Row } from '@tanstack/react-table'

const fuzzy = <TData>(
	row: Row<TData>,
	columnId: string,
	filterValue: string | number,
	addMeta: (item: RankingInfo) => void
) => {
	const itemRank = rankItem(row.getValue(columnId), filterValue as string, {
		threshold: rankings.MATCHES,
	})
	addMeta(itemRank)

	return itemRank.passed
}

fuzzy.autoRemove = (val: any) => !val

const contains = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	row
		.getValue<string | number>(id)
		.toString()
		.toLowerCase()
		.trim()
		.includes(filterValue.toString().toLowerCase().trim())

contains.autoRemove = (val: any) => !val

const startsWith = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	row
		.getValue<string | number>(id)
		.toString()
		.toLowerCase()
		.trim()
		.startsWith(filterValue.toString().toLowerCase().trim())

startsWith.autoRemove = (val: any) => !val

const endsWith = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	row
		.getValue<string | number>(id)
		.toString()
		.toLowerCase()
		.trim()
		.endsWith(filterValue.toString().toLowerCase().trim())

endsWith.autoRemove = (val: any) => !val

const equals = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	row.getValue<string | number>(id).toString().toLowerCase().trim() ===
	filterValue.toString().toLowerCase().trim()

equals.autoRemove = (val: any) => !val

const notEquals = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	row.getValue<string | number>(id).toString().toLowerCase().trim() !==
	filterValue.toString().toLowerCase().trim()

notEquals.autoRemove = (val: any) => !val

const greaterThan = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	!Number.isNaN(+filterValue) &&
	!Number.isNaN(+row.getValue<string | number>(id))
		? +row.getValue<string | number>(id) > +filterValue
		: row.getValue<string | number>(id).toString().toLowerCase().trim() >
		  filterValue.toString().toLowerCase().trim()

greaterThan.autoRemove = (val: any) => !val

const greaterThanOrEqualTo = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) => equals(row, id, filterValue) || greaterThan(row, id, filterValue)

greaterThanOrEqualTo.autoRemove = (val: any) => !val

const lessThan = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) =>
	!Number.isNaN(+filterValue) &&
	!Number.isNaN(+row.getValue<string | number>(id))
		? +row.getValue<string | number>(id) < +filterValue
		: row.getValue<string | number>(id).toString().toLowerCase().trim() <
		  filterValue.toString().toLowerCase().trim()

lessThan.autoRemove = (val: any) => !val

const lessThanOrEqualTo = <TData>(
	row: Row<TData>,
	id: string,
	filterValue: string | number
) => equals(row, id, filterValue) || lessThan(row, id, filterValue)

lessThanOrEqualTo.autoRemove = (val: any) => !val

const between = <TData>(
	row: Row<TData>,
	id: string,
	filterValues: [string | number, string | number]
) =>
	((['', undefined] as any[]).includes(filterValues[0]) ||
		greaterThan(row, id, filterValues[0])) &&
	((!Number.isNaN(+filterValues[0]) &&
		!Number.isNaN(+filterValues[1]) &&
		+filterValues[0] > +filterValues[1]) ||
		(['', undefined] as any[]).includes(filterValues[1]) ||
		lessThan(row, id, filterValues[1]))

between.autoRemove = (val: any) => !val

const betweenInclusive = <TData>(
	row: Row<TData>,
	id: string,
	filterValues: [string | number, string | number]
) =>
	((['', undefined] as any[]).includes(filterValues[0]) ||
		greaterThanOrEqualTo(row, id, filterValues[0])) &&
	((!Number.isNaN(+filterValues[0]) &&
		!Number.isNaN(+filterValues[1]) &&
		+filterValues[0] > +filterValues[1]) ||
		(['', undefined] as any[]).includes(filterValues[1]) ||
		lessThanOrEqualTo(row, id, filterValues[1]))

betweenInclusive.autoRemove = (val: any) => !val

const empty = <TData>(
	row: Row<TData>,
	id: string,
	_filterValue: string | number
) => !row.getValue<string | number>(id).toString().trim()

empty.autoRemove = (val: any) => !val

const notEmpty = <TData>(
	row: Row<TData>,
	id: string,
	_filterValue: string | number
) => !!row.getValue<string | number>(id).toString().trim()

notEmpty.autoRemove = (val: any) => !val

const arrIncludesSome = <TData>(
	row: Row<TData>,
	columnId: string,
	filterValue: unknown[]
) => {
	if (!filterValue || !filterValue.length) return true

	return filterValue.some((val) => {
		const value = row.getValue<unknown[]>(columnId)

		if (typeof value === 'string' || Array.isArray(value)) {
			return value.includes(val) || value === val
		}

		return value === val
	})
}
arrIncludesSome.autoRemove = filterFns.arrIncludesSome.autoRemove

export const Table_FilterFns = {
	...filterFns,
	between,
	betweenInclusive,
	contains,
	empty,
	endsWith,
	equals,
	fuzzy,
	greaterThan,
	greaterThanOrEqualTo,
	lessThan,
	lessThanOrEqualTo,
	notEmpty,
	notEquals,
	startsWith,
	arrIncludesSome,
}
