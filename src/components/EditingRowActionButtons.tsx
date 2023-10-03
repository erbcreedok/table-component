import {
	autoUpdate,
	flip,
	FloatingPortal,
	shift,
	useFloating,
} from '@floating-ui/react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { ReactElement, useRef } from 'react'

import { Table_Row, TableData, TableInstance } from '../TableComponent'

import { Colors } from './styles'

const IconButtonStyled = styled(IconButton)`
	height: 30px;
	width: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${Colors.White};
	border-radius: 4px;
`

type EditingRowActionButtonsProps<TData extends TableData> = {
	open?: boolean
	children: (args: {
		ref: (node: HTMLTableRowElement | null) => void
	}) => ReactElement
	table: TableInstance<TData>
	row: Table_Row<TData>
}
export const EditingRowActionButtons = <TData extends TableData>({
	open,
	children,
	table,
	row,
}: EditingRowActionButtonsProps<TData>) => {
	const {
		getState,
		options: {
			icons: { CloseIcon, CheckIcon },
			onEditingRowsSave,
			onEditingRowCancel,
		},
		refs: { tableContainerRef },
		setEditingRow,
	} = table
	const { editingRow } = getState()

	const handleCancel = () => {
		onEditingRowCancel?.({ row, table })
		setEditingRow(null)
	}

	const handleSave = () => {
		if (editingRow && !editingRow.isError) {
			onEditingRowsSave?.({
				exitEditingMode: () => setEditingRow(null),
				rows: editingRow ?? row,
				table,
				values: { ...row.original, ...editingRow?._valuesCache },
			})
		}
	}
	const defaultContainerRef = useRef(document.body)
	const { x, y, floating, reference, strategy } = useFloating({
		open,
		whileElementsMounted: autoUpdate,
		placement: 'bottom-end',
		middleware: [shift(), flip()],
	})

	return (
		<>
			{children({ ref: reference })}
			{open && (
				<FloatingPortal
					root={tableContainerRef.current ?? defaultContainerRef.current}
				>
					<Box
						ref={floating}
						style={{
							position: strategy,
							left: x ?? '',
							top: y ?? '',
							zIndex: 2,
						}}
						sx={{
							display: 'flex',
							gap: '6px',
							p: '6px',
						}}
					>
						<IconButtonStyled
							style={{ background: Colors.Red }}
							onClick={handleCancel}
						>
							<CloseIcon style={{ width: '21px', height: '21px' }} />
						</IconButtonStyled>
						<IconButtonStyled
							style={{ background: Colors.LightBlue }}
							onClick={handleSave}
						>
							<CheckIcon style={{ width: '21px', height: '21px' }} />
						</IconButtonStyled>
					</Box>
				</FloatingPortal>
			)}
		</>
	)
}
