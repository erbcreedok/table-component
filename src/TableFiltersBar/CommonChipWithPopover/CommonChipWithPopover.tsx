import { FC, useState } from 'react'
import { Box, Chip, Popover, Tooltip, Typography } from '@mui/material'
import {
	KeyboardArrowDownOutlined,
	KeyboardArrowUpOutlined,
} from '@mui/icons-material'

type CommonChipWithPopoverProps = {
	Text: string
	textAlignSelf?: string
	Icon?: JSX.Element
	Title?: JSX.Element | string
	DropdownContent: JSX.Element
}

export const CommonChipWithPopover: FC<CommonChipWithPopoverProps> = (
	props
) => {
	const { textAlignSelf, Text, Title, Icon, DropdownContent } = props

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
						{Boolean(Icon) && <div style={{ marginRight: 8 }}>{Icon}</div>}
						{Boolean(Title) && Title}
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
							{Text}
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
				{Text.length > 20 ? (
					<Tooltip title={Text} placement="top">
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
				{DropdownContent}
			</Popover>
		</div>
	)
}
