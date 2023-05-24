import { Box } from '@mui/material'
import styled from '@emotion/styled'

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

	.sorting-trash {
		display: none;
		height: 20px;
		margin-right: 10px;
	}
	&:hover .sorting-trash {
		display: inline-block;
	}
`

export const ItemBoxSearchedSortingStyled = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 9px 12px;
	cursor: pointer;

	&:hover {
		background-color: #f5f6fa;
	}
`
