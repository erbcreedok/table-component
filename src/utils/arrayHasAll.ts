export const arrayHasAll = (
	whereArr?: unknown[] | null,
	whatArr?: unknown[] | null
) => whatArr?.every((i) => whereArr?.includes(i))
