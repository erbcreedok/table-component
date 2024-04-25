import { Row, RowData } from '@tanstack/table-core'

export const getNestedProp = (object, keys) => {
	const localKeys = Array.isArray(keys) ? keys : keys.split('.')
	const localObject = object[localKeys[0]]

	if (localObject && localKeys.length > 1) {
		return getNestedProp(localObject, localKeys.slice(1))
	}

	return localObject ?? undefined
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

export const getNestedValueRow = <TData extends RowData>(row: Row<TData>) => {
	return Object.create(row, getNestedValueDescriptor) as Row<TData>
}
