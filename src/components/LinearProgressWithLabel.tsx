import {
	Box,
	LinearProgress,
	LinearProgressProps,
	Typography,
} from '@mui/material'

export const LinearProgressWithLabel = ({
	value,
	...rest
}: LinearProgressProps & { value: number }) => {
	const progress = value > 100 ? 100 : value < 0 ? 0 : value

	return (
		<Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
			<Typography variant="body2">{`${value}%`}</Typography>
			<Box sx={{ width: '100%', ml: 1 }}>
				<LinearProgress variant="determinate" {...rest} value={progress} />
			</Box>
		</Box>
	)
}
