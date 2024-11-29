import { autocompleteClasses, outlinedInputClasses } from '@mui/material'

export const selectSx = {
	[`.${autocompleteClasses.endAdornment}`]: {
		position: 'static',
		transform: 'translate(0, 0)',
	},
	[`&.${autocompleteClasses.hasClearIcon}.${autocompleteClasses.hasPopupIcon} .${outlinedInputClasses.root},
					 &.${autocompleteClasses.hasPopupIcon} .${outlinedInputClasses.root}`]: {
		pr: 1,
	},
	[`.${autocompleteClasses.clearIndicator}`]: {
		display: 'none',
		height: 18,
		p: 0,
		lineHeight: '18px',
	},
	[`&:hover .${autocompleteClasses.clearIndicator}`]: {
		display: 'inline-block',
	},
}
