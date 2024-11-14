import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Tooltip from '@mui/material/Tooltip'
import { debounce } from '@mui/material/utils'
import React, {
	ChangeEvent,
	MouseEvent,
	useCallback,
	useEffect,
	useState,
} from 'react'

import type { TableData, TableInstance } from '..'
import { FilterOptionMenu } from '../menus/FilterOptionMenu'

interface Props<TData = TableData> {
	table: TableInstance<TData>
}

export const GlobalFilterTextField = <TData,>({ table }: Props<TData>) => {
	const {
		getState,
		setGlobalFilter,
		options: {
			enableGlobalFilterModes,
			icons: { SearchIcon, CloseIcon },
			localization,
			manualFiltering,
			muiSearchTextFieldProps,
		},
		refs: { searchInputRef },
	} = table
	const { globalFilter, showGlobalFilter } = getState()

	const textFieldProps =
		muiSearchTextFieldProps instanceof Function
			? muiSearchTextFieldProps({ table })
			: muiSearchTextFieldProps

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
	const [searchValue, setSearchValue] = useState(globalFilter ?? '')

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const handleChangeDebounced = useCallback(
		debounce(
			(event: ChangeEvent<HTMLInputElement>) => {
				setGlobalFilter(event.target.value ?? undefined)
			},
			manualFiltering ? 500 : 250
		),
		[]
	)

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value)
		handleChangeDebounced(event)
	}

	const handleGlobalFilterMenuOpen = (event: MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget)
	}

	const handleClear = useCallback(() => {
		setSearchValue('')
		setGlobalFilter(undefined)
	}, [setGlobalFilter])

	useEffect(() => {
		if (globalFilter === undefined) {
			handleClear()
		}
	}, [globalFilter, handleClear])

	return (
		<Collapse
			in={showGlobalFilter}
			orientation="horizontal"
			unmountOnExit
			mountOnEnter
		>
			<TextField
				placeholder={localization.search}
				onChange={handleChange}
				value={searchValue ?? ''}
				variant="standard"
				InputProps={{
					startAdornment: enableGlobalFilterModes ? (
						<InputAdornment position="start">
							<Tooltip arrow title={localization.changeSearchMode}>
								<IconButton
									aria-label={localization.changeSearchMode}
									onClick={handleGlobalFilterMenuOpen}
									size="small"
									sx={{ height: '1.75rem', width: '1.75rem' }}
								>
									<SearchIcon />
								</IconButton>
							</Tooltip>
						</InputAdornment>
					) : (
						<SearchIcon style={{ marginRight: '4px' }} />
					),
					endAdornment: (
						<InputAdornment position="end">
							<Tooltip arrow title={localization.clearSearch ?? ''}>
								<span>
									<IconButton
										aria-label={localization.clearSearch}
										disabled={!searchValue?.length}
										onClick={handleClear}
										size="small"
									>
										<CloseIcon />
									</IconButton>
								</span>
							</Tooltip>
						</InputAdornment>
					),
				}}
				{...textFieldProps}
				inputRef={(inputRef) => {
					searchInputRef.current = inputRef
					if (textFieldProps?.inputRef) {
						textFieldProps.inputRef = inputRef
					}
				}}
			/>
			<FilterOptionMenu
				anchorEl={anchorEl}
				setAnchorEl={setAnchorEl}
				table={table}
				onSelect={handleClear}
			/>
		</Collapse>
	)
}
