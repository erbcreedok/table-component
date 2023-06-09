import React, { FC, useEffect, SyntheticEvent } from 'react'
import {
	Divider,
	IconButton,
	InputAdornment,
	TextField,
	styled,
} from '@mui/material'

import { CloseIcon } from '../../icons/CloseIcon'
import { SearchIcon } from '../../icons/SearchIcon'
import { DEFAULT_FONT_FAMILY, Text } from '../../components/styles'

type DropdownContentSearchProps = {
	isSearchActive: boolean
	searchValue: string
	setIsSearchActive: (value: boolean) => void
	onApplySelectedItems: () => void
	onChange: (value: any) => void
	onClick?: () => void
}

const SearchInput = styled(TextField)`
	font-family: ${DEFAULT_FONT_FAMILY};
	padding: 12px;
	padding-left: 7px;
	padding-right: 0;
	width: 100%;
	box-sizing: border-box;
	& > div {
		padding-left: 5px;
	}
	& fieldset {
		border: none;
	}
	& input {
		padding: 0;
		font-family: ${DEFAULT_FONT_FAMILY};
		font-size: 14px;
		line-height: 18px;
		color: ${Text.Primary};
	}
`

export const DropdownContentSearch: FC<DropdownContentSearchProps> = (
	props
) => {
	const {
		searchValue,
		isSearchActive,
		setIsSearchActive,
		onApplySelectedItems,
		onChange,
		onClick = () => {},
	} = props

	const handleSearchChange = (e: any) => {
		e.preventDefault()

		onChange(e.target.value.toLowerCase())
	}

	const handleClearCLick = (e: SyntheticEvent) => {
		e.stopPropagation()

		onChange('')
		setIsSearchActive?.(false)
		onApplySelectedItems()
	}

	useEffect(() => {
		setIsSearchActive?.(Boolean(searchValue?.length))
	}, [searchValue])

	return (
		<>
			<Divider />
			<SearchInput
				placeholder="Search"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
					endAdornment: (
						<>
							{isSearchActive && (
								<InputAdornment position="end" style={{ marginRight: -10 }}>
									<IconButton onClick={handleClearCLick} disableRipple>
										<CloseIcon style={{ width: 18, height: 18 }} />
									</IconButton>
								</InputAdornment>
							)}
						</>
					),
				}}
				value={searchValue}
				onChange={handleSearchChange}
				onClick={onClick}
			/>
			<Divider />
		</>
	)
}
