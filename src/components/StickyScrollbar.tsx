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

	/* display: none; // will not be able to set the scrollLeft  */
	visibility: hidden;
	z-index: 100;

	position: fixed;
	bottom: 0;

	/* position: absolute;
	top: 50%;
	left: 50%; */

	&.visible {
		visibility: visible;
	}
`

const StyledFakeContent = styled('div')`
	height: 1px; /* for the scrollbar to be visible */
`
