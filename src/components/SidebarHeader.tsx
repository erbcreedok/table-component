import { styled, Box, Divider, IconButton } from '@mui/material'
import React, { ReactElement } from 'react'

import { CloseIcon } from '../icons/CloseIcon'

import { DEFAULT_FONT_FAMILY, Text } from './styles'

const SidebarHeader = styled(Box)`
	padding: 12px 24px;
	font-family: ${DEFAULT_FONT_FAMILY};
	& > div {
		font-size: 24px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: ${Text.Primary};
	}
	& button:hover {
		background: none;
	}
	& p {
		font-size: 14px;
		line-height: 18px;
		font-weight: 600;
		color: ${Text.Disabled};
	}
`

type Props = {
	title: string
	subHeader?: string | ReactElement | null
	onClick(): void
}

export const SidebarHeaderComponent = ({
	title,
	subHeader = null,
	onClick,
}: Props) => {
	return (
		<>
			<SidebarHeader>
				<div>
					{title}
					<IconButton disableRipple onClick={onClick}>
						<CloseIcon />
					</IconButton>
				</div>
				{subHeader}
			</SidebarHeader>
			<Divider />
		</>
	)
}
