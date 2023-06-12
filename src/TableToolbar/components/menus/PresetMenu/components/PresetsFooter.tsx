import { Box, ButtonBase } from '@mui/material'

import { Colors, Text } from '../../../../../components/styles'
import { TableInstance } from '../../../../../TableComponent'

interface PresetsFooterProps<TData extends Record<string, any>> {
	table: TableInstance<TData> | TableInstance
	isSaveAsNewEnabled?: boolean
	isUpdateCurrentEnabled?: boolean
	onSaveAsNew(): void
	onUpdateCurrent(): void
}

export const PresetsFooter = <TData extends Record<string, any>>({
	isSaveAsNewEnabled,
	isUpdateCurrentEnabled,
	onSaveAsNew,
	onUpdateCurrent,
	table,
}: PresetsFooterProps<TData>) => {
	const {
		options: { localization },
	} = table

	return (
		<Box
			sx={{
				display: 'flex',
				p: '9px 12px',
				justifyContent: 'space-between',
			}}
		>
			<ButtonBase
				sx={{
					height: '18px',
					fontSize: '12px',
					fontWeight: 'bold',
					color: isSaveAsNewEnabled ? Colors.LightBlue : Text.Disabled,
				}}
				disabled={!isSaveAsNewEnabled}
				onClick={onSaveAsNew}
			>
				{localization.saveAsNew}
			</ButtonBase>
			<ButtonBase
				disabled={!isUpdateCurrentEnabled}
				sx={{
					height: '18px',
					fontSize: '12px',
					fontWeight: 'bold',
					color: isUpdateCurrentEnabled ? Text.Primary : Text.Disabled,
				}}
				onClick={onUpdateCurrent}
			>
				{localization.updateCurrent}
			</ButtonBase>
		</Box>
	)
}
