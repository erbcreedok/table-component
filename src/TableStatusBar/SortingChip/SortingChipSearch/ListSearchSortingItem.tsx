import { FC } from 'react'
import { Typography } from '@mui/material'

import { ItemBoxSearchedSortingStyled } from '../SortingChip.styled'
import { useSortingControls } from '../../filter-bar-hooks/useSortingControls'
import { ButtonLink } from '../../../components/ButtonLink'
import { IconsColor } from '../../../components/styles'
import { PlusIcon } from '../../../icons/PlusIcon'

export const ListSearchSortingItem: FC<any> = (props) => {
	const {
		item,
		table,
		setSearchValue,
		selectedSearchedItems,
		setSelectedSearchedItems,
	} = props
	const { id, columnDef } = item
	const { header } = columnDef

	const { allColumns } = useSortingControls(table)

	const handleSelect = () => {
		const column = allColumns.find((col) => col.id === id)

		column?.toggleSorting?.(false, true)

		setSelectedSearchedItems([...selectedSearchedItems, id])
		setSearchValue('')
	}

	return (
		<ItemBoxSearchedSortingStyled key={id} onClick={handleSelect}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{header}
			</Typography>

			<ButtonLink>
				<PlusIcon htmlColor={IconsColor.default} />
			</ButtonLink>
		</ItemBoxSearchedSortingStyled>
	)
}
