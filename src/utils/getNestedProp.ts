export const getNestedProp = (object, keys) => {
	const localKeys = Array.isArray(keys) ? keys : keys.split('.')
	const localObject = object[localKeys[0]]

	if (localObject && localKeys.length > 1) {
		return getNestedProp(localObject, localKeys.slice(1))
	}

	return localObject ?? undefined
}
