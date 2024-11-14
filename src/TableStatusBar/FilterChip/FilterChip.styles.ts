import { Box, styled } from '@mui/material'

export const FilterItemBoxStyled = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 9px 12px;
	cursor: pointer;

	&:hover {
		background-color: #f5f5f5;
	}

	.filter-trash {
		display: none;
	}
	&:hover .filter-trash {
		display: block;
	}
`
