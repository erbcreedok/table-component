import { FC } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { Typography } from '@mui/material'

import { ItemBoxSearchedSortingStyled } from '../SortingChip.styled'
import { useSortingControls } from '../../filter-bar-hooks/useSortingControls'

export const ListSearchSortingItem: FC<any> = (props) => {
	const { item, table, selectedSearchedItems, setSelectedSearchedItems } = props
	const { id, columnDef } = item
	const { header } = columnDef
	const isChecked = selectedSearchedItems.includes(item.id)

	const { allColumns } = useSortingControls(table)

	const handleSelect = () => {
		const column = allColumns.find((col) => col.id === id)

		column?.toggleSorting?.(false, true)

		if (isChecked) {
			setSelectedSearchedItems(
				selectedSearchedItems.filter((id) => id !== item.id)
			)

			return
		}

		setSelectedSearchedItems([...selectedSearchedItems, id])
	}

	return (
		<ItemBoxSearchedSortingStyled key={id} onClick={handleSelect}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{header}
			</Typography>

			{isChecked && <CheckIcon style={{ fill: '#009ECC', fontSize: '16px' }} />}
		</ItemBoxSearchedSortingStyled>
	)
}
