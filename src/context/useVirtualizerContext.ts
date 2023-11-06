import { useContext } from 'react'

import { VirtualizerContext } from './VirtualizerContext'

export const useVirtualizerContext = () => {
	return useContext(VirtualizerContext)
}
