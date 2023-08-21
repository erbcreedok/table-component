import { AutocompleteProps } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { ChipTypeMap } from '@mui/material/Chip'
import { PartialKeys } from '@tanstack/table-core'
import React from 'react'

import { Flex } from '../components/Flex'
import { Tag } from '../components/Tag'
import { useTableContext } from '../context/useTableContext'
import { SelectOption } from '../TableComponent'

import { Input, InputProps } from './Input'

export type SelectProps<
	T = SelectOption,
	Multiple extends boolean | undefined = boolean,
	DisableClearable extends boolean | undefined = boolean,
	FreeSolo extends boolean | undefined = false,
	ChipComponent extends React.ElementType = ChipTypeMap['defaultComponent']
> = PartialKeys<
	AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>,
	'renderInput' | 'value'
> & {
	inputProps: InputProps
	value:
		| (SelectOption | string | undefined)
		| (SelectOption | string | undefined)[]
}

const isOptionEqualToValue = (
	option: SelectOption,
	value: string | SelectOption | undefined
) => {
	return typeof value === 'object' && 'value' in value
		? option.value === value.value
		: option.value === value
}
const getOptionLabel = (option: SelectOption | string) =>
	typeof option === 'string' ? option : option.label
const renderTags: SelectProps['renderTags'] = (
	options,
	getTagProps,
	ownerState
) => (
	<Flex gap="3px" flexWrap="wrap" width="100%">
		{options.map((option, index) => {
			const { key, ...props } = getTagProps({ index })

			return (
				<Tag key={key} sx={{ maxWidth: '100%' }} {...props}>
					{ownerState.getOptionLabel?.(option) ?? getOptionLabel(option)}
				</Tag>
			)
		})}
	</Flex>
)

export const Select = ({ inputProps, ...props }: SelectProps) => {
	const {
		table: {
			options: {
				icons: { ChevronDownIcon, CloseIcon },
			},
		},
	} = useTableContext()

	return (
		<Autocomplete<SelectOption, boolean, boolean, false>
			fullWidth
			size="small"
			popupIcon={<ChevronDownIcon />}
			clearIcon={<CloseIcon style={{ width: '18px', height: '18px' }} />}
			getOptionLabel={getOptionLabel}
			renderInput={(params) => <Input {...inputProps} {...params} />}
			isOptionEqualToValue={isOptionEqualToValue}
			renderTags={renderTags}
			{...props}
		/>
	)
}
