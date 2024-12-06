import { TableOptionsResolved } from '@tanstack/table-core'

// Function is copy for original getMemoOptions from tanstack/table-core
// Its only needed to improve types

export function getMemoOptions(
	tableOptions: Partial<TableOptionsResolved<any>>,
	debugLevel:
		| 'debugAll'
		| 'debugCells'
		| 'debugTable'
		| 'debugColumns'
		| 'debugRows'
		| 'debugHeaders',
	key: string,
	onChange?: (result: any) => void
) {
	return {
		debug: () => tableOptions?.debugAll ?? tableOptions[debugLevel],
		key: process.env.NODE_ENV === 'development' && key,
		onChange,
	}
}
