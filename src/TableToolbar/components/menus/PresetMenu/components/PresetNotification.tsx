import { Box, Button, Divider, Popper, Typography } from '@mui/material'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { MenuPaper } from '../../../../../components/Menu'

interface PresetNotificationProps {
	anchorEl: HTMLElement
	setIsNotificationShowedOnce(): void
}

export const PresetNotification = ({
	anchorEl,
	setIsNotificationShowedOnce,
}: PresetNotificationProps) => {
	const handleClose = () => {
		setIsNotificationShowedOnce()
	}

	return (
		<Popper
			open
			disablePortal
			anchorEl={anchorEl}
			placement="bottom-end"
			sx={(theme) => ({
				zIndex: theme.zIndex.drawer,
			})}
		>
			<ClickAwayListener onClickAway={handleClose}>
				<MenuPaper
					sx={{
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
					}}
				>
					<Box sx={{ p: '18px 18px 12px' }}>
						<Typography variant="h6" sx={{ mb: '6px' }}>
							Changes in Preset
						</Typography>
						<Typography variant="body2">
							In order to save table view you need to save them.
						</Typography>
					</Box>
					<Divider />
					<Box sx={{ p: '12px 18px' }}>
						<Button
							variant="contained"
							color="success"
							sx={{
								textTransform: 'none',
								height: '30px',
								p: '6px',
								boxShadow: 'none',
							}}
							onClick={handleClose}
						>
							<Typography variant="h6">I got it</Typography>
						</Button>
					</Box>
				</MenuPaper>
			</ClickAwayListener>
		</Popper>
	)
}
