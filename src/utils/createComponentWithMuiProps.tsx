import { ComponentType } from 'react'

export function createComponentWithMuiProps<TProps>(
	Component: ComponentType<TProps>,
	getProps: (props: TProps) => any
) {
	return function ComponentWithMuiProps<Any extends TProps = TProps>(
		props: Any
	) {
		const _props = getProps(props)

		return <Component {...props} {..._props} />
	}
}
