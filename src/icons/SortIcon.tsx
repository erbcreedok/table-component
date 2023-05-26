import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const SortIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 21 22" sx={{ width: 21, height: 22 }}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M15.2114 17.6035C15.0015 17.5346 14.8225 17.3777 14.7308 17.1823L14.6755 17.0643L14.6699 12.2139C14.6669 9.54617 14.662 7.36349 14.6592 7.36349C14.6563 7.36349 14.2584 7.75791 13.775 8.23999C13.2916 8.72206 12.8575 9.14021 12.8103 9.16922C12.4069 9.41737 11.899 9.27006 11.6899 8.84425C11.6384 8.73951 11.6312 8.69974 11.6312 8.52071C11.6312 8.15401 11.5028 8.30485 13.6028 6.20586L15.4365 4.37292L17.2692 6.20547C19.3135 8.24964 19.2307 8.15533 19.2484 8.46092C19.2765 8.9469 18.8927 9.32651 18.4138 9.28636C18.1264 9.26226 18.1173 9.25512 17.1143 8.2564L16.2087 7.35474L16.1976 17.0643L16.135 17.1918C16.0554 17.3538 15.9297 17.4796 15.7677 17.5592C15.6638 17.6101 15.6084 17.6227 15.4687 17.6267C15.3709 17.6295 15.2603 17.6195 15.2114 17.6035Z"
				fill={props.htmlColor}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M5.78938 4.3966C5.99935 4.46553 6.17831 4.62237 6.27001 4.8178L6.32534 4.93575L6.33089 9.78618C6.33393 12.4539 6.33878 14.6366 6.34165 14.6366C6.34452 14.6366 6.7424 14.2422 7.22579 13.7601C7.7092 13.278 8.14331 12.8599 8.19047 12.8309C8.59394 12.5827 9.10182 12.73 9.31093 13.1558C9.36238 13.2606 9.36958 13.3004 9.36958 13.4794C9.36958 13.8461 9.49806 13.6952 7.39807 15.7942L5.56427 17.6272L3.73164 15.7946C1.68736 13.7505 1.77012 13.8448 1.75243 13.5392C1.7243 13.0532 2.10809 12.6736 2.587 12.7137C2.87447 12.7378 2.88347 12.745 3.88653 13.7437L4.79213 14.6454L4.80321 4.93575L4.86579 4.80828C4.94537 4.64625 5.07111 4.52052 5.23314 4.44094C5.33701 4.38996 5.39238 4.37744 5.53212 4.3734C5.62992 4.37058 5.74048 4.38054 5.78938 4.3966Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}