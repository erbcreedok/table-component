import { Box, Typography } from '@mui/material'
import React from 'react'

import { TableData, TableInstance } from '../../TableComponent'
import { getE2EAttributes } from '../../utils/getE2EAttributes'
import { withNativeEvent } from '../../utils/withNativeEvent'

type DropdownContentHeaderProps<TData = TableData> = {
	headerTitle: string
	onClearAll: () => void
	analyticsElementName?: string
	table?: TableInstance<TData>
}

export const DropdownContentHeader = <TData,>({
	table,
	headerTitle,
	onClearAll,
	analyticsElementName,
}: DropdownContentHeaderProps<TData>) => {
	return (
		<Box
			component="div"
			sx={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'space-between',
				p: '9px 12px',
				borderBottom: '1px solid #EBEDF5',
			}}
		>
			<Typography variant="body1" style={{ fontWeight: 600, fontSize: 12 }}>
				{headerTitle}
			</Typography>

			<Typography
				variant="body2"
				onClick={
					analyticsElementName && table
						? withNativeEvent(
								{ el: analyticsElementName, type: 'click' },
								table
						  )(onClearAll)
						: onClearAll
				}
				style={{ color: '#009ECC', fontSize: 12, cursor: 'pointer' }}
				{...getE2EAttributes(`chip${headerTitle}ClearAll`)}
			>
				Clear All
			</Typography>
		</Box>
	)
}
