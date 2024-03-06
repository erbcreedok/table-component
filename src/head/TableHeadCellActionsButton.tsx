import {
	FC,
	MouseEvent,
	MouseEventHandler,
	MutableRefObject,
	ReactNode,
	useCallback,
	useMemo,
	useState,
} from 'react'
import { useBoolean } from 'usehooks-ts'

import { ColumnActionMenu } from '../menus/ColumnActionMenu'
import { CustomColumnEditor } from '../menus/CustomColumnEditor'
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
		options: { localization, setColumns },
	} = table
	const { column } = header

	const [visible, setVisible] = useState(false)
	const {
		value: isCustomizer,
		setTrue: setCustomizerTrue,
		setFalse: setCustomizerFalse,
	} = useBoolean(false)

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
				openCustomizer={setCustomizerTrue}
				table={table}
			/>
			{isCustomizer && setColumns && (
				<CustomColumnEditor
					columnDef={column.columnDef}
					anchorEl={anchorElRef.current}
					close={setCustomizerFalse}
					setColumns={setColumns}
				/>
			)}
		</>
	)
}
