import { forwardRef } from 'react'
import { styled } from '@mui/material'

export const StickyHorizontalScrollbar = forwardRef<HTMLDivElement>(
	(_, ref) => (
		<StyledScrollbar ref={ref}>
			<StyledFakeContent />
		</StyledScrollbar>
	)
)

const StyledScrollbar = styled('div')`
	overflow-x: auto;

	visibility: hidden;
	pointer-events: none;
	z-index: 100;
	position: absolute;
	bottom: 0;

	&.visible {
		position: sticky;
		visibility: visible;
		pointer-events: auto;
	}
`

const StyledFakeContent = styled('div')`
	height: 1px; /* for the scrollbar to be visible */
`
