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
	children(props: { onClick: MouseEventHandler; visible: boolean }): ReactNode
	anchorEl: HTMLElement | null
}

export const TableHeadCellActionsButton: FC<Props> = ({
	header,
	table,
	children,
	disabled,
	anchorEl,
}) => {
	const {
		options: { localization },
	} = table

	const [visible, setVisible] = useState(false)

	const handleClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			if (disabled) return
			event.stopPropagation()
			event.preventDefault()
			setVisible(true)
		},
		[disabled]
	)

	const props = useMemo(
		() => ({
			onClick: handleClick,
			visible,
			'aria-label': localization.columnActions,
		}),
		[visible, handleClick, localization.columnActions]
	)

	return (
		<>
			{children(props)}
			{anchorEl && (
				<ColumnActionMenu
					anchorEl={visible ? anchorEl : null}
					header={header}
					setVisible={setVisible}
					table={table}
				/>
			)}
		</>
	)
}
