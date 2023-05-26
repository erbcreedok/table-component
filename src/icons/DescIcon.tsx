import React from 'react'
import { SvgIcon, SvgIconProps } from '@mui/material'

export const DescIcon = (props: SvgIconProps) => {
	return (
		<SvgIcon {...props} viewBox="0 0 18 18" sx={{ width: 18, height: 18 }}>
			<path
				xmlns="http://www.w3.org/2000/svg"
				fillRule="evenodd"
				clipRule="evenodd"
				d="M1.29248 2.13556C1.15982 2.16446 1.04915 2.2255 0.950425 2.32423C0.806104 2.46856 0.741517 2.63606 0.750889 2.84175C0.764507 3.14032 0.95236 3.38053 1.24328 3.47137L1.31206 3.49284H7.28191H13.2518L13.3205 3.47137C13.5522 3.39904 13.7166 3.23447 13.7897 3.00191C13.8078 2.94425 13.8111 2.91393 13.8111 2.80966C13.8111 2.70538 13.8078 2.67506 13.7897 2.6174C13.7174 2.38723 13.5579 2.22613 13.3251 2.14801L13.2609 2.12647L7.30483 2.12489C2.36409 2.12357 1.33914 2.12539 1.29248 2.13556ZM12.9846 6.26162C12.8496 6.29237 12.7408 6.35257 12.6425 6.45085C12.569 6.52443 12.5259 6.58872 12.4891 6.67984C12.4374 6.80786 12.4405 6.57954 12.4403 10.1916L12.4402 13.5248L11.2733 12.3602C10.0567 11.1459 10.0768 11.1648 9.94548 11.1118C9.76692 11.0396 9.55046 11.049 9.37725 11.1363C9.25559 11.1977 9.14372 11.3079 9.08073 11.4285C8.98747 11.6072 8.97604 11.8235 9.05018 12.0071C9.10388 12.14 9.05462 12.0886 10.8948 13.9315C11.8633 14.9014 12.6804 15.7138 12.7106 15.7367C12.828 15.8257 12.9452 15.8676 13.0959 15.8745C13.2442 15.8813 13.3607 15.8521 13.4927 15.7753C13.5327 15.7521 13.9662 15.3244 15.3088 13.9839C16.2787 13.0154 17.0911 12.1982 17.114 12.168C17.1661 12.0993 17.2008 12.031 17.2285 11.9429C17.2466 11.8853 17.25 11.855 17.25 11.7507C17.25 11.6466 17.2466 11.6159 17.2285 11.5581C17.1377 11.2672 16.8975 11.0793 16.5989 11.0657C16.4505 11.059 16.3339 11.0881 16.202 11.1649C16.1625 11.1879 15.8613 11.4832 14.9827 12.3601L13.8159 13.5247L13.8135 10.164L13.8111 6.80331L13.7896 6.73912C13.7121 6.50824 13.5513 6.34785 13.3251 6.2761C13.2429 6.25 13.0682 6.24257 12.9846 6.26162ZM1.29248 7.63771C1.15976 7.66667 1.04913 7.72769 0.950425 7.8264C0.806104 7.97073 0.741517 8.13823 0.750889 8.34392C0.764507 8.64249 0.95236 8.88269 1.24328 8.97353L1.31206 8.99501H4.53082H7.74959L7.81805 8.97352C8.0506 8.90049 8.21517 8.73604 8.2875 8.5044C8.30557 8.44655 8.30898 8.41595 8.30898 8.31182C8.30898 8.2077 8.30557 8.17709 8.2875 8.11925C8.21594 7.89006 8.05665 7.72927 7.82295 7.65033L7.75876 7.62864L4.55375 7.62703C1.9064 7.62571 1.33895 7.62757 1.29248 7.63771ZM1.29248 13.1399C1.15971 13.1689 1.04913 13.2299 0.950425 13.3286C0.806104 13.4729 0.741517 13.6404 0.750889 13.8461C0.764507 14.1447 0.95236 14.3849 1.24328 14.4757L1.31206 14.4972H3.84305H6.37405L6.44283 14.4757C6.67447 14.4034 6.83892 14.2388 6.91194 14.0062C6.93004 13.9486 6.93344 13.9183 6.93344 13.814C6.93344 13.7097 6.93004 13.6794 6.91194 13.6217C6.83966 13.3916 6.68024 13.2305 6.44741 13.1523L6.38322 13.1308L3.86598 13.1292C1.79196 13.1279 1.33883 13.1297 1.29248 13.1399Z"
				fill={props.fill || '#6C6F80'}
			/>
		</SvgIcon>
	)
}