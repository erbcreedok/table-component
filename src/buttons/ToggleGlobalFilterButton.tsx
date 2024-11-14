import type { IconButtonProps } from '@mui/material/IconButton'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import React from 'react'

import type { TableData, TableInstance } from '..'

interface Props<TData = TableData> extends IconButtonProps {
	table: TableInstance<TData>
}

export const ToggleGlobalFilterButton = <TData,>({
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
