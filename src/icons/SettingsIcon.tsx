import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const SettingsIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 21 21" sx={{ width: 21, height: 21 }}>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M14 11C14 12.933 12.433 14.5 10.5 14.5C8.567 14.5 7 12.933 7 11C7 9.067 8.567 7.5 10.5 7.5C12.433 7.5 14 9.067 14 11ZM12.6875 11C12.6875 12.2081 11.7081 13.1875 10.5 13.1875C9.29188 13.1875 8.3125 12.2081 8.3125 11C8.3125 9.79188 9.29188 8.8125 10.5 8.8125C11.7081 8.8125 12.6875 9.79188 12.6875 11Z"
				fill={props.htmlColor}
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M10.5 1.375C10.2656 1.375 10.0331 1.38339 9.80278 1.39989C9.13467 1.44777 8.62546 1.93913 8.47949 2.54031L8.17145 3.80899C8.15483 3.87746 8.09311 3.95964 7.97513 4.00222C7.75763 4.08071 7.54485 4.16904 7.33735 4.26666C7.224 4.31998 7.12229 4.30556 7.06208 4.26888L5.94707 3.58954C5.41901 3.26781 4.7119 3.28024 4.20561 3.71824C3.85318 4.02313 3.52313 4.35318 3.21824 4.70561C2.78024 5.2119 2.76781 5.91901 3.08954 6.44707L3.76888 7.56208C3.80556 7.62229 3.81998 7.724 3.76665 7.83735C3.66904 8.04485 3.58071 8.25763 3.50222 8.47513C3.45964 8.59311 3.37746 8.65483 3.30899 8.67145L2.04031 8.97949C1.43913 9.12546 0.947768 9.63467 0.899894 10.3028C0.883388 10.5331 0.875 10.7656 0.875 11C0.875 11.2344 0.883388 11.4669 0.899894 11.6972C0.947768 12.3653 1.43913 12.8745 2.04031 13.0205L3.30899 13.3285C3.37746 13.3452 3.45964 13.4069 3.50222 13.5249C3.58071 13.7424 3.66904 13.9551 3.76665 14.1626C3.81998 14.276 3.80556 14.3777 3.76888 14.4379L3.08954 15.5529C2.76781 16.081 2.78024 16.7881 3.21824 17.2944C3.52313 17.6468 3.85318 17.9769 4.20561 18.2818C4.7119 18.7198 5.41901 18.7322 5.94707 18.4105L7.06208 17.7311C7.12228 17.6944 7.224 17.68 7.33735 17.7333C7.54486 17.831 7.75763 17.9193 7.97513 17.9978C8.09311 18.0404 8.15483 18.1225 8.17145 18.191L8.47949 19.4597C8.62546 20.0609 9.13467 20.5522 9.80278 20.6001C10.0331 20.6166 10.2656 20.625 10.5 20.625C10.7344 20.625 10.9669 20.6166 11.1972 20.6001C11.8653 20.5522 12.3745 20.0609 12.5205 19.4597L12.8285 18.191C12.8452 18.1225 12.9069 18.0404 13.0249 17.9978C13.2424 17.9193 13.4551 17.831 13.6626 17.7333C13.776 17.68 13.8777 17.6944 13.9379 17.7311L15.0529 18.4105C15.581 18.7322 16.2881 18.7198 16.7944 18.2818C17.1468 17.9769 17.4769 17.6468 17.7818 17.2944C18.2198 16.7881 18.2322 16.081 17.9105 15.5529L17.2311 14.4379C17.1944 14.3777 17.18 14.276 17.2333 14.1626C17.331 13.9551 17.4193 13.7424 17.4978 13.5249C17.5404 13.4069 17.6225 13.3452 17.691 13.3285L18.9597 13.0205C19.5609 12.8745 20.0522 12.3653 20.1001 11.6972C20.1166 11.4669 20.125 11.2344 20.125 11C20.125 10.7656 20.1166 10.5331 20.1001 10.3028C20.0522 9.63467 19.5609 9.12546 18.9597 8.97949L17.691 8.67145C17.6225 8.65483 17.5404 8.59311 17.4978 8.47513C17.4193 8.25763 17.331 8.04486 17.2333 7.83735C17.18 7.724 17.1944 7.62229 17.2311 7.56208L17.9105 6.44707C18.2322 5.91901 18.2198 5.2119 17.7818 4.70561C17.4769 4.35318 17.1468 4.02313 16.7944 3.71824C16.2881 3.28024 15.581 3.26781 15.0529 3.58954L13.9379 4.26888C13.8777 4.30556 13.776 4.31998 13.6626 4.26665C13.4551 4.16904 13.2424 4.08071 13.0249 4.00222C12.9069 3.95964 12.8452 3.87746 12.8285 3.80899L12.5205 2.54031C12.3745 1.93913 11.8653 1.44777 11.1972 1.39989C10.9669 1.38339 10.7344 1.375 10.5 1.375ZM9.89659 2.70904C10.0958 2.69477 10.297 2.6875 10.5 2.6875C10.703 2.6875 10.9042 2.69477 11.1034 2.70904C11.152 2.71252 11.2215 2.75291 11.2451 2.84998L11.5531 4.11867C11.6863 4.66721 12.1001 5.06385 12.5793 5.23679C12.7582 5.30133 12.9332 5.37398 13.1039 5.4543C13.5653 5.67134 14.1386 5.68351 14.6208 5.38973L15.7358 4.71039C15.8211 4.65843 15.8988 4.67896 15.9357 4.71084C16.2403 4.97439 16.5256 5.25969 16.7892 5.56432C16.821 5.60118 16.8416 5.67889 16.7896 5.76417L16.1103 6.87918C15.8165 7.36136 15.8287 7.93471 16.0457 8.39607C16.126 8.56679 16.1987 8.7418 16.2632 8.92065C16.4362 9.3999 16.8328 9.81371 17.3813 9.9469L18.65 10.2549C18.7471 10.2785 18.7875 10.348 18.791 10.3966C18.8052 10.5958 18.8125 10.797 18.8125 11C18.8125 11.203 18.8052 11.4042 18.791 11.6034C18.7875 11.652 18.7471 11.7215 18.65 11.7451L17.3813 12.0531C16.8328 12.1863 16.4362 12.6001 16.2632 13.0793C16.1987 13.2582 16.126 13.4332 16.0457 13.6039C15.8287 14.0653 15.8165 14.6386 16.1103 15.1208L16.7896 16.2358C16.8416 16.3211 16.821 16.3988 16.7892 16.4357C16.5256 16.7403 16.2403 17.0256 15.9357 17.2892C15.8988 17.321 15.8211 17.3416 15.7358 17.2896L14.6208 16.6103C14.1386 16.3165 13.5653 16.3287 13.1039 16.5457C12.9332 16.626 12.7582 16.6987 12.5793 16.7632C12.1001 16.9362 11.6863 17.3328 11.5531 17.8813L11.2451 19.15C11.2215 19.2471 11.152 19.2875 11.1034 19.291C10.9042 19.3052 10.703 19.3125 10.5 19.3125C10.297 19.3125 10.0958 19.3052 9.89659 19.291C9.848 19.2875 9.77851 19.2471 9.75494 19.15L9.4469 17.8813C9.31371 17.3328 8.8999 16.9362 8.42065 16.7632C8.2418 16.6987 8.06679 16.626 7.89607 16.5457C7.43472 16.3287 6.86136 16.3165 6.37918 16.6103L5.26417 17.2896C5.17889 17.3416 5.10118 17.321 5.06432 17.2892C4.75969 17.0256 4.47439 16.7403 4.21084 16.4357C4.17896 16.3988 4.15843 16.3211 4.21039 16.2358L4.88973 15.1208C5.18351 14.6386 5.17134 14.0653 4.9543 13.6039C4.87398 13.4332 4.80133 13.2582 4.73679 13.0793C4.56385 12.6001 4.16721 12.1863 3.61867 12.0531L2.34998 11.7451C2.25291 11.7215 2.21252 11.652 2.20904 11.6034C2.19477 11.4042 2.1875 11.203 2.1875 11C2.1875 10.797 2.19477 10.5958 2.20904 10.3966C2.21252 10.348 2.25291 10.2785 2.34998 10.2549L3.61867 9.9469C4.16721 9.81371 4.56385 9.3999 4.73679 8.92065C4.80133 8.7418 4.87398 8.56679 4.9543 8.39607C5.17134 7.93472 5.18351 7.36136 4.88973 6.87918L4.21039 5.76417C4.15843 5.67889 4.17896 5.60118 4.21084 5.56432C4.47439 5.25969 4.75969 4.97439 5.06432 4.71084C5.10118 4.67896 5.17889 4.65843 5.26417 4.71039L6.37918 5.38973C6.86136 5.68351 7.43472 5.67134 7.89607 5.4543C8.06679 5.37398 8.2418 5.30133 8.42065 5.23679C8.8999 5.06385 9.31371 4.66721 9.4469 4.11867L9.75494 2.84998C9.77851 2.75291 9.848 2.71252 9.89659 2.70904Z"
				fill={props.htmlColor}
			/>
		</SvgIcon>
	)
}