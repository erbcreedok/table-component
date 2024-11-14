import { css, styled, TableCell } from '@mui/material'
import { useMemo, useState } from 'react'

import { Colors } from '..'
import { TableBodyRow, TableBodyRowProps } from '../body/TableBodyRow'
import { useTableContext } from '../context/useTableContext'
import { getShouldForwardProps } from '../utils/getShouldForwardProps'
import { getValueOrFunctionHandler } from '../utils/getValueOrFunctionHandler'

import { CreateNewRowButton } from './CreateNewRowButton'

type CreateNewRowProps = TableBodyRowProps & {
	fillGroupedColumns?: boolean
}
const CreateNewRowMain = (props: CreateNewRowProps) => {
	const { table } = useTableContext()
	const { row, fillGroupedColumns } = props
	const {
		options: { enableExpanding, organizeCreateNewRowButtons },
		isHierarchyItem,
		getVisibleLeafColumns,
		getState,
		getIsNewRowHolder,
		getHierarchyParentsCount,
	} = table
	const { grouping, newRow } = getState()
	const [menuOpen, setMenuOpen] = useState<number | undefined>()

	const { depth } = row
	const isHierarchy = !!isHierarchyItem?.(row.original)
	let parentsCount = getHierarchyParentsCount(row) ?? 0
	if (isHierarchy) {
		parentsCount += 1
	}
	const depthRange = Object.keys(
		Array.from({
			length: depth + (enableExpanding ? 2 : 1) - parentsCount,
		})
	).map((i) => Number(i) + parentsCount)

	const buttonProps = useMemo(() => {
		const buttonProps =
			organizeCreateNewRowButtons?.({ row, depthRange, table }) ?? depthRange

		return buttonProps.map((numberOrProps) => {
			if (typeof numberOrProps === 'number')
				return {
					depth: numberOrProps,
				}

			return numberOrProps
		})
	}, [depthRange, organizeCreateNewRowButtons, row, table])

	return (
		<>
			{!getIsNewRowHolder(row) ? (
				<TableRow className="table-create-new-row">
					{fillGroupedColumns && !!grouping.length && (
						<TableCell colSpan={grouping.length} sx={{ p: 0 }} />
					)}
					<TableCell
						sx={{
							position: 'relative',
							p: 0,
							border: 0,
						}}
						colSpan={getVisibleLeafColumns().length - grouping.length}
					>
						<CreateNewRowCellWrapper visible={!!menuOpen} disabled={!!newRow}>
							<Line />
							<ButtonsWrapper>
								{buttonProps.map((props) => (
									<CreateNewRowButton
										key={props.depth}
										table={table}
										row={row}
										menuOpen={menuOpen === props.depth}
										setMenuOpen={setMenuOpen}
										{...props}
									/>
								))}
							</ButtonsWrapper>
						</CreateNewRowCellWrapper>
					</TableCell>
				</TableRow>
			) : newRow ? (
				<TableBodyRow {...props} row={newRow} measureElement={undefined} />
			) : (
				<tr />
			)}
		</>
	)
}

export const CreateNewRow = (props: CreateNewRowProps) => {
	const {
		table: {
			options: { enableCreateNewRow },
		},
	} = useTableContext()
	const { row } = props
	const isCreateNewRowEnabled = getValueOrFunctionHandler(enableCreateNewRow)({
		row,
	})

	if (!isCreateNewRowEnabled) return <tr className="table-create-new-row" />

	return <CreateNewRowMain {...props} />
}

export const Line = styled('div')`
	background: ${Colors.Blue2};
	width: 100%;
	height: 1px;
	position: absolute;
	left: 0;
	right: 0;
`
const TableRow = styled('tr')`
	height: 0;
	position: relative;
`
const ButtonsWrapper = styled('div')`
	display: flex;
	align-items: center;
	position: absolute;
	height: 32px;
	gap: 15px;
`
export const CreateNewRowCellWrapper = styled(
	'div',
	getShouldForwardProps('disabled', 'visible')
)<{ disabled?: boolean; visible?: boolean }>`
	position: absolute;
	left: 0;
	right: 0;
	z-index: 10;
	padding: 5px 0 5px 48px;
	display: flex;
	align-items: center;
	margin-top: -5px;
	opacity: 0;
	transition: opacity 0ms;
	${({ disabled }) =>
		!disabled &&
		css`
			&:hover {
				opacity: 1;
				transition: opacity 0ms 1ms;
			}
		`}
	${({ visible }) =>
		visible &&
		css`
			opacity: 1;
			transition: opacity 0ms 1ms;
		`}
`
