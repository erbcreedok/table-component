import { FC } from 'react'
import { Typography } from '@mui/material'

import { useGroupingControls } from '../../filter-bar-hooks/useGroupingControls'
import { ItemBoxSearchedGroupingStyled } from '../GroupingChip.styled'
import { ButtonLink } from '../../../components/ButtonLink'

export const ListSearchedGroupItem: FC<any> = (props) => {
	const {
		item,
		table,
		selectedSearchedItems,
		setSearchValue,
		setSelectedSearchedItems,
	} = props
	const { id, columnDef } = item
	const { header } = columnDef

	const { allColumns } = useGroupingControls(table)

	const handleSelect = () => {
		const column = allColumns.find((col) => col.id === id)

		column?.toggleGrouping?.()

		setSelectedSearchedItems([...selectedSearchedItems, id])
		setSearchValue('')
	}

	return (
		<ItemBoxSearchedGroupingStyled key={id} onClick={handleSelect}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{header}
			</Typography>

			<ButtonLink style={{ fontWeight: 600 }}>+</ButtonLink>
		</ItemBoxSearchedGroupingStyled>
	)
}
