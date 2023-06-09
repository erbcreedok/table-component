import { Box, styled } from '@mui/material'

export const SortingItemBoxStyled = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 9px 12px;
	cursor: pointer;
	width: 100%;

	&:hover {
		background-color: #f5f6fa;
	}
`

export const ItemBoxSearchedSortingStyled = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 9px 12px;
	cursor: pointer;

	& > span {
		visibility: hidden;
	}

	&:hover {
		background-color: #f5f6fa;

		& > span {
			visibility: visible;
		}
	}
`
