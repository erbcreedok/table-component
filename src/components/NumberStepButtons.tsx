import { BoxProps, styled } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { MouseEventHandler } from 'react'

import { useTableContext } from '../context/useTableContext'
import { mergeSx } from '../utils/mergeSx'

import { IconsColor } from './styles'

const IconButtonStyled = styled(IconButton)`
	color: ${IconsColor.default};
	&:hover {
		color: ${IconsColor.active};
	}
`

type NumberStepButtonsProps = {
	onClickUp?: MouseEventHandler
	onClickDown?: MouseEventHandler
	iconButtonProps?: IconButtonProps
	iconButtonUpProps?: IconButtonProps
	iconButtonDownProps?: IconButtonProps
} & BoxProps
export const NumberStepButtons = ({
	onClickUp,
	onClickDown,
	iconButtonProps,
	iconButtonUpProps,
	iconButtonDownProps,
	sx,
	...rest
}: NumberStepButtonsProps) => {
	const {
		table: {
			options: {
				icons: { ChevronNumberDownIcon },
			},
		},
	} = useTableContext()

	return (
		<Box
			sx={mergeSx(
				{
					height: '24px',
					width: '24px',
					display: 'inline-flex',
					alignItems: 'center',
					flexDirection: 'column',
				},
				sx
			)}
			{...rest}
		>
			<IconButtonStyled
				disableRipple
				sx={{ p: 0 }}
				{...iconButtonProps}
				{...iconButtonUpProps}
				onClick={onClickUp}
			>
				<ChevronNumberDownIcon style={{ transform: 'rotate(180deg)' }} />
			</IconButtonStyled>
			<IconButton
				disableRipple
				sx={{ p: 0 }}
				{...iconButtonProps}
				{...iconButtonDownProps}
				onClick={onClickDown}
			>
				<ChevronNumberDownIcon />
			</IconButton>
		</Box>
	)
}
