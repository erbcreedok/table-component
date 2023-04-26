import { FC, useState } from 'react'
import { Box, Chip, Popover, Tooltip, Typography } from '@mui/material'
import {
	KeyboardArrowDownOutlined,
	KeyboardArrowUpOutlined,
} from '@mui/icons-material'

type CommonChipWithPopoverProps = {
	text: string
	textAlignSelf?: string
	icon?: JSX.Element
	title?: JSX.Element | string
	dropdownContent: JSX.Element
}

export const CommonChipWithPopover: FC<CommonChipWithPopoverProps> = (
	props
) => {
	const { textAlignSelf, text, title, icon, dropdownContent } = props

	const [open, setOpen] = useState(false)
	const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)

	const handleOpenClose = (event: any) => {
		setAnchorEl(event.currentTarget)
		setOpen(!open)
	}

	const id = open ? 'simple-popover' : undefined

	const ChipContent = (
		<Chip
			clickable
			style={{
				background: open ? '#303240' : '#F5F6FA',
				color: open ? '#FAFAFC' : '#303240',
				border: '1px solid #EBEDF5',
				borderColor: open ? '#303240' : '#EBEDF5',
				marginRight: 8,
			}}
			label={
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 190 }}>
						{Boolean(icon) && <div style={{ marginRight: 8 }}>{icon}</div>}
						{Boolean(title) && title}
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
					</Box>
					{open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
				</div>
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
