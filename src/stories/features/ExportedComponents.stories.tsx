import React, { useState } from 'react';
import { Box, Typography } from '@mui/material'
import { Meta } from '@storybook/react';
import { keyframes } from '@emotion/react';

import { TrashIcon } from '../../icons/TrashIcon'
import { PencilIcon } from '../../icons/PencilIcon'
import { EyeCrossedIcon } from '../../icons/EyeCrossedIcon'
import {
	TooltipButton,
	EmbeddedSelect,
	EmbeddedSelectOptionType,
	FilterMultiselect,
	CommonChipWithPopover,
	Menu,
	MenuItemBase,
	SidebarTemplate,
} from '../../index'

const rainbow = keyframes`
	0% { background-position: 0% 50% }
	50% { background-position: 100% 50% }
	100% { background-position: 0% 50% }
`

export const TooltipButtonExported = () => (
	<Box>
		<TooltipButton
			title='tooltip title'
			onClick={() => console.log('clicked')}
			icon={<TrashIcon />}
			enableCaption
			captionText="button"
		/>
	</Box>
);

export const EmbeddedSelectExported = () => {
	const [searchValue, setSearchValue] = useState<string>('')
	const [options, setOptions] = useState<EmbeddedSelectOptionType[]>([])

	const searchOptions = [
		{
			text: 'text1',
		},
		{
			text: 'text2',
		},
		{
			text: 'text3',
		},
		{
			text: 'text4',
		},
	]

	const handleSearchOptionClick = (item) => {
		setOptions([...options, item])
		setSearchValue('')
	}

	return (
		<Box>
			<EmbeddedSelect
				headerTitle="select"
				searchValue={searchValue}
				onSearch={(value) => setSearchValue(value)}
				onClearAll={() => setSearchValue('')}
				onClearSearch={() => setSearchValue('')}
				options={options}
				searchOptions={
					searchOptions.filter((opt) => !options.find(({ text }) => text === opt.text)
						&& opt.text.includes(searchValue)
					)
				}
				onOptionClick={(item) => setOptions(options.filter(({ text }) => text !== item.text))}
				onSearchOptionClick={(item) => handleSearchOptionClick(item)}
			/>
		</Box>
	)
}

export const FiltersMultiselectExported = () => {
	const [value, setValue] = useState<string[]>([])

	const options = [
		{
			label: 'XS',
			value: '1'
		},
		{
			label: 'S',
			value: '3'
		},
		{
			label: 'M',
			value: '5'
		},
		{
			label: 'L',
			value: '7'
		},
		{
			label: 'XL',
			value: '9'
		},
	]

	return (
		<Box>
			<FilterMultiselect
				options={options}
				value={value}
				onChange={(val) => setValue(val as unknown as string[])}
			/>
		</Box>
	)
}

export const ChipExported = () => {
	return (
		<CommonChipWithPopover text="Chip" />
	)
}

export const ChipWithPopoverExported = () => {
	return (
		<CommonChipWithPopover
			text="Chip with popover"
			dropdownContent={
				<Box sx={{
					width: '140px',
					height: '80px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center'
				}}>
					dropdown content
				</Box>
			}
		/>
	)
}

export const MenuItemExported = () => {
	return (
		<Menu
			open
			PaperProps={{
				sx: {
					margin: '6px 0',
				},
			}}
		>
			<MenuItemBase size="small" icon={<TrashIcon />}>Item 1 (small)</MenuItemBase>
			<MenuItemBase size="medium" icon={<PencilIcon />}>Item 2 (medium)</MenuItemBase>
			<MenuItemBase size="large" icon={<EyeCrossedIcon />}>Item 3 (large)</MenuItemBase>
		</Menu>
	)
}

export const SidebarTemplateExported = () => {
	return (
		<SidebarTemplate
			onClose={() => console.log('close')}
			styles={{
				minWidth: 600,
				maxWidth: 800,
			}}
			withHeader
			headerTitle="Sidebar template"
		>
			<Box
				sx={{
					marginTop: '12px',
					height: '600px',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<Typography
					variant="h2"
					sx={{
						animation: `${rainbow} 20s ease infinite`,
						background: 'linear-gradient(to right, red, orange, yellow, green, cyan, blue, violet)',
						backgroundSize: '400% 400%',
						'-webkit-background-clip': 'text',
						'-webkit-text-fill-color': 'transparent',
					}}
				>
					Sidebar content
				</Typography>
			</Box>
		</SidebarTemplate>
	)
}

const meta: Meta = {
	title: 'Features/ExportedComponents Examples',
};

export default meta;
