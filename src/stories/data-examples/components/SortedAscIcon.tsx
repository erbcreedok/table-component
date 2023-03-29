import React from 'react';
import { SvgIcon, SvgIconProps } from '@mui/material';

export const SortedAscIcon = (props: SvgIconProps) => {
    return (
        <SvgIcon {...props} viewBox="0 0 26 24" sx={{ width: 20, height: 20 }}>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.3086 3.01423C17.2145 3.03568 17.1039 3.08005 17.0135 3.13269C16.9602 3.16366 16.3823 3.73375 14.5927 5.52068C13.2998 6.81169 12.2169 7.90095 12.1863 7.94124C12.1169 8.0328 12.0706 8.12382 12.0337 8.24124C12.0096 8.31811 12.0051 8.35852 12.0051 8.49752C12.0051 8.63632 12.0096 8.67711 12.0337 8.75422C12.1548 9.14201 12.475 9.39242 12.873 9.41057C13.0708 9.41958 13.2263 9.38071 13.402 9.27833C13.4547 9.24765 13.8562 8.85411 15.0273 7.68519L16.5827 6.1328L16.5859 10.6126L16.589 15.0923L16.6178 15.1779C16.7219 15.4882 16.9366 15.7007 17.2434 15.7971C17.3203 15.8212 17.3607 15.8258 17.4997 15.8258C17.6387 15.8258 17.6791 15.8212 17.756 15.7971C18.0628 15.7007 18.2776 15.4882 18.3817 15.1779L18.4104 15.0923L18.4136 10.6126L18.4167 6.1328L19.9721 7.68519C21.5937 9.30364 21.567 9.27852 21.7419 9.34919C21.98 9.44533 22.2685 9.43287 22.4994 9.31645C22.6616 9.23467 22.8107 9.0877 22.8946 8.92692C23.019 8.68883 23.0342 8.40045 22.9354 8.15577C22.8638 7.97858 22.9294 8.04707 20.4766 5.59051C19.1855 4.29757 18.0963 3.2147 18.056 3.18414C17.9661 3.11599 17.875 3.06923 17.7625 3.03353C17.6529 2.99874 17.42 2.98884 17.3086 3.01423ZM1.72312 4.84853C1.54614 4.88717 1.39874 4.9685 1.26717 5.10007C1.07479 5.29246 0.988693 5.51574 1.00119 5.78992C1.01934 6.18791 1.26974 6.5081 1.65754 6.62919L1.74922 6.65782H5.12301H8.49681L8.58849 6.62919C8.89727 6.53278 9.11648 6.31341 9.21382 6.00341C9.23795 5.92655 9.24247 5.88614 9.24247 5.74714C9.24247 5.60814 9.23795 5.56773 9.21382 5.49086C9.11747 5.18404 8.90496 4.96929 8.5946 4.86517L8.50904 4.83646L5.15357 4.83431C2.38893 4.83253 1.78491 4.83504 1.72312 4.84853ZM1.72312 12.1829C1.5462 12.2215 1.39874 12.3028 1.26717 12.4344C1.07479 12.6268 0.988693 12.8501 1.00119 13.1243C1.01934 13.5223 1.26974 13.8424 1.65754 13.9635L1.74922 13.9922H6.03981H10.3304L10.4216 13.9635C10.7316 13.8662 10.951 13.647 11.0474 13.3382C11.0715 13.2611 11.0761 13.2203 11.0761 13.0815C11.0761 12.9427 11.0715 12.9019 11.0474 12.8248C10.952 12.5193 10.7397 12.3049 10.4282 12.1997L10.3426 12.1708L6.07037 12.1687C2.54147 12.1669 1.78507 12.1694 1.72312 12.1829ZM1.72312 19.5173C1.54629 19.5558 1.39877 19.6372 1.26717 19.7688C1.07479 19.9611 0.988693 20.1844 1.00119 20.4586C1.01934 20.8566 1.26974 21.1768 1.65754 21.2979L1.74922 21.3265H9.70698H17.6647L17.7564 21.2979C18.0652 21.2015 18.2844 20.9821 18.3818 20.6721C18.4059 20.5952 18.4104 20.5548 18.4104 20.4158C18.4104 20.2768 18.4059 20.2364 18.3818 20.1596C18.2854 19.8527 18.0729 19.638 17.7625 19.5339L17.677 19.5051L9.73754 19.503C3.15157 19.5013 1.78532 19.5037 1.72312 19.5173Z"
                fill={props.htmlColor}
            />
        </SvgIcon>
    );
};