import { FC } from 'react'
import { Typography } from '@mui/material'

import { useGroupingControls } from '../../filter-bar-hooks/useGroupingControls'
import { ItemBoxSearchedGroupingStyled } from '../GroupingChip.styled'
import { ButtonLink } from '../../../components/ButtonLink'
import { IconsColor } from '../../../components/styles'
import { PlusIcon } from '../../../icons/PlusIcon'

// TODO:
//  1. define props properly
//  2. handle sort selection higher in component tree (ex. GroupingChip.tsx)
// 	3. combine this component with ListSearchSortingItem.tsx, so it doesn't duplicate logic
export const ListSearchedGroupItem: FC<any> = (props) => {
	const {
		item,
		table,
		selectedSearchedItems,
		onSelect,
		setSelectedSearchedItems,
	} = props
	const { id, columnDef } = item
	const { header } = columnDef

	const { allColumns } = useGroupingControls(table)

	const handleSelect = () => {
		const column = allColumns.find((col) => col.id === id)

		column?.toggleGrouping?.()

		setSelectedSearchedItems([...selectedSearchedItems, id])
		onSelect()
	}

	return (
		<ItemBoxSearchedGroupingStyled key={id} onClick={handleSelect}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{header}
			</Typography>

			<ButtonLink>
				<PlusIcon htmlColor={IconsColor.default} />
			</ButtonLink>
		</ItemBoxSearchedGroupingStyled>
	)
}
