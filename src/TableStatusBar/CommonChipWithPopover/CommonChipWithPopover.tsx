import React, { cloneElement, useMemo, useState } from 'react'
import { Box, Chip, Popover, Tooltip, Typography } from '@mui/material'

import { Text } from '../../components/styles'
import { TableInstance } from '../../TableComponent'

type CommonChipWithPopoverProps<TData extends Record<string, any>> = {
	text: string
	textAlignSelf?: string
	icon?: JSX.Element
	title?: JSX.Element | string
	dropdownContent: JSX.Element
	setIsOpen?: (isOpen: boolean) => void
	table: TableInstance | TableInstance<TData>
}

export const CommonChipWithPopover = <TData extends Record<string, any>>(
	props: CommonChipWithPopoverProps<TData>
) => {
	const {
		textAlignSelf,
		text,
		title,
		icon,
		dropdownContent,
		setIsOpen,
		table,
	} = props

	const [open, setOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
	const {
		options: {
			icons: { ExpandMoreIcon },
		},
	} = table

	const handleOpenClose = (event: any) => {
		setAnchorEl(event.currentTarget)
		setOpen(!open)
		setIsOpen?.(!open)
	}

	const id = open ? 'simple-popover' : undefined

	const computedIcon = useMemo(
		() =>
			icon
				? cloneElement(icon, {
						style: {
							marginRight: 8,
							height: '1rem',
							width: '1rem',
						},
				  })
				: icon,
		[icon]
	)

	const ChipContent = (
		<Chip
			sx={{
				background: open ? '#303240' : '#F5F6FA',
				color: open ? '#FAFAFC' : Text.Primary,
				border: '1px solid #EBEDF5',
				borderColor: open ? '#303240' : '#EBEDF5',
				height: 24,
			}}
			clickable
			label={
				<Box
					sx={{
						display: 'flex',
						alignItems: 'center',
						maxWidth: 215,
						mr: '-9px',
					}}
				>
					{Boolean(computedIcon) && computedIcon}
					{Boolean(title) && (
						<Typography
							variant="body1"
							sx={{
								fontWeight: 600,
								fontSize: 12,
								color: open ? '#FAFAFC' : Text.Primary,
								marginRight: 1,
							}}
						>
							{title}
						</Typography>
					)}
					<Typography
						variant="body2"
						style={{
							fontSize: 12,
							textOverflow: 'ellipsis',
							overflow: 'hidden',
							whiteSpace: 'nowrap',
							alignSelf: textAlignSelf,
						}}
					>
						{text}
					</Typography>
					<ExpandMoreIcon
						sx={{
							transform: open ? 'rotate(180deg)' : undefined,
							transition: '0.2s',
						}}
						height={12}
					/>
				</Box>
			}
		/>
	)

	return (
		<div>
			<Box onClick={handleOpenClose}>
				{text.length > 20 ? (
					<Tooltip title={text} placement="top">
						{ChipContent}
					</Tooltip>
				) : (
					ChipContent
				)}
			</Box>

			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleOpenClose}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				{dropdownContent}
			</Popover>
		</div>
	)
}
