import { Box, Button, Divider, Menu, Typography } from '@mui/material'

interface PresetNotifcationProps {
	anchorEl: HTMLElement
	setIsNotificationShowedOnce(value: boolean): void
}

export const PresetNotifcation = ({
	anchorEl,
	setIsNotificationShowedOnce,
}: PresetNotifcationProps) => {
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
					boxShadow:
						'0px 2px 10px rgba(29, 30, 38, 0.1), 0px 1px 2px rgba(29, 30, 38, 0.1)',
					mt: 1.5,
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
