import {
	Divider,
	IconButton,
	InputAdornment,
	styled,
	TextField,
} from '@mui/material'
import {
	ComponentProps,
	MouseEvent,
	SyntheticEvent,
	useEffect,
	useState,
} from 'react'

import { CloseIcon } from '../icons/CloseIcon'
import { SearchIcon } from '../icons/SearchIcon'

import { DEFAULT_FONT_FAMILY, TextColor } from './styles'

const StyledSearch = styled(TextField)`
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

type DeprecatedProps = {
	onChange(value: string): void
	onClear?(event: MouseEvent<HTMLElement>): void
	dividerProps?: ComponentProps<typeof Divider>
	reset?: boolean
} & Omit<ComponentProps<typeof StyledSearch>, 'onChange'>

/** @deprecated use SidebarSearch */
export const SidebarSearchComponent = ({
	dividerProps,
	reset,
	onChange,
	onClear,
	...rest
}: DeprecatedProps) => {
	const [input, setInput] = useState<string>('')

	const handleInputChange: OnChange = (event, value) => {
		event.preventDefault()
		setInput(value.toLowerCase())
		onChange(value.toLowerCase())
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
				value={input}
				onChange={handleInputChange}
				onClear={handleClearCLick}
				{...rest}
			/>
			<Divider {...dividerProps} />
		</>
	)
}

type OnChange = (event: SyntheticEvent, value: string) => void

type Props = {
	onChange?: OnChange
	onValueChange?: (value: string) => void
	/** @deprecated */
	onClear?: (event: MouseEvent<HTMLElement>) => void
} & Omit<ComponentProps<typeof StyledSearch>, 'onChange'>

export const SidebarSearch = ({
	value,
	onValueChange,
	onChange,
	onClear,
	...rest
}: Props) => {
	return (
		<StyledSearch
			placeholder="Search"
			InputProps={{
				startAdornment: (
					<InputAdornment position="start">
						<SearchIcon />
					</InputAdornment>
				),
				endAdornment: (
					<InputAdornment position="end">
						{value && (
							<IconButton
								onClick={(e) => {
									onChange?.(e, '')
									onValueChange?.('')
									onClear?.(e)
								}}
								disableRipple
							>
								<CloseIcon style={{ width: 18, height: 18 }} />
							</IconButton>
						)}
					</InputAdornment>
				),
			}}
			value={value}
			onChange={(e) => {
				onChange?.(e, e.target.value)
				onValueChange?.(e.target.value)
			}}
			{...rest}
		/>
	)
}
