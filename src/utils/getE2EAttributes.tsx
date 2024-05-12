export const getE2EAttributes = (...labels: string[]) => {
	return {
		'data-e2e': labels.join(' '),
	}
}
