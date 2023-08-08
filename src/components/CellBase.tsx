import React, { useState } from 'react'
import TextTruncate from 'react-text-truncate'
import Tooltip from '@mui/material/Tooltip'
import Box from '@mui/material/Box'

import { Table_Cell } from '../TableComponent'

type Props<TData extends object> = {
	cell: Table_Cell<TData>
}
export const CellBase = <TData extends object>({ cell }: Props<TData>) => {
	const [isTruncated, setIsTruncated] = useState(false)
	const cellValue = cell.getValue()

	const textWithTooltip = ({ children }) => {
		return (
			<Tooltip
				arrow
				enterDelay={1000}
				enterNextDelay={1000}
				title={(cellValue as string) ?? ''}
				disableHoverListener={!isTruncated}
			>
				<Box>{children}</Box>
			</Tooltip>
		)
	}

	return (
		<TextTruncate
			line={2}
			truncateText="..."
			text={cellValue ?? ''}
			textElement={textWithTooltip}
			onTruncated={() => setIsTruncated(true)}
		/>
	)
}
