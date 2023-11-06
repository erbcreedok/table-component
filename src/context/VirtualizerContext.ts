import { createContext } from 'react'

type VirtualizerState = {
	virtualPaddingLeft?: number
	virtualPaddingRight?: number
}
export const VirtualizerContext = createContext<VirtualizerState>(
	{} as VirtualizerState
)
