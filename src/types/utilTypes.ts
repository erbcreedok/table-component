export type FunctionProps<ReturnType, Arguments> =
	| ReturnType
	| ((arg: Arguments) => ReturnType)

export type LiteralUnion<T extends U, U = string> =
	| T
	| (U & Record<never, never>)
