import { useState } from 'react'

export const useChipsMounted = () => {
	const [mountedChips, setMountedChips] = useState<any>([])

	const handleSetMountedChip = (chipKey: string) => {
		return (mounted: boolean) => {
			setMountedChips((prevMountedChips) => {
				return {
					...prevMountedChips,
					[chipKey]: mounted,
				}
			})
		}
	}

	const handleClearAllChips = () => {
		setMountedChips({})
	}

	const checkIsSomeChipMounted = () => {
		return Object.values(mountedChips).some((mounted) => mounted)
	}

	const handleCheckIsChipMounted = (chipKey: string) => {
		return mountedChips[chipKey]
	}

	return {
		isSomeChipMounted: checkIsSomeChipMounted(),

		handleCheckIsChipMounted,
		handleClearAllChips,
		handleSetMountedChip,
	}
}
