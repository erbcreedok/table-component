import { IconButton, iconButtonClasses, styled } from '@mui/material'
import { useCallback, useRef } from 'react'

import { Colors, IconsColor } from '../components/styles'
import { Tooltip } from '../components/Tooltip'
import { CreateNewRowButtonsConfig } from '../hooks'
import { Table_Row, TableInstance } from '../TableComponent'

import { CreateNewRowMenu } from './CreateNewRowMenu'

export const CreateNewRowButton = (
	props: CreateNewRowButtonsConfig & {
		table: TableInstance
		row: Table_Row
		menuOpen: boolean
		setMenuOpen(value?: number): void
	}
) => {
	const {
		hint,
		depth,
		disabled,
		menuOpen,
		row,
		setMenuOpen,
		table,
		renderMenu,
	} = props
	const {
		options: {
			icons: { ExpandFilledIcon },
		},
		createNewRow,
	} = table
	const anchorRef = useRef(null)

	const enableRenderMenu = !!renderMenu

	const handleClick = useCallback(() => {
		if (enableRenderMenu) {
			setMenuOpen(depth)
		} else {
			createNewRow(row, depth)
		}
	}, [enableRenderMenu, setMenuOpen, createNewRow, row, depth])

	return (
		<>
			<Tooltip title={hint} key={depth} placement="top">
				<CreateButton ref={anchorRef} disabled={disabled} onClick={handleClick}>
					<ExpandFilledIcon />
				</CreateButton>
			</Tooltip>
			{renderMenu && (
				<CreateNewRowMenu
					row={row}
					createNewRow={createNewRow}
					renderMenu={renderMenu}
					table={table}
					open={menuOpen}
					setOpen={setMenuOpen}
					depth={depth}
					anchorEl={anchorRef.current}
				/>
			)}
		</>
	)
}
const CreateButton = styled(IconButton)`
	color: ${IconsColor.disabled};
	background: white;
	padding: 2px;
	transform-origin: center center;
	transition: 1ms;
	&:hover {
		background: white;
		color: ${Colors.Blue2};
		transform: scale(1.3333); // 18px >> 24px
		transition: 0.1ms;
	}
	&.${iconButtonClasses.disabled} {
		pointer-events: auto;
		color: ${Colors.Dark};
		transform: none;
	}
`
