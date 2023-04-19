import { ListItemIcon, MenuItem, Typography } from '@mui/material'

import { Colors } from '../../../../../components/styles'
import { useTableContext } from '../../../../../context/useTableContext'

interface SuggestedPresetProps {
	id: number
	name: string
	checkedPresetId?: number
	onSelectPreset(id: number): () => void
}

export const SuggestedPreset = ({
	id,
	name,
	checkedPresetId,
	onSelectPreset,
}: SuggestedPresetProps) => {
	const {
		table: {
			options: {
				icons: { CheckIcon },
			},
		},
	} = useTableContext()

	return (
		<MenuItem
			sx={{
				display: 'flex',
				justifyContent: 'space-between',
				p: '8px 16px',
				'& .MuiListItemIcon-root': {
					minWidth: '18px',
				},
			}}
			onClick={onSelectPreset(id)}
		>
			<Typography variant="body2" noWrap>
				{name}
			</Typography>
			{checkedPresetId === id && (
				<ListItemIcon
					sx={{
						color: `${Colors.LightBlue}`,
					}}
				>
					<CheckIcon />
				</ListItemIcon>
			)}
		</MenuItem>
	)
}
