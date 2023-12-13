import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React, { cloneElement, useMemo, useState, MouseEvent } from 'react'
import { Box, Chip, Popover, Typography } from '@mui/material'

import { TextColor } from '../../components/styles'
import { Tooltip } from '../../components/Tooltip'
import { useTableContext } from '../../context/useTableContext'

type CommonChipWithPopoverProps = {
	text: string
	textAlignSelf?: string
	icon?: JSX.Element
	title?: JSX.Element | string
	dropdownContent?: JSX.Element
	setIsOpen?: (isOpen: boolean) => void
	onClick?: (event: MouseEvent) => void
	renderExpandMoreIcon?: (isOpen: boolean) => JSX.Element
}

const defaultRenderExpandMoreIcon =
	(Icon = ExpandMoreIcon) =>
	(isOpen) =>
		(
			<Icon
				sx={{
					transform: isOpen ? 'rotate(180deg)' : undefined,
					transition: '0.2s',
				}}
				height={12}
			/>
		)

export const CommonChipWithPopover = (props: CommonChipWithPopoverProps) => {
	const {
		textAlignSelf,
		text,
		title,
		icon,
		dropdownContent,
		setIsOpen,
		onClick,
		renderExpandMoreIcon = defaultRenderExpandMoreIcon(),
	} = props

	const [open, setOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

	const handleChipClick = (event: MouseEvent<HTMLElement>) => {
		onClick?.(event)
		if (dropdownContent) {
			handleOpenClose(event)
		}
	}

	const handleOpenClose = (event: MouseEvent<HTMLElement>) => {
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
				color: open ? '#FAFAFC' : TextColor.Primary,
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
						mr: dropdownContent ? '-9px' : 0,
					}}
				>
					{Boolean(computedIcon) && computedIcon}
					{Boolean(title) && (
						<Typography
							variant="body1"
							sx={{
								fontWeight: 600,
								fontSize: 12,
								color: open ? '#FAFAFC' : TextColor.Primary,
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
					{dropdownContent && renderExpandMoreIcon?.(open)}
				</Box>
			}
		/>
	)

	return (
		<div>
			<Box onClick={handleChipClick}>
				{text.length > 20 ? (
					<Tooltip title={text} placement="top">
						{ChipContent}
					</Tooltip>
				) : (
					ChipContent
				)}
			</Box>

			{dropdownContent && (
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
			)}
		</div>
	)
}

export const CommonChipWithPopoverAndContext = (
	props: CommonChipWithPopoverProps
) => {
	const {
		table: {
			options: {
				icons: { ExpandMoreIcon },
			},
		},
	} = useTableContext()

	return (
		<CommonChipWithPopover
			renderExpandMoreIcon={defaultRenderExpandMoreIcon(ExpandMoreIcon)}
			{...props}
		/>
	)
}
