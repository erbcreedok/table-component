import {
	useVirtualizer,
	useWindowVirtualizer,
	Virtualizer,
	VirtualizerOptions,
} from '@tanstack/react-virtual'
import { FC, ReactElement } from 'react'

type Props<T extends Window | HTMLDivElement> = {
	children(virtualizer?: Virtualizer<T, HTMLTableRowElement>): ReactElement
	virtualizerProps: VirtualizerOptions<T, HTMLTableRowElement>
}

const WindowVirtualizer: FC<Props<Window>> = ({
	children,
	virtualizerProps,
}) => {
	const virtualizer = useWindowVirtualizer(virtualizerProps)

	return children(virtualizer)
}

const ScrollElementVirtualizer: FC<Props<HTMLDivElement>> = ({
	children,
	virtualizerProps,
}) => {
	const virtualizer = useVirtualizer(virtualizerProps)

	return children(virtualizer)
}

const DisabledVirtualizer: FC<Props<HTMLDivElement>> = ({ children }) => {
	return children()
}

export const getTableRowVirtualizer = (
	isEnabled?: boolean,
	isWindow?: boolean
) =>
	isEnabled
		? isWindow
			? WindowVirtualizer
			: ScrollElementVirtualizer
		: DisabledVirtualizer
