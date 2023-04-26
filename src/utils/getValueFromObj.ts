export const getValueFromObj = <T>(
	obj: Record<string, any>,
	path: string | string[],
	def: T
): T => {
	// tslint:disable-next-line:no-shadowed-variable
	const stringToPath = (path: string | string[]) => {
		// If the path isn't a string, return it
		if (typeof path !== 'string') return path

		const output: string[] = []

		// Split to an array with dot notation
		path.split('.').forEach((item) => {
			item.split(/\[([^}]+)\]/g).forEach((key) => {
				if (key.length > 0) {
					output.push(key)
				}
			})
		})

		return output
	}

	// Get the path as an array
	// eslint-disable-next-line no-param-reassign
	path = stringToPath(path)

	// Cache the current object
	let current: Record<string, any> | T = obj

	// For each item in the path, dig into the object
	for (let i = 0; i < path.length; i++) {
		// If the item isn't found, return the default (or null)
		if (!current[path[i]]) return def

		// Otherwise, update the current  value
		current = current[path[i]]
	}

	return typeof current === 'object' ? def : current
}
