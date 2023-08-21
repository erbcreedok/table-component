import { TextFieldProps } from '@mui/material/TextField'
import React, { FC, MouseEventHandler } from 'react'
import {
	Divider,
	IconButton,
	InputAdornment,
	TextField,
	styled,
} from '@mui/material'

import { CloseIcon } from '../../icons/CloseIcon'
import { SearchIcon } from '../../icons/SearchIcon'
import { DEFAULT_FONT_FAMILY, TextColor } from '../styles'

const SearchInput = styled(TextField)`
	font-family: ${DEFAULT_FONT_FAMILY};
	padding: 12px 0 12px 7px;
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
		color: ${TextColor.Primary};
	}
`

type DropdownContentSearchProps = {
	isSearchActive: boolean
	onClearClick?: MouseEventHandler<HTMLButtonElement>
	setIsSearchActive?: (value: boolean) => void
	onChange?: (value: string) => void
} & Omit<TextFieldProps, 'onChange'>

export const DropdownContentSearch: FC<DropdownContentSearchProps> = (
	props
) => {
	const {
		onClearClick,
		isSearchActive,
		setIsSearchActive,
		onClick,
		onChange,
		...rest
	} = props

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
									<IconButton
										onClick={(e) => {
											e.stopPropagation()
											setIsSearchActive?.(false)
											onChange?.('')
											onClearClick?.(e)
										}}
										disableRipple
									>
										<CloseIcon style={{ width: 18, height: 18 }} />
									</IconButton>
								</InputAdornment>
							)}
						</>
					),
				}}
				onChange={(e) => {
					setIsSearchActive?.(!!e.target.value.length)
					onChange?.(e.target.value)
				}}
				onClick={(e) => {
					setIsSearchActive?.(true)
					onClick?.(e)
				}}
				{...rest}
			/>
			<Divider />
		</>
	)
}
