import { TestIds, E2ELabelsOption } from '../TableComponent'

import { getE2EAttributes } from './getE2EAttributes'

export const getTestAttributes = (
	e2e: E2ELabelsOption | undefined,
	name: keyof TestIds
): Record<string, string> => {
	if (!e2e?.enabled) return getE2EAttributes(name) // not set attribute

	return {
		'data-testid': (e2e.idPrefix ?? 'table_') + (e2e.ids?.[name] ?? name),
		...getE2EAttributes(name),
	}
}
