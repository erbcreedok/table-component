import { Box, Typography } from '@mui/material'

import { Text } from '../../components/styles'
import { useTableContext } from '../../context/useTableContext'

export const NoOptions = () => {
	const {
		table: {
			options: { localization },
		},
	} = useTableContext()

	return (
		<Box sx={{ padding: '9px 12px' }}>
			<Typography variant="body2" sx={{ color: Text.Primary }}>
				{localization.noOptions}
			</Typography>
		</Box>
	)
}
