import { FC } from 'react'
import CheckIcon from '@mui/icons-material/Check'
import { Typography } from '@mui/material'

import { useGroupingControls } from '../../../TableFiltersBar/filter-bar-hooks/useGroupingControls'
import { ItemBoxSearchedGroupingStyled } from '../GroupingChip.styled'

export const ListSearchedGroupItem: FC<any> = (props) => {
	const { item, table, selectedSearchedItems, setSelectedSearchedItems } = props
	const { id, columnDef } = item
	const { header } = columnDef
	const isChecked = selectedSearchedItems.includes(item.id)

	const { allColumns } = useGroupingControls(table)

	const handleSelect = () => {
		const column = allColumns.find((col) => col.id === id)

		column?.toggleGrouping?.()

		if (isChecked) {
			setSelectedSearchedItems(
				selectedSearchedItems.filter((id) => id !== item.id)
			)

			return
		}

		setSelectedSearchedItems([...selectedSearchedItems, id])
	}

	return (
		<ItemBoxSearchedGroupingStyled key={id} onClick={handleSelect}>
			<Typography variant="body2" style={{ fontSize: 14 }}>
				{header}
			</Typography>

			{isChecked && <CheckIcon style={{ fill: '#009ECC', fontSize: '16px' }} />}
		</ItemBoxSearchedGroupingStyled>
	)
}
