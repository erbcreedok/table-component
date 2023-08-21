import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Avatar, ButtonBase, SxProps } from '@mui/material'
import { forwardRef, MouseEventHandler, ReactNode, useMemo } from 'react'

import { CloseIcon } from '../icons/CloseIcon'

import { Flex } from './Flex'
import { Colors, TextColor } from './styles'
import { TooltipOverflow } from './TooltipOverflow'

const WIDTH_FOR_DELETE_WITH_AVATAR = 18
const WIDTH_FOR_DELETE_WITH_ICON = 18

const DeleteButton = styled.div`
	display: none;
	align-items: center;
	margin-left: 9px;
	position: absolute;
	width: 15px;
	top: 0;
	right: 10px;
	height: 100%;
`

const Wrapper = styled(ButtonBase)<{
	mainColor: string
	hoverColor: string
	fontColor: string
	borderColor?: string
	isDeletable?: boolean
	widthForDeleteCursor: number
}>`
	position: relative;
	justify-content: flex-start;
	align-items: center;
	display: flex;
	padding: 3px 12px 3px 12px;
	border-radius: 100px;
	font-size: 14px;
	height: 24px;

	${({ mainColor, hoverColor, fontColor }) => css`
		background-color: ${mainColor};
		color: ${fontColor};

		&:hover {
			background-color: ${hoverColor};
		}
	`}

	${({ borderColor }) =>
		borderColor &&
		css`
			border: 1px ${borderColor} solid;
		`}

  ${({ isDeletable, widthForDeleteCursor }) =>
		isDeletable &&
		css`
			&:hover {
				.tooltip-overflow {
					width: calc(100% - ${widthForDeleteCursor}px);
				}
				.delete-button {
					position: absolute;
					display: flex;
				}
			}
		`}
`

type Props = {
	children: string
	onDelete?: MouseEventHandler
	className?: string
	sx?: SxProps
} & (
	| {
			avatarUrl?: string
	  }
	| {
			icon?: ReactNode
	  }
)

export const Tag = forwardRef<HTMLButtonElement, Props>(
	({ children, onDelete, className, ...rest }, ref) => {
		const avatarUrl = 'avatarUrl' in rest ? rest.avatarUrl : null
		const icon = 'icon' in rest ? rest.icon : null

		const widthForDeleteCursor = useMemo(() => {
			if (avatarUrl) return WIDTH_FOR_DELETE_WITH_AVATAR

			return WIDTH_FOR_DELETE_WITH_ICON
		}, [avatarUrl])

		return (
			<Wrapper
				widthForDeleteCursor={widthForDeleteCursor}
				ref={ref}
				isDeletable={!!onDelete}
				onClick={onDelete}
				className={className}
				mainColor={Colors.Gray10}
				hoverColor={Colors.Gray20}
				borderColor={Colors.Gray}
				fontColor={TextColor.Primary}
				style={{
					paddingLeft: avatarUrl ? 28 : undefined,
				}}
				{...rest}
			>
				{avatarUrl && <Avatar src={avatarUrl} sizes="24px" />}
				{!!icon && <Flex sx={{ mr: '6px' }}>{icon}</Flex>}
				<TooltipOverflow className="tooltip-overflow" text={children} />
				{onDelete && (
					<DeleteButton className="delete-button">
						<CloseIcon sx={{ width: '18px', height: '18px' }} />
					</DeleteButton>
				)}
			</Wrapper>
		)
	}
)
