import MenuItem from '@mui/material/MenuItem'
import {
	CreateNewRowRenderMenuConfigArgs,
	getCellEditValue,
	OrganizeCreateNewRowButtonsProp,
} from '../../'
import { getTeamMember, getUser, isUnitTreeItem } from './getTeamMembers'

export const getOrganizeCreateNewRowButtons = (): Record<string, any> & {
	mapping: Record<string, OrganizeCreateNewRowButtonsProp | undefined>
} => ({
	options: [
		'none',
		'depth counter',
		'messages relative to current',
		'only siblings and children',
		'only siblings and children (other disabled)',
		'with options',
	],
	mapping: {
		none: undefined,
		'depth counter': ({ depthRange }) =>
			depthRange.map((depth) => ({ hint: `Depth: ${depth}`, depth })),
		'messages relative to current': ({ row, depthRange }) =>
			depthRange.map((depth) => ({
				depth,
				hint: getHint(row, depth),
			})),
		'only siblings and children': ({ row, depthRange }) =>
			depthRange.filter((depth) => row.depth <= depth),
		'only siblings and children (other disabled)': ({ row, depthRange }) =>
			depthRange.map((depth) => ({
				depth,
				disabled: row.depth > depth,
				hint:
					row.depth > depth ? 'Only sibling and children allowed' : undefined,
			})),
		'with options': ({ row, depthRange }) =>
			depthRange.map((depth) => ({
				depth,
				hint: getHint(row, depth),
				renderMenu: (props) => [
					<MenuItem key="clone" onClick={handleCloneClick(props)}>
						Clone current row data
					</MenuItem>,
					<MenuItem key="fill" onClick={handleFilledClick(props)}>
						Fill row with random data
					</MenuItem>,
					<MenuItem key="clean" onClick={handleCleanClick(props)}>
						Create clean row
					</MenuItem>,
				],
			})),
	},
	control: { type: 'select' },
	defaultValue: 'none',
})

const getHint = (row, depth) => {
	if (isUnitTreeItem(row.original)) return `As child of ${row.original.name}`
	if (depth > row.depth) return `As child of ${row.getValue('teamMember').fullName}`
	if (depth === row.depth) return `As sibling of ${row.getValue('teamMember').fullName}`
	if (depth === row.depth - 1)
		return `As parent of ${row.getValue('teamMember').fullName}`
	return `Create row ${row.depth - depth} levels higher`
}
const handleCloneClick =
	({ closeMenu, row, depth, createNewRow }: CreateNewRowRenderMenuConfigArgs) =>
	() => {
		createNewRow(
			row,
			depth,
			row
				.getAllCells()
				.reduce(
					(acc, cell) => ({ ...acc, [cell.column.id]: getCellEditValue(cell) }),
					{}
				)
		)
		closeMenu()
	}
const handleFilledClick =
	({ closeMenu, row, depth, createNewRow }: CreateNewRowRenderMenuConfigArgs) =>
	() => {
		const newTeamMember = getTeamMember(getUser('----'))
		createNewRow(row, depth, {
			...newTeamMember,
			teamMember: newTeamMember.member,
			progress: Number(newTeamMember.completion),
			hiredAt: newTeamMember.hiredAt ? new Date(newTeamMember.hiredAt) : null
		})
		closeMenu()
	}
const handleCleanClick =
	({ closeMenu, row, depth, createNewRow }: CreateNewRowRenderMenuConfigArgs) =>
	() => {
		createNewRow(row, depth)
		closeMenu()
	}
