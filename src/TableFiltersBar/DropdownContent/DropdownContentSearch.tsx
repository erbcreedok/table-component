import React, { FC, useState, SyntheticEvent } from 'react'
import { Divider, IconButton, InputAdornment, TextField } from '@mui/material'
import styled from '@emotion/styled'

import { CloseIcon } from '../../TableToolbar/components/icons/CloseIcon'
import { SearchIcon } from '../../TableToolbar/components/icons/SearchIcon'
import { DEFAULT_FONT_FAMILY, Text } from '../../components/styles'

type DropdownContentSearchProps = {
	isSearchActive: boolean
	searchValue: string
	setIsSearchActive: (value: boolean) => void
	onApplySelectedItems: () => void
	onChange: (value: any) => void
}

const SearchInput = styled(TextField)`
	font-family: ${DEFAULT_FONT_FAMILY};
	padding: 12px;
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
	} = props

	const handleSearchChange = (e: any) => {
		e.preventDefault()

		onChange(e.target.value.toLowerCase())
	}

	const handleClearCLick = (e: SyntheticEvent) => {
		e.stopPropagation()

		onChange('')
		setIsSearchActive(false)
		onApplySelectedItems()
	}

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
				onClick={() => setIsSearchActive(true)}
			/>
			<Divider />
		</>
	)
}
