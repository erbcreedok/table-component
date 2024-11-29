import { inputBaseClasses, outlinedInputClasses, SxProps } from '@mui/material'

import { Colors, IconsColor, TextColor } from '../../components'

export const inputSx = {
	my: '6px',
	backgroundColor: '#FFFFFF',
	borderRadius: '6px',
	[`& .${outlinedInputClasses.root}`]: {
		borderRadius: '6px',
		[`&:not(.${outlinedInputClasses.focused}):not(.${outlinedInputClasses.disabled}):not(.${outlinedInputClasses.error}):hover`]:
			{
				[`& .${outlinedInputClasses.notchedOutline}`]: {
					borderColor: Colors.Gray40,
					borderWidth: 1,
				},
			},
		[`&.${outlinedInputClasses.disabled}`]: {
			backgroundColor: Colors.LightestGray,
			[`.${outlinedInputClasses.notchedOutline}`]: {
				borderColor: Colors.Gray20,
			},
		},
		[`&.${outlinedInputClasses.error}`]: {
			[`.${outlinedInputClasses.notchedOutline}`]: {
				borderColor: Colors.Red,
			},
		},
	},
	[`& .${outlinedInputClasses.input}`]: {
		fontSize: '14px',
		padding: '9px 12px',
		lineHeight: '18px',
		height: '18px',
		color: TextColor.Dark,
		[`&::placeholder`]: {
			color: IconsColor.disabled,
			opacity: 1,
		},
		[`&::-webkit-outer-spin-button, &::-webkit-inner-spin-button`]: {
			WebkitAppearance: 'none',
			margin: 0,
		},
		[`&[type=number]`]: {
			MozAppearance: 'textfield',
		},
	},
	[`& .${outlinedInputClasses.notchedOutline}`]: {
		borderColor: Colors.BorderMain,
		borderWidth: 1,
	},
	[`& .${inputBaseClasses.adornedEnd}`]: {
		pr: 0,
	},
}

export const iconButtonSx: SxProps = {
	visibility: 'hidden',
	right: 0,
	background: 'white',
	display: 'none',
	height: 18,
	p: 0,
	mr: 1,
	[`&:hover`]: {
		background: Colors.White,
	},
	[`.${outlinedInputClasses.root}:hover &`]: {
		display: 'flex',
		alignItems: 'center',
		visibility: 'visible',
	},
}
