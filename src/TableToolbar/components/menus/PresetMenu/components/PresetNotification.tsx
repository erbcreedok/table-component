import { Box, Button, Divider, Typography } from '@mui/material'

import { Menu } from '../../../../../components/Menu'

interface PresetNotificationProps {
	anchorEl: HTMLElement
	setIsNotificationShowedOnce(value: boolean): void
}

export const PresetNotification = ({
	anchorEl,
	setIsNotificationShowedOnce,
}: PresetNotificationProps) => {
	const handleClose = () => {
		setIsNotificationShowedOnce(true)
	}

	return (
		<Menu
			sx={{ zIndex: 1199 }}
			anchorEl={anchorEl}
			open
			PaperProps={{
				sx: {
					overflow: 'visible',
					width: '360px',
					mt: '6px',
					left: '10px',
					'&:before': {
						content: '""',
						display: 'block',
						position: 'absolute',
						top: 0,
						right: 14,
						width: 10,
						height: 10,
						bgcolor: 'background.paper',
						transform: 'translateY(-50%) rotate(45deg)',
						zIndex: 0,
					},
				},
			}}
			transformOrigin={{ horizontal: 'right', vertical: 'top' }}
			anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
		>
			<Box sx={{ p: '10px 18px 12px 18px' }}>
				<Typography variant="h6" sx={{ mb: '6px' }}>
					Changes in Preset
				</Typography>
				<Typography variant="body2">
					In order to save table view you need to save them.
				</Typography>
			</Box>
			<Divider />
			<Button
				variant="contained"
				color="success"
				sx={{
					textTransform: 'none',
					height: '30px',
					p: '6px',
					boxShadow: 'none',
					m: '10px 18px 4px 18px',
				}}
				onClick={handleClose}
			>
				<Typography variant="h6">I got it</Typography>
			</Button>
		</Menu>
	)
}
