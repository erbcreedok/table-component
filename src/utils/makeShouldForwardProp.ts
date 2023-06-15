export const makeShouldForwardProp = (ignoreProps: string[]) => ({
	shouldForwardProp: (prop: string) => !ignoreProps.includes(prop),
})
