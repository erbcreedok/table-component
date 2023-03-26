import React from 'react'
import IconButton from '@mui/material/IconButton'
import type { IconButtonProps } from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import type { TableInstance } from '..'

interface Props<TData extends Record<string, any> = {}>
	extends IconButtonProps {
	table: TableInstance<TData>
}

export const ToggleGlobalFilterButton = <
	TData extends Record<string, any> = {}
>({
	table,
	...rest
}: Props<TData>) => {
	const {
		getState,
		options: {
			icons: { SearchIcon, SearchOffIcon },

			localization,
		},
		refs: { searchInputRef },
		setShowGlobalFilter,
	} = table
	const { globalFilter, showGlobalFilter } = getState()

	const handleToggleSearch = () => {
		setShowGlobalFilter(!showGlobalFilter)
		queueMicrotask(() => searchInputRef.current?.focus())
	}

	return (
		<Tooltip arrow title={rest?.title ?? localization.showHideSearch}>
			<IconButton
				disabled={!!globalFilter}
				onClick={handleToggleSearch}
				{...rest}
				title={undefined}
			>
				{showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />}
			</IconButton>
		</Tooltip>
	)
}
