import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'

import { SelectOption } from '../../TableComponent'
import { NoOptions } from '../../components/NoOptions'
import { ListFilterItem } from '../../components/ListFilterItem'

type FilterChipListProps = {
	options: SelectOption[]
	onOptionClick: (option: SelectOption) => void
	isCheckedOptions?: boolean
} & BoxProps

export const FilterChipList = (props: FilterChipListProps) => {
	const { options, onOptionClick, isCheckedOptions, ...rest } = props

	if (!options?.length) {
		return <NoOptions />
	}

	return (
		<Box {...rest}>
			{options.map((option) => {
				return (
					<ListFilterItem
						key={option.value?.toString()}
						isChecked={isCheckedOptions}
						title={option.label?.toString()}
						onClick={() => onOptionClick(option)}
					/>
				)
			})}
		</Box>
	)
}
