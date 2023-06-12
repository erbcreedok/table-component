import React from 'react'

import { TableInstance, Table_SortingFn } from '../TableComponent'

export const isNumericSorting = <TData extends Record<string, any> = {}>(
	sortingFn: Table_SortingFn<TData> | Table_SortingFn
) => {
	const sortingFnName =
		typeof sortingFn === 'function' ? sortingFn.name : sortingFn

	return [
		'alphanumeric',
		'alphanumericCaseSensitive',
		'datetime',
		'basic',
	].includes(sortingFnName)
}

export const isTextSorting = <TData extends Record<string, any> = {}>(
	sortingFn: Table_SortingFn<TData> | Table_SortingFn
) => {
	const sortingFnName =
		typeof sortingFn === 'function' ? sortingFn.name : sortingFn

	return ['text', 'textCaseSensitive'].includes(sortingFnName)
}

export const getSortingIconConstructor = <
	TData extends Record<string, any> = {}
>({
	sortingFn,
	table,
	isAsc,
}: {
	table: TableInstance
	isAsc: boolean
	sortingFn: Table_SortingFn<TData> | Table_SortingFn
}) => {
	const {
		options: {
			icons: {
				AscIcon,
				DescIcon,
				AscNumIcon,
				DescNumIcon,
				AscTextIcon,
				DescTextIcon,
			},
		},
	} = table

	if (isNumericSorting(sortingFn)) {
		return isAsc ? AscNumIcon : DescNumIcon
	}

	if (isTextSorting(sortingFn)) {
		return isAsc ? AscTextIcon : DescTextIcon
	}

	return isAsc ? AscIcon : DescIcon
}

export const getSortingIcon = <TData extends Record<string, any> = {}>({
	table,
	sortingFn,
	isAsc,
	sortingIconProps = {},
}: {
	table: TableInstance
	sortingFn: Table_SortingFn<TData>
	isAsc: boolean
	sortingIconProps?: any
}) => {
	const SortingIcon = getSortingIconConstructor({ sortingFn, isAsc, table })

	return <SortingIcon {...sortingIconProps} />
}

export const getSortingText = <TData extends Record<string, any> = {}>({
	table,
	sortingFn,
	isAsc,
	withSortWord = true,
}: {
	table: TableInstance
	sortingFn: Table_SortingFn<TData>
	isAsc: boolean
	withSortWord?: boolean
}) => {
	const {
		options: { localization },
	} = table
	let sortTypeText = isAsc ? localization.firstLast : localization.lastFirst

	if (isNumericSorting(sortingFn)) {
		sortTypeText = isAsc ? localization.ascending : localization.descending
	}

	if (isTextSorting(sortingFn)) {
		sortTypeText = isAsc ? localization.AZ : localization.ZA
	}

	return `${withSortWord ? `${localization.showSorting} ` : ''}${sortTypeText}`
}
