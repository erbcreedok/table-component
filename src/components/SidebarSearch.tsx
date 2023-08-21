import {
	styled,
	Divider,
	TextField,
	InputAdornment,
	IconButton,
} from '@mui/material'
import React, { ComponentProps, useEffect, useState, MouseEvent } from 'react'

import { CloseIcon } from '../icons/CloseIcon'
import { SearchIcon } from '../icons/SearchIcon'

import { DEFAULT_FONT_FAMILY, TextColor } from './styles'

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
		color: ${TextColor.Primary};
	}
`

type Props = {
	onChange(value: string): void
	onClear?(event: MouseEvent<HTMLElement>): void
	dividerProps?: ComponentProps<typeof Divider>
	reset?: boolean
} & Omit<ComponentProps<typeof SidebarSearch>, 'onChange'>

export const SidebarSearchComponent = ({
	dividerProps,
	reset,
	onChange,
	onClear,
	...rest
}: Props) => {
	const [input, setInput] = useState<string>('')

	const handleInputChange = (e) => {
		e.preventDefault()
		setInput(e.target.value.toLowerCase())
		onChange(e.target.value.toLowerCase())
	}

	const handleClearCLick = (event: MouseEvent<HTMLElement>) => {
		setInput('')
		onChange('')
		onClear?.(event)
	}

	useEffect(() => {
		if (reset) {
			setInput('')
		}
	}, [reset])

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
							{input.length > 0 && (
								<IconButton onClick={handleClearCLick} disableRipple>
									<CloseIcon style={{ width: 18, height: 18 }} />
								</IconButton>
							)}
						</InputAdornment>
					),
				}}
				value={input}
				onChange={handleInputChange}
				{...rest}
			/>
			<Divider {...dividerProps} />
		</>
	)
}
