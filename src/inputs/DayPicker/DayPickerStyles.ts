import { css } from '@mui/material'

import { Colors, DEFAULT_FONT_FAMILY } from '../../components/styles'

export const dayPickerStyles = css`
	& {
		.react-datepicker {
			font-family: ${DEFAULT_FONT_FAMILY};
			display: flex;
			border-width: 0;
			box-shadow: 0 1px 2px 0 rgb(44 47 60 / 6%),
				0 3px 10px 0 rgb(44 47 60 / 9%);
		}

		.react-datepicker__header {
			background-color: transparent;
			border-bottom: none;
			padding: 0;
		}

		.react-datepicker__month {
			margin: 0;
		}
		.react-datepicker__aria-live {
			display: none;
		}

		.react-datepicker__month-container,
		.react-datepicker__year--container {
			background-color: ${Colors.White};
			padding: 18px 24px 12px;
			border-radius: 6px;
			width: 330px;
		}

		.react-datepicker__day-names {
			display: flex;
			justify-content: space-between;
			margin-bottom: 5px;
		}

		.react-datepicker__day-name {
			height: 24px;
			font-size: 12px;
			font-weight: 400;
			width: 36px;
			color: ${Colors.Gray40};
			display: flex;
			align-items: center;
			justify-content: center;
		}

		.react-datepicker__week,
		.react-datepicker__month-wrapper {
			display: flex;
			justify-content: space-between;
			height: 36px;
		}

		.react-datepicker__year-wrapper {
			display: flex;
			max-width: 330px;
			justify-content: space-between;
			flex-wrap: wrap;
		}

		.react-datepicker__year-text {
			cursor: pointer;
			display: flex;
			height: 36px;
			width: 60px;
			justify-content: center;
			align-items: center;
			border-radius: 20px;
			font-size: 14px;
			background-color: ${Colors.White};

			&:hover {
				border-radius: 20px;
				outline: 1px solid ${Colors.LightBlue};
			}
		}

		.react-datepicker__day {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			cursor: pointer;
			background-color: ${Colors.White};
			color: ${Colors.Dark};

			&:hover {
				background-color: ${Colors.White};
				color: ${Colors.Dark};
				z-index: 1;
				outline: 2px ${Colors.LightBlue} solid;
				border-radius: 9px;
			}
		}

		.react-datepicker__month-text {
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 35%;
			font-size: 14px;
			border-radius: 20px;
			background-color: ${Colors.White};

			&:hover {
				border-radius: 9px;
				outline: 2px solid ${Colors.LightBlue};
			}
		}

		.react-datepicker__day--weekend {
			color: ${Colors.Gray40};
		}

		.react-datepicker__day--today,
		.react-datepicker__month-text--today,
		.react-datepicker__year-text--today {
			color: ${Colors.LightBlue};
			position: relative;
			font-weight: 600;
		}
		.react-datepicker__day--today {
			&:hover {
				color: ${Colors.LightBlue};
			}
			&:before {
				position: absolute;
				bottom: 3px;
				left: 50%;
				transform: translateX(-50%);
				content: '';
				width: 4px;
				height: 4px;
				border-radius: 50%;
				background-color: ${Colors.LightBlue};
			}
		}

		.react-datepicker__month--selected,
		.react-datepicker__year-text--selected {
			border-radius: 20px;
			color: ${Colors.White} !important;
			background-color: ${Colors.LightBlue} !important;

			&:before {
				background: ${Colors.White};
			}
		}

		.react-datepicker__day--keyboard-selected,
		.react-datepicker__month-text--keyboard-selected {
			border-radius: 9px;
			color: ${Colors.White} !important;
			background-color: ${Colors.LightBlue} !important;
		}

		.react-datepicker__day--selecting-range-start,
		.react-datepicker__day--selecting-range-end {
			z-index: 1;
			border-radius: 9px;
			outline: 2px solid ${Colors.LightBlue};
		}
		.react-datepicker__day--in-range,
		.react-datepicker__day--in-selecting-range {
			background: ${Colors.LightestBlue};
		}

		.react-datepicker__day--selected,
		.react-datepicker__day--range-start,
		.react-datepicker__day--range-end {
			z-index: 1;
			color: ${Colors.White};
			background-color: ${Colors.LightBlue};
			border-radius: 9px;

			&.react-datepicker__day--today:before {
				bottom: 3px;
				background: ${Colors.White};
			}
		}

		.react-datepicker__day--outside-month {
			visibility: hidden;
		}

		.react-datepicker__day--disabled,
		.react-datepicker__year-text--disabled {
			color: ${Colors.Gray40};
			cursor: default;

			&:hover {
				outline: none;
			}
		}

		.react-datepicker__month .react-datepicker__month-text,
		.react-datepicker__month .react-datepicker__quarter-text,
		.react-datepicker__year .react-datepicker__year-text {
			margin: 2px;
		}
	}
`
