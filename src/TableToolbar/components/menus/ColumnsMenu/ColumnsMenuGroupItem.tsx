import React from 'react'
import Box from '@mui/material/Box'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Typography from '@mui/material/Typography'

import type { Table_Column, TableData, TableInstance } from '../../../../index'
import { TableSwitch } from '../../../../components/TableSwitch'
import { Tooltip } from '../../../../components/Tooltip'
import { TreeAngle } from '../../../../components/TreeAngle'
import { DEFAULT_FONT_FAMILY, TextColor } from '../../../../components/styles'

interface Props<TData extends TableData> {
	columnsGroup: Table_Column<TData>[]
	columnsGroupText: string
	table: TableInstance<TData>
	isLastInList?: boolean
	renderTreeAngle?: boolean
}

export const ColumnsMenuGroupItem = <TData extends TableData = {}>({
	columnsGroup,
	columnsGroupText,
	table,
	isLastInList,
	renderTreeAngle,
}: Props<TData>) => {
	const {
		options: { enableHiding, localization },
	} = table

	const switchChecked = columnsGroup.some(
		(col) => col.getCanHide() && col.getIsVisible()
	)

	const handleToggleColumnHidden = (columnsGroup: Table_Column<TData>[]) => {
		columnsGroup?.forEach?.((col: Table_Column<TData>) => {
			col.toggleVisibility(!switchChecked)
		})
	}

	return (
		<>
			<MenuItem
				disableRipple
				sx={() => ({
					alignItems: 'center',
					justifyContent: 'flex-start',
					my: 0,
					opacity: 1,
					filter: 'none',
					borderBottom: 'none',
					py: '6px',
					height: 36,
					'&:hover': {
						backgroundColor: 'unset',
					},
					'& button': {
						visibility: 'hidden',
					},
					'&:hover button': {
						visibility: 'visible',
					},
				})}
			>
				<Box
					sx={{
						display: 'flex',
						flexWrap: 'nowrap',
						paddingLeft: '4px',
						alignItems: 'center',
						minWidth: 300,
					}}
				>
					<Box sx={{ width: '9px' }} />
					{renderTreeAngle && <TreeAngle lastInList={isLastInList} />}
					{enableHiding ? (
						<FormControlLabel
							componentsProps={{
								typography: {
									sx: {
										mb: 0,
										opacity: 1,
										fontFamily: DEFAULT_FONT_FAMILY,
										fontSize: 14,
										lineHeight: '18px',
										paddingLeft: '12px',
										color: TextColor.Primary,
									},
								},
							}}
							checked={switchChecked}
							control={
								<Tooltip
									arrow
									enterDelay={1000}
									enterNextDelay={1000}
									title={localization.toggleVisibility}
								>
									<TableSwitch size="small" disableRipple />
								</Tooltip>
							}
							label={columnsGroupText}
							onChange={() => handleToggleColumnHidden(columnsGroup)}
						/>
					) : (
						<Typography sx={{ alignSelf: 'center' }}>
							{columnsGroupText}
						</Typography>
					)}
				</Box>
			</MenuItem>
		</>
	)
}
