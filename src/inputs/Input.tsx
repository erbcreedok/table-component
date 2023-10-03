import {
	inputBaseClasses,
	outlinedInputClasses,
	TextField,
	InputAdornment,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { TextFieldProps } from '@mui/material/TextField'
import Box from '@mui/material/Box'
import { PartialKeys } from '@tanstack/table-core'
import React, { MouseEventHandler, useRef } from 'react'

import { Tooltip } from '../components/Tooltip'
import { NumberStepButtons } from '../components/NumberStepButtons'
import { Colors, IconsColor, TextColor } from '../components/styles'
import { useTableContext } from '../context/useTableContext'
import { createNativeChangeEvent } from '../utils/createNativeChangeEvent'
import { mergeSx } from '../utils/mergeSx'
import { withStopPropagation } from '../utils/withStopPropagation'

export type InputProps = Omit<
	PartialKeys<TextFieldProps, 'variant'>,
	'color'
> & {
	onClear?: MouseEventHandler
	isNumeric?: boolean
	step?: number
	minValue?: number
	maxValue?: number
	errorExplanation?: string
}
export const Input = ({
	onClear,
	isNumeric,
	step = 1,
	minValue = 0,
	maxValue = Infinity,
	error,
	errorExplanation,
	...props
}: InputProps) => {
	const {
		table: {
			options: {
				icons: { CloseIcon, WarningOutlineIcon },
			},
		},
	} = useTableContext()
	const inputRef = useRef<HTMLInputElement>(null)

	const handleStepClick = (step: number) => () => {
		if (inputRef.current) {
			createNativeChangeEvent(inputRef.current, Number(props.value || 0) + step)
		}
	}

	return (
		<TextField
			variant="outlined"
			size="small"
			margin="none"
			fullWidth
			{...props}
			error={error}
			InputProps={{
				inputRef: (node) => {
					if (node) {
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						inputRef.current = node
						// eslint-disable-next-line @typescript-eslint/ban-ts-comment
						// @ts-ignore
						props.inputRef?.(node)
					}
				},
				endAdornment: error ? (
					<Tooltip
						placement="top"
						arrow
						disabled={!errorExplanation}
						title={errorExplanation}
					>
						<Box sx={{ display: 'flex', mr: '9px' }}>
							<WarningOutlineIcon sx={{ color: Colors.Red, m: 'auto' }} />
						</Box>
					</Tooltip>
				) : isNumeric ? (
					<NumberStepButtons
						sx={{ mr: '6px' }}
						onClickUp={handleStepClick(step)}
						onClickDown={handleStepClick(-step)}
					/>
				) : props.value && onClear ? (
					<IconButton
						onClick={withStopPropagation(onClear)}
						sx={{
							visibility: 'hidden',
							right: 0,
							background: 'white',
							position: 'absolute',
							[`&:hover`]: {
								background: Colors.White,
							},
							[`.${outlinedInputClasses.root}:hover &`]: {
								visibility: 'visible',
							},
						}}
					>
						<CloseIcon style={{ width: '18px', height: '18px' }} />
					</IconButton>
				) : null,
				...props.InputProps,
				inputProps: {
					...(isNumeric
						? {
								type: 'number',
								inputMode: 'numeric',
								pattern: '[0-9]*',
								min: minValue,
								max: maxValue,
						  }
						: {}),
					...props.inputProps,
				},
			}}
			sx={mergeSx(
				{
					my: '6px',
					backgroundColor: '#FFFFFF',
					borderRadius: '6px',
					[`& .${outlinedInputClasses.root}`]: {
						borderRadius: '6px',
						[`&:not(.${outlinedInputClasses.focused}):not(.${outlinedInputClasses.disabled}):not(.${outlinedInputClasses.error}):hover`]:
							{
								[`& .${outlinedInputClasses.notchedOutline}`]: {
									borderColor: Colors.Gray40,
									borderWidth: 1,
								},
							},
						[`&.${outlinedInputClasses.disabled}`]: {
							backgroundColor: Colors.LightestGray,
							[`.${outlinedInputClasses.notchedOutline}`]: {
								borderColor: Colors.Gray20,
							},
						},
						[`&.${outlinedInputClasses.error}`]: {
							[`.${outlinedInputClasses.notchedOutline}`]: {
								borderColor: Colors.Red,
							},
						},
					},
					[`& .${outlinedInputClasses.input}`]: {
						fontSize: '14px',
						padding: '9px 12px',
						lineHeight: '18px',
						height: '18px',
						color: TextColor.Dark,
						[`&::placeholder`]: {
							color: IconsColor.disabled,
							opacity: 1,
						},
						[`&::-webkit-outer-spin-button, &::-webkit-inner-spin-button`]: {
							WebkitAppearance: 'none',
							margin: 0,
						},
						[`&[type=number]`]: {
							MozAppearance: 'textfield',
						},
					},
					[`& .${outlinedInputClasses.notchedOutline}`]: {
						borderColor: Colors.BorderMain,
						borderWidth: 1,
					},
					[`& .${inputBaseClasses.adornedEnd}`]: {
						pr: 0,
					},
				},
				props.sx
			)}
		/>
	)
}
