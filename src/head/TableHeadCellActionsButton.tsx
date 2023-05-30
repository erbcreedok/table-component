import React, {
	FC,
	MouseEvent,
	MouseEventHandler,
	MutableRefObject,
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
	children(props: {
		onClick: MouseEventHandler
		menuVisible: boolean
	}): ReactNode
	anchorElRef: MutableRefObject<HTMLElement | null>
}

export const TableHeadCellActionsButton: FC<Props> = ({
	header,
	table,
	children,
	disabled,
	anchorElRef,
}) => {
	const {
		options: { localization },
	} = table

	const [visible, setVisible] = useState(false)

	const handleClick = useCallback(
		(event: MouseEvent<HTMLElement>) => {
			const anchorEl = anchorElRef.current
			if (disabled || !anchorEl) return
			event.stopPropagation()
			event.preventDefault()
			setVisible(true)
		},
		[anchorElRef, disabled]
	)

	const props = useMemo(
		() => ({
			onClick: handleClick,
			menuVisible: visible,
			'aria-label': localization.columnActions,
		}),
		[visible, handleClick, localization.columnActions]
	)

	return (
		<>
			{children(props)}
			<ColumnActionMenu
				anchorEl={visible ? anchorElRef.current : null}
				header={header}
				setVisible={setVisible}
				table={table}
			/>
		</>
	)
}
