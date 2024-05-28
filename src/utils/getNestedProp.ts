import { Row, RowData } from '@tanstack/table-core'

export const getNestedProp = <T = any>(object, keys) => {
	const localKeys = Array.isArray(keys) ? keys : keys.split('.')
	const localObject = object[localKeys[0]]

	if (localObject && localKeys.length > 1) {
		return getNestedProp(localObject, localKeys.slice(1)) as T
	}

	return (localObject ?? undefined) as T
}

const getNestedValueDescriptor: PropertyDescriptorMap = {
	getValue: {
		value(this: Row<never>, columnId: string) {
			return getNestedProp(this.original, columnId)
		},
		configurable: true,
		enumerable: true,
		writable: true,
	},
}

/**
 * This is a temporary hack to overcome the inflexibility of the TanStack's sorting/filtering functions.
 * Todo the proper flexible funtions below TanStack's helper functions.
 * For example:
 * - sort(val1, val2) => -1|0|1
 * - filter(val) => true|false
 */
export const getNestedValueRow = <TData extends RowData>(row: Row<TData>) => {
	return Object.create(row, getNestedValueDescriptor) as Row<TData>
}
