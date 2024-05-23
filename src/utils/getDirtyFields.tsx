import { FormState, UseFormReturn } from 'react-hook-form'

function _getDirtyFields<T extends Record<string, any> = {}>(
	dirtyFields: FormState<T>['dirtyFields'],
	formValues: T
) {
	if (typeof dirtyFields !== 'object' || dirtyFields === null || !formValues) {
		return {} as Record<string, boolean | ReturnType<typeof _getDirtyFields>>
	}

	return Object.keys(dirtyFields).reduce((accumulator, key) => {
		const isDirty = dirtyFields[key]
		const value = formValues[key]

		// If it's an array, apply the logic recursively to each item
		if (Array.isArray(isDirty)) {
			// eslint-disable-next-line no-underscore-dangle
			const _dirtyFields = isDirty.map((item, index) =>
				_getDirtyFields(item, value[index])
			)
			if (_dirtyFields.length > 0) {
				// eslint-disable-next-line no-param-reassign
				accumulator[key] = _dirtyFields
			}
		}
		// If it's an object, apply the logic recursively
		else if (typeof isDirty === 'object' && isDirty !== null) {
			// eslint-disable-next-line no-param-reassign
			accumulator[key] = _getDirtyFields(isDirty, value)
		}
		// If it's a dirty field, get the value from formValues
		else if (isDirty) {
			// eslint-disable-next-line no-param-reassign
			accumulator[key] = value
		}

		return accumulator
	}, {} as Record<string, boolean | ReturnType<typeof _getDirtyFields>>)
}

export function getDirtyFields<T extends Record<string, any> = {}>(
	methods: UseFormReturn<T>
) {
	const {
		formState: { dirtyFields },
	} = methods
	const formValues = methods.getValues()

	return _getDirtyFields(dirtyFields, formValues)
}

export function getDirtyFieldsIds<T extends Record<string, any> = {}>(
	methods: UseFormReturn<T>
) {
	const dirtyFields = getDirtyFields(methods)

	return Object.entries(dirtyFields).reduce((acc, [rowId, rowState]) => {
		Object.entries(rowState as Record<string, any>).forEach(([columnId]) => {
			acc.push(`${rowId}.${columnId}`)
		})

		return acc
	}, [] as string[])
}
