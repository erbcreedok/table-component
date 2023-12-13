import React, { ReactNode } from 'react'
import { Typography, Box } from '@mui/material'

import { ItemBoxSearchedSortingStyled } from '../TableStatusBar/SortingChip/SortingChip.styled'
import { PlusIcon } from '../icons/PlusIcon'
import { CloseIcon } from '../icons/CloseIcon'

import { ButtonLink } from './ButtonLink'
import { IconsColor, TextColor } from './styles'
import type { EmbeddedSelectOptionType } from './EmbeddedSelect'

type Props = {
	options: EmbeddedSelectOptionType[]
	onOptionClick: (item: EmbeddedSelectOptionType) => void
	renderItem?: (item: EmbeddedSelectOptionType) => ReactNode
	noOptionsText?: string
	isSearchList?: boolean
}

export const EmbeddedSelectList = ({
	options = [],
	onOptionClick,
	renderItem,
	noOptionsText = 'No options',
	isSearchList = false,
}: Props) => {
	if (!options?.length) {
		return (
			<Box sx={{ padding: '9px 12px' }}>
				<Typography variant="body2" sx={{ color: TextColor.Primary }}>
					{noOptionsText}
				</Typography>
			</Box>
		)
	}

	return (
		<>
			{options.map((item) => {
				if (renderItem) {
					return renderItem(item)
				}

				return (
					<ItemBoxSearchedSortingStyled
						key={item.text}
						onClick={() => onOptionClick(item)}
					>
						<Typography variant="body2" style={{ fontSize: 14 }}>
							{item.text}
						</Typography>

						<ButtonLink>
							{isSearchList ? (
								<PlusIcon htmlColor={IconsColor.default} />
							) : (
								<CloseIcon htmlColor={IconsColor.default} />
							)}
						</ButtonLink>
					</ItemBoxSearchedSortingStyled>
				)
			})}
		</>
	)
}
