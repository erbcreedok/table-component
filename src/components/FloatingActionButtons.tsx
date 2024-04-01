import {
	autoUpdate,
	flip,
	FloatingPortal,
	offset,
	shift,
	useFloating,
} from '@floating-ui/react'
import { styled } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { MouseEventHandler, ReactElement, ReactNode, useRef } from 'react'

import { TableData, TableInstance } from '../TableComponent'

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

type EditFloatingActionButtonsProps<TData extends TableData> = {
	adornment?: ReactNode
	open?: boolean
	children: (args: {
		ref: (node: HTMLTableRowElement | null) => void
	}) => ReactElement
	table: TableInstance<TData>
	onSubmit?: MouseEventHandler
	onCancel?: MouseEventHandler
}
export const FloatingActionButtons = <TData extends TableData>({
	adornment,
	open,
	children,
	table,
	onCancel,
	onSubmit,
}: EditFloatingActionButtonsProps<TData>) => {
	const {
		options: {
			icons: { CloseIcon, CheckIcon },
		},
		refs: { tableContainerRef },
	} = table

	const defaultContainerRef = useRef(document.body)
	const { x, y, floating, reference, strategy } = useFloating({
		open,
		whileElementsMounted: autoUpdate,
		placement: 'bottom-start',
		middleware: [shift(), flip(), offset({ mainAxis: 2, crossAxis: 10 })],
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
							right: x ?? '',
							top: y ?? '',
							zIndex: 2,
						}}
						sx={{
							display: 'flex',
							gap: '6px',
							p: '6px',
						}}
					>
						{adornment}
						<IconButtonStyled
							style={{ background: Colors.Red }}
							onClick={onCancel}
						>
							<CloseIcon style={{ width: '21px', height: '21px' }} />
						</IconButtonStyled>
						<IconButtonStyled
							style={{ background: Colors.LightBlue }}
							onClick={onSubmit}
						>
							<CheckIcon style={{ width: '21px', height: '21px' }} />
						</IconButtonStyled>
					</Box>
				</FloatingPortal>
			)}
		</>
	)
}
