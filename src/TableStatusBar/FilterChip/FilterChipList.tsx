import { BoxProps } from '@mui/material'
import Box from '@mui/material/Box'

import { SelectOption } from '../../TableComponent'
import { NoOptions } from '../../components/NoOptions'
import { ListFilterItem } from '../../components/ListFilterItem'
import { withNativeEvent } from '../../utils/withNativeEvent'
import { getPascalCase } from '../../utils/getPascalCase'
import { useTableContext } from '../../context/useTableContext'

type FilterChipListProps = {
	chipTitle: string
	options: SelectOption[]
	onOptionClick: (option: SelectOption) => void
	isCheckedOptions?: boolean
} & BoxProps

export const FilterChipList = (props: FilterChipListProps) => {
	const { options, onOptionClick, isCheckedOptions, chipTitle, ...rest } = props
	const { table } = useTableContext()

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
						onClick={withNativeEvent(
							{
								el: `FilteringChip_${getPascalCase(chipTitle)}_${getPascalCase(
									option.label?.toString()
								)}_${isCheckedOptions ? 'Remove' : 'Add'}`,
								type: 'click',
							},
							table
						)(() => onOptionClick(option))}
					/>
				)
			})}
		</Box>
	)
}
