import React from 'react'
import { styled, tooltipClasses, TooltipProps } from '@mui/material'
import MuiTooltip from '@mui/material/Tooltip'

export const TestRowTooltipComponent = (props) => {
	const { row } = props

	return <MuiTooltip title={row.original.member.fullName} {...props} />
}

export const TestRowTooltipStyledComponent = styled(
	({ className, ...props }: TooltipProps & { row: any }) => {
		const { row } = props

		return (
			<MuiTooltip
				arrow
				placement="bottom-start"
				classes={{ popper: className }}
				{...props}
				title={row.original.member.fullName}
			/>
		)
	}
)(() => ({
	marginLeft: '20px !important',
	[`& .${tooltipClasses.arrow}`]: {
		color: '#ababab',
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: 'white',
		color: 'black',
		boxShadow: 'inset 0px 0px 18px -4px rgba(0,0,0,0.75)',
	},
}))

export const TestRowTooltipFollowCursor = (props) => {
	const { row } = props

	return (
		<MuiTooltip title={row.original.member.fullName} followCursor {...props} />
	)
}
