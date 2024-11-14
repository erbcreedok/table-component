import { Box, Divider, IconButton, styled } from '@mui/material'
import { IconButtonProps } from '@mui/material/IconButton'
import React, { ReactElement } from 'react'

import { CloseIcon } from '../icons/CloseIcon'
import { getE2EAttributes } from '../utils/getE2EAttributes'

import { DEFAULT_FONT_FAMILY, TextColor } from './styles'

const SidebarHeader = styled(Box)`
	padding: 12px 24px;
	font-family: ${DEFAULT_FONT_FAMILY};
	& > div {
		font-size: 24px;
		font-weight: 600;
		display: flex;
		align-items: center;
		justify-content: space-between;
		color: ${TextColor.Primary};
	}
	& button:hover {
		background: none;
	}
	& p {
		font-size: 14px;
		line-height: 18px;
		font-weight: 600;
		color: ${TextColor.Disabled};
	}
`

type Props = {
	title: string
	subHeader?: string | ReactElement | null
	onClick: IconButtonProps['onClick']
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
					<IconButton
						disableRipple
						{...getE2EAttributes('closeSidebar', `closeSidebar_${title}`)}
						onClick={onClick}
					>
						<CloseIcon />
					</IconButton>
				</div>
				{subHeader}
			</SidebarHeader>
			<Divider />
		</>
	)
}
