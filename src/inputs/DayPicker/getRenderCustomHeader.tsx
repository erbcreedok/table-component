import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { ButtonBase, styled } from '@mui/material'
import { format, getYear } from 'date-fns'
import { Dispatch, SetStateAction } from 'react'
import { ReactDatePickerCustomHeaderProps } from 'react-datepicker'

import { Flex } from '../../components/Flex'
import { Colors } from '../../components/styles'
import { getYearsPeriod } from '../../utils/getYearsPeriod'

const Wrapper = styled(Flex)`
	margin-bottom: 18px;
	font-size: 14px;
	font-weight: 600;
`

const Month = styled(ButtonBase)`
	color: ${Colors.LightBlue};
	padding: 6px 12px;
	border-radius: 3px;
	font-weight: 600;

	&:hover {
		background-color: ${Colors.LightestBlue10};
	}
`
const NavigationButton = styled(ButtonBase)`
	padding: 0 8px;
	width: 24px;
`

type Props = {
	mode?: 'month' | 'year'
	setMode: Dispatch<SetStateAction<'month' | 'year' | undefined>>
	monthsShown?: number
}

export const getRenderCustomHeader = (arg: Props) =>
	function renderCustomHeader(props: ReactDatePickerCustomHeaderProps) {
		const { mode, setMode, monthsShown = 1 } = arg
		const {
			date,
			increaseMonth,
			decreaseMonth,
			increaseYear,
			decreaseYear,
			prevMonthButtonDisabled,
			nextMonthButtonDisabled,
			changeYear,
			monthDate,
			customHeaderCount,
		} = props

		const handleChangePicker = () => {
			if (!mode) {
				setMode('month')
			}

			if (mode === 'month') {
				setMode('year')
			}

			if (mode === 'year') {
				setMode(undefined)
			}
		}

		const handlePrev = () => {
			if (!mode) {
				decreaseMonth()
			}

			if (mode === 'month') {
				decreaseYear()
			}

			if (mode === 'year') {
				changeYear(getYear(date) - 20)
			}
		}

		const handleNext = () => {
			if (!mode) {
				increaseMonth()
			}

			if (mode === 'month') {
				increaseYear()
			}
			if (mode === 'year') {
				changeYear(getYear(date) + 20)
			}
		}

		const computedPrevButtonDisabled =
			customHeaderCount !== 0 || prevMonthButtonDisabled

		const computedNextButtonDisabled =
			customHeaderCount !== monthsShown - 1 || nextMonthButtonDisabled

		const { startPeriod, endPeriod } = getYearsPeriod(date)

		return (
			<Wrapper justifyContent="space-between" alignItems="center">
				<NavigationButton
					onClick={handlePrev}
					disabled={computedPrevButtonDisabled}
				>
					{!computedPrevButtonDisabled && (
						<ExpandMoreIcon
							sx={{ transform: 'rotate(90deg)' }}
							color="inherit"
						/>
					)}
				</NavigationButton>
				<Month onClick={handleChangePicker}>
					{!mode && <>{format(monthDate, 'LLLL yyyy')}</>}
					{mode === 'month' && <>{format(monthDate, 'yyyy')}</>}
					{mode === 'year' && <>{`${startPeriod} - ${endPeriod}`}</>}
				</Month>
				<NavigationButton
					onClick={handleNext}
					disabled={computedNextButtonDisabled}
				>
					{!computedNextButtonDisabled && (
						<ExpandMoreIcon
							sx={{ transform: 'rotate(-90deg)' }}
							color="inherit"
						/>
					)}
				</NavigationButton>
			</Wrapper>
		)
	}
