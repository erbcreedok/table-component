import { TestIds, E2ELabelsOption } from '../TableComponent'

export const getTestAttributes = (
	e2e: E2ELabelsOption | undefined,
	name: keyof TestIds
): WithTestId | undefined => {
	if (!e2e?.enabled) return undefined // not set attribute

	return {
		'data-testid': (e2e.idPrefix ?? 'table_') + (e2e.ids?.[name] ?? name),
	}
}

interface WithTestId extends React.HTMLAttributes<HTMLElement> {
	'data-testid': string
}
