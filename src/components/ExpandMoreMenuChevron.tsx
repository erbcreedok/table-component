import Box from '@mui/material/Box'

import { useTableContext } from '../context/useTableContext'

export const ExpandMoreMenuChevron = () => {
	const {
		table: {
			options: {
				icons: { ExpandMoreIcon },
			},
		},
	} = useTableContext()

	return (
		<Box
			sx={(theme) => ({
				height: 24,
				ml: 'auto',
				transform: 'rotate(-90deg)',
				color: theme.palette.action.active,
			})}
		>
			<ExpandMoreIcon />
		</Box>
	)
}
