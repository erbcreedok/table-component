import { MenuItem, Typography } from '@mui/material'

import { Colors } from '../../../../../components/styles'
import { useTableContext } from '../../../../../context/useTableContext'

import { PresetIcon } from './PresetIcon'

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
				p: '9px 12px',
				'&:hover': {
					backgroundColor: Colors.Gray20,
				},
			}}
			onClick={onSelectPreset(id)}
		>
			<Typography
				variant="body2"
				noWrap
				sx={{ lineHeight: '18px', mr: 'auto' }}
			>
				{name}
			</Typography>
			<PresetIcon selected={checkedPresetId === id}>
				<CheckIcon />
			</PresetIcon>
		</MenuItem>
	)
}
