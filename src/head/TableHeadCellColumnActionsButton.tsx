import React, {
	FC,
	MouseEvent,
	MouseEventHandler,
	ReactNode,
	useCallback,
	useMemo,
	useState,
} from 'react'

import { ColumnActionMenu } from '../menus/ColumnActionMenu'
import type { Table_Header, TableInstance } from '..'

type Props = {
	header: Table_Header
	table: TableInstance
	disabled?: boolean
	children(props: { onClick: MouseEventHandler }): ReactNode
}

export const TableHeadCellColumnActionsButton: FC<Props> = ({
	header,
	table,
	children,
	disabled,
}) => {
	const {
		options: { localization },
	} = table

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

	const handleClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (disabled) return
			event.stopPropagation()
			event.preventDefault()
			setAnchorEl(event.currentTarget)
		},
		[disabled]
	)

	const props = useMemo(
		() => ({
			onClick: handleClick,
			'aria-label': localization.columnActions,
		}),
		[handleClick, localization.columnActions]
	)

	return (
		<>
			{children(props)}
			{anchorEl && (
				<ColumnActionMenu
					anchorEl={anchorEl}
					header={header}
					setAnchorEl={setAnchorEl}
					table={table}
				/>
			)}
		</>
	)
}
