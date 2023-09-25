import { AutocompleteProps, AutocompleteValue } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import { AutocompleteRenderGetTagProps } from '@mui/material/Autocomplete/Autocomplete'
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
	Omit<
		AutocompleteProps<T, Multiple, DisableClearable, FreeSolo, ChipComponent>,
		'value'
	>,
	'renderInput' | 'options'
> & {
	inputProps?: InputProps
	value?: (T | string | undefined | null) | (T | string | undefined | null)[]
}

const isOptionEqualToValue = <T extends Record<string, any> = SelectOption>(
	option: T,
	value: string | T | undefined
) => {
	return typeof value === 'object' && 'value' in value
		? option.value === value.value
		: option.value === value
}
const getOptionLabel = <T extends Record<string, any> = SelectOption>(
	option: T
) => {
	return typeof option === 'object' && 'label' in option ? option.label : option
}
const renderTags = <T extends Record<string, any> = SelectOption>(
	options: T[],
	getTagProps: AutocompleteRenderGetTagProps,
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

export const Select = <
	T extends Record<string, any> = SelectOption,
	Multiple extends boolean | undefined = boolean
>({
	inputProps,
	options = [],
	value,
	...props
}: SelectProps<T, Multiple>) => {
	const {
		table: {
			options: {
				icons: { ChevronDownIcon, CloseIcon },
			},
		},
	} = useTableContext()

	return (
		<Autocomplete<T, Multiple, boolean, false>
			fullWidth
			size="small"
			popupIcon={<ChevronDownIcon />}
			clearIcon={<CloseIcon style={{ width: '18px', height: '18px' }} />}
			getOptionLabel={getOptionLabel}
			renderInput={(params) => <Input {...inputProps} {...params} />}
			isOptionEqualToValue={isOptionEqualToValue}
			renderTags={renderTags}
			options={options}
			value={value as AutocompleteValue<T, Multiple, boolean, false>}
			{...props}
		/>
	)
}
