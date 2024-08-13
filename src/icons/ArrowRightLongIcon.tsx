import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const ArrowRightLongIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon
			{...props}
			viewBox="0 0 24 24"
			sx={{ width: 24, height: 24, ...props.sx }}
		>
			<mask
				id="mask0_8255_2657"
				style={{ maskType: 'alpha' }}
				maskUnits="userSpaceOnUse"
				x="2"
				y="3"
				width="14"
				height="12"
			>
				<path
					fillRule="evenodd"
					clipRule="evenodd"
					d="M10.5669 3.49556C10.3229 3.25148 9.92714 3.25148 9.68306 3.49556C9.43898 3.73964 9.43898 4.13536 9.68306 4.37944L13.6786 8.375H2.8125C2.46732 8.375 2.1875 8.65482 2.1875 9C2.1875 9.34518 2.46732 9.625 2.8125 9.625H13.6786L9.68306 13.6206C9.43898 13.8646 9.43898 14.2604 9.68306 14.5044C9.92714 14.7485 10.3229 14.7485 10.5669 14.5044L15.5587 9.51265C15.5711 9.50029 15.5829 9.4876 15.5942 9.47459C15.7278 9.35997 15.8125 9.18987 15.8125 9C15.8125 8.81013 15.7278 8.64003 15.5942 8.52541C15.5829 8.51241 15.5711 8.49971 15.5587 8.48735L10.5669 3.49556Z"
					fill="currentColor"
				/>
			</mask>
			<g xmlns="http://www.w3.org/2000/svg" mask="url(#mask0_8255_2657)">
				<rect width="18" height="18" fill={props.color} />
			</g>
		</SvgIcon>
	)
}
