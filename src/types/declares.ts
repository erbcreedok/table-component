/* eslint-disable @typescript-eslint/no-empty-interface */
import {
	CollapsedMultirowHeaderGroup,
	CollapsedMultirowRow,
	CollapsedMultirowState,
	CollapsedMultirowTableInstance,
} from '../features'

declare module '@tanstack/table-core' {
	interface Table<TData> extends CollapsedMultirowTableInstance<TData> {}
	interface ColumnMeta<TData, TValue> {
		notDisplayed?: boolean
	}
	interface TableState extends CollapsedMultirowState {}
	interface HeaderGroup<TData> extends CollapsedMultirowHeaderGroup<TData> {}
	interface Row<TData> extends CollapsedMultirowRow<TData> {
		showInTable(): void
		groupIds: Record<string, string>
		groupRows: Record<string, Row<any>>
		getParent: () => Row<TData> | undefined
		getGroupingValue: <T = any>(columnId: string) => T
		isMock?: boolean
	}
}
