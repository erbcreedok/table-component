export const getShouldForwardProps = (...args: string[] | string[][]) => {
	const props = args.flat(2)
	return { shouldForwardProp: (propName: string) => !props.includes(propName) }
}
