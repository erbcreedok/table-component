import styled from '@emotion/styled'
import { Divider, TextField, InputAdornment, IconButton } from '@mui/material'
import React, { useState } from 'react'

import { SearchIcon } from '../../icons/SearchIcon'
import { CloseIcon } from '../../icons/CloseIcon'
import { DEFAULT_FONT_FAMILY, Text } from '../../../../components/styles'

const SidebarSearch = styled(TextField)`
	font-family: ${DEFAULT_FONT_FAMILY};
	padding: 15px 22px;
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

type Props = {
	onChange(value: string): void
}

export const SidebarSearchComponent = ({ onChange }: Props) => {
	const [value, setValue] = useState<string>('')

	const handleInputChange = (e) => {
		e.preventDefault()
		setValue(e.target.value.toLowerCase())
		onChange(e.target.value.toLowerCase())
	}

	const handleClearCLick = () => {
		setValue('')
		onChange('')
	}

	return (
		<>
			<SidebarSearch
				placeholder="Search"
				InputProps={{
					startAdornment: (
						<InputAdornment position="start">
							<SearchIcon />
						</InputAdornment>
					),
					endAdornment: (
						<InputAdornment position="end">
							{value.length > 0 && (
								<IconButton onClick={handleClearCLick} disableRipple>
									<CloseIcon style={{ width: 18, height: 18 }} />
								</IconButton>
							)}
						</InputAdornment>
					),
				}}
				value={value}
				onChange={handleInputChange}
			/>
			<Divider />
		</>
	)
}
