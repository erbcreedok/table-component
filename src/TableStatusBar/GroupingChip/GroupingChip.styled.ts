import styled from '@emotion/styled'
import { Box } from '@mui/material'

export const ItemBoxGroupingStyled = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 3px 0;
	cursor: pointer;
	width: 300px;
	margin: 0 -4px;

	&:hover {
		background-color: #f5f6fa;
	}

	.grouping-trash {
		display: none;
		height: 20px;
		margin-right: 10px;
		margin-bottom: -5px;
	}
	&:hover .grouping-trash {
		display: inline-block;
	}
`

export const ItemBoxSearchedGroupingStyled = styled(Box)`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 9px 12px;
	cursor: pointer;

	&:hover {
		background-color: #f5f6fa;
	}
`
