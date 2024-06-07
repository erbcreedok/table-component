import { RowData } from '@tanstack/table-core'

declare module '@tanstack/table-core' {
	interface Row<TData extends RowData = RowData> {
		showInTable(): void
		groupIds: Record<string, string>
		groupRows: Record<string, Row<TData>>
		getParent: () => Row<TData> | undefined
		getGroupingValue: <T = any>(columnId: string) => T
		isMock?: boolean
	}
}
