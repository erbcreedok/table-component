import { FC, useCallback, useRef } from 'react'
import {
	Button,
	ListItemIcon,
	Menu,
	MenuList,
	Paper,
	Popper,
	Select,
	MenuItem,
	Box,
	TextField,
	styled,
	Switch,
	FormControlLabel,
} from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { useBoolean, useOnClickOutside } from 'usehooks-ts'
import { useForm, SubmitHandler, Controller } from 'react-hook-form'

import {
	NumericColumn,
	SetColumns,
	TableData,
	Table_ColumnDef,
	Table_DefinedColumnDef,
} from '../TableComponent'
import { useTableContext } from '../context/useTableContext'
import { handleStopPropagation } from '../utils/withStopPropagation'
import { DECIMAL_PLACES } from '../utils/constants'
import { Input } from '../inputs/Input'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

type Inputs<TData extends TableData = TableData> = Required<
	Pick<
		Table_ColumnDef<TData>,
		'header' | 'dataType' | 'shortHeader' | 'subtitle'
	>
> & {
	// numeric
	decimalPlaces: number
	allowNegative: boolean
	space1000: boolean
}

type Props<TData extends TableData = TableData> = {
	columnDef: Table_DefinedColumnDef<TData>
	setColumns: SetColumns<TData>
	close: () => void
	anchorEl: HTMLElement | null
}

export const CustomColumnEditor: FC<Props> = ({
	columnDef,
	setColumns,
	close,
	anchorEl,
}) => {
	const {
		control,
		register,
		handleSubmit,
		watch,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			// common
			header: columnDef.header,
			dataType: columnDef.dataType ?? 'textual',
			shortHeader: columnDef.shortHeader ?? '',
			subtitle: columnDef.subtitle ?? '',
			// numeric
			decimalPlaces:
				(columnDef as NumericColumn).decimalPlaces ?? DECIMAL_PLACES,
			allowNegative: columnDef.minValue !== 0,
			space1000:
				(columnDef as NumericColumn).numberFormat === undefined ||
				(columnDef as NumericColumn).numberFormat === 'SPACE1000',
		},
	})

	const {
		table: {
			options: {
				icons: { TextTypeIcon, NumericTypeIcon },
				localization,
				customColumns,
			},
		},
		config: { originalColumns },
	} = useTableContext()

	const handleSave: SubmitHandler<Inputs> = useCallback(
		({
			header,
			dataType,
			shortHeader,
			subtitle,
			decimalPlaces,
			allowNegative,
			space1000,
		}) => {
			const index = originalColumns.findIndex(
				(c) => c.accessorKey === columnDef.id
			)
			const nextColumns = [...originalColumns]
			const updatedColumn = nextColumns[index]

			// common props

			updatedColumn.header = header
			updatedColumn.dataType = dataType

			// eslint-disable-next-line default-case
			switch (dataType) {
				case 'textual':
					updatedColumn.editVariant = 'text'
					break
				case 'numeric':
					updatedColumn.editVariant = 'number'
					break
			}

			if (shortHeader === '') delete updatedColumn.shortHeader
			else updatedColumn.shortHeader = shortHeader

			if (subtitle === '') delete updatedColumn.subtitle
			else updatedColumn.subtitle = subtitle

			// numeric props

			if (dataType === 'numeric') {
				// eslint-disable-next-line no-param-reassign
				decimalPlaces = Number(decimalPlaces)
				if (decimalPlaces === DECIMAL_PLACES)
					delete (updatedColumn as NumericColumn).decimalPlaces
				else (updatedColumn as NumericColumn).decimalPlaces = decimalPlaces

				if (allowNegative) delete updatedColumn.minValue
				else updatedColumn.minValue = 0

				if (space1000) delete (updatedColumn as NumericColumn).numberFormat
				else (updatedColumn as NumericColumn).numberFormat = 'NONE'
			} else {
				delete (updatedColumn as NumericColumn).decimalPlaces
				delete updatedColumn.minValue
				delete (updatedColumn as NumericColumn).numberFormat
			}

			setColumns(nextColumns, updatedColumn, 'UPDATE')
			close()
		},
		[columnDef.id, originalColumns, setColumns, close]
	)

	const {
		value: isPropertyMenu,
		setTrue: setPropertyMenuTrue,
		setFalse: setPropertyMenuFalse,
	} = useBoolean(false)
	const addPropertyRef = useRef(null)
	const addPropertyMenuRef = useRef<HTMLDivElement>(null)

	const popperRef = useRef(null)
	// todo `useOnClickOutside([popperRef, addPropertyMenuRef], close)` when fixed <https://github.com/juliencrn/usehooks-ts/issues/531>
	useOnClickOutside(popperRef, (c: any) => {
		if (addPropertyMenuRef.current?.contains(c.target)) return

		close()
	})
	const arrowRef = useRef(null)

	const dataType = watch('dataType')

	const { value: isShortHeader, setTrue: setShortHeaderTrue } = useBoolean(
		columnDef.shortHeader !== undefined
	)
	const { value: isSubtitle, setTrue: setSubtitleTrue } = useBoolean(
		columnDef.subtitle !== undefined
	)

	return (
		<>
			<Popper
				open
				ref={popperRef}
				placement="bottom"
				anchorEl={anchorEl}
				sx={popperStyles}
				modifiers={[
					{
						name: 'arrow',
						enabled: true,
						options: {
							element: arrowRef.current,
						},
					},
					{
						name: 'offset',
						options: {
							offset: [0, 10],
						},
					},
				]}
				onMouseDown={handleStopPropagation} // for DragScrollingContainer to not mess things up
			>
				<Arrow ref={arrowRef} className="MuiPopper-arrow" />
				<form onSubmit={handleSubmit(handleSave)}>
					<Paper
						sx={{
							padding: '20px 20px 10px 20px',
							borderRadius: '6px',
							display: 'flex',
							flexDirection: 'column',
							gap: '12px',
						}}
					>
						{/* Header */}
						<Box>
							<strong>{localization.name}</strong>
							<TextField
								placeholder={localization.columnName}
								{...register('header', {
									required: localization.thisFieldIsRequired,
									validate: customColumns?.validate?.header,
								})}
								error={Boolean(errors.header)}
								helperText={errors.header?.message}
								margin="dense"
								size="small"
								fullWidth
							/>
						</Box>

						{/* Short Header */}
						{isShortHeader && (
							<Box>
								<strong>{localization.shortName}</strong>
								<TextField
									placeholder={localization.columnShortNameOptional}
									{...register('shortHeader', {
										validate: customColumns?.validate?.shortHeader,
									})}
									error={Boolean(errors.shortHeader)}
									helperText={
										errors.shortHeader?.message ||
										localization.shortNameIsDisplayedInAColumnHeader
									}
									margin="dense"
									size="small"
									fullWidth
								/>
							</Box>
						)}

						{/* Subtitle */}
						{isSubtitle && (
							<Box>
								<strong>{localization.subtitle}</strong>
								<TextField
									placeholder={localization.columnSubtitleOptional}
									{...register('subtitle', {
										validate: customColumns?.validate?.subtitle,
									})}
									error={Boolean(errors.subtitle)}
									helperText={errors.subtitle?.message}
									margin="dense"
									size="small"
									fullWidth
								/>
							</Box>
						)}

						{/* Type */}
						<Box>
							<strong>{localization.type}</strong>
							<Controller
								name="dataType"
								control={control}
								render={({ field: { value, onChange } }) => (
									<Select
										value={value}
										onChange={onChange}
										sx={(theme) => ({
											marginTop: theme.spacing(),
										})}
										MenuProps={{
											style: { zIndex: zIndex.tooltip + 1 },
										}}
										size="small"
										fullWidth
									>
										<MenuItem
											value="textual"
											sx={{ ...commonMenuItemStyles, padding: '0px' }}
										>
											<Box sx={commonListItemStyles}>
												<ListItemIcon>
													<TextTypeIcon />
												</ListItemIcon>
												{localization.text}
											</Box>
										</MenuItem>
										<MenuItem
											value="numeric"
											sx={{ ...commonMenuItemStyles, padding: '0px' }}
										>
											<Box sx={commonListItemStyles}>
												<ListItemIcon>
													<NumericTypeIcon />
												</ListItemIcon>
												{localization.numeric}
											</Box>
										</MenuItem>
									</Select>
								)}
							/>
						</Box>

						{/* Numeric Options */}
						{dataType === 'numeric' && (
							<>
								<Box>
									<strong>{localization.numberOfDecimalPlaces}</strong>
									<Controller
										name="decimalPlaces"
										control={control}
										render={({ field: { value, onChange } }) => (
											<Input
												value={value}
												onChange={onChange}
												isNumeric
												minValue={0}
												maxValue={10}
												margin="dense"
												size="small"
												fullWidth
											/>
										)}
									/>
								</Box>
								<Box>
									<FormControlLabel
										label={localization.useSpaceAs1000Separator}
										control={
											<Controller
												name="space1000"
												control={control}
												render={({ field: { value, onChange } }) => (
													<Switch
														checked={value}
														onChange={onChange}
														size="small"
													/>
												)}
											/>
										}
									/>
								</Box>
								<Box>
									<FormControlLabel
										label={localization.allowNegativeNumbers}
										control={
											<Controller
												name="allowNegative"
												control={control}
												render={({ field: { value, onChange } }) => (
													<Switch
														checked={value}
														onChange={onChange}
														size="small"
													/>
												)}
											/>
										}
									/>
								</Box>
							</>
						)}

						{/* Action Buttons */}
						<Box
							sx={(theme) => ({
								display: 'flex',
								gap: theme.spacing(),
							})}
						>
							<Button
								size="small"
								ref={addPropertyRef}
								onClick={setPropertyMenuTrue}
								disabled={isShortHeader && isSubtitle}
							>
								+ {localization.addProperty}
							</Button>
							<div style={{ flexGrow: 1 }} />
							<Button size="small" onClick={close}>
								{localization.cancel}
							</Button>
							<Button size="small" variant="contained" type="submit">
								{localization.save}
							</Button>
						</Box>
					</Paper>
				</form>
			</Popper>

			{/* Add property menu */}
			<Menu
				ref={addPropertyMenuRef}
				open={isPropertyMenu}
				onClose={setPropertyMenuFalse}
				anchorEl={addPropertyRef?.current}
				sx={{ zIndex: zIndex.tooltip, width: 260 }}
			>
				<MenuList>
					{isShortHeader ? null : (
						<MenuItem
							onClick={() => {
								setShortHeaderTrue()
								setPropertyMenuFalse()
							}}
						>
							<Box sx={commonListItemStyles}>{localization.shortName}</Box>
						</MenuItem>
					)}
					{isSubtitle ? null : (
						<MenuItem
							onClick={() => {
								setSubtitleTrue()
								setPropertyMenuFalse()
							}}
						>
							<Box sx={commonListItemStyles}>{localization.subtitle}</Box>
						</MenuItem>
					)}
				</MenuList>
			</Menu>
		</>
	)
}

const Arrow = styled('div')({
	position: 'absolute',
	fontSize: 7,
	width: '3em',
	height: '3em',
	'&::before': {
		content: '""',
		margin: 'auto',
		display: 'block',
		width: 0,
		height: 0,
		borderStyle: 'solid',
	},
})

const popperStyles = (theme) => ({
	zIndex: zIndex.tooltip,
	width: 360,
	'& > div': {
		position: 'relative',
	},
	'&[data-popper-placement*="bottom"]': {
		'& > div': {
			marginTop: 2,
		},
		'& .MuiPopper-arrow': {
			top: 0,
			left: 0,
			marginTop: '-0.9em',
			width: '3em',
			height: '1em',
			'&::before': {
				borderWidth: '0 1em 1em 1em',
				borderColor: `transparent transparent ${theme.palette.background.paper} transparent`,
			},
		},
	},
	'&[data-popper-placement*="top"]': {
		'& > div': {
			marginBottom: 2,
		},
		'& .MuiPopper-arrow': {
			bottom: 0,
			left: 0,
			marginBottom: '-0.9em',
			width: '3em',
			height: '1em',
			'&::before': {
				borderWidth: '1em 1em 0 1em',
				borderColor: `${theme.palette.background.paper} transparent transparent transparent`,
			},
		},
	},
	'&[data-popper-placement*="right"]': {
		'& > div': {
			marginLeft: 2,
		},
		'& .MuiPopper-arrow': {
			left: 0,
			marginLeft: '-0.9em',
			height: '3em',
			width: '1em',
			'&::before': {
				borderWidth: '1em 1em 1em 0',
				borderColor: `transparent ${theme.palette.background.paper} transparent transparent`,
			},
		},
	},
	'&[data-popper-placement*="left"]': {
		'& > div': {
			marginRight: 2,
		},
		'& .MuiPopper-arrow': {
			right: 0,
			marginRight: '-0.9em',
			height: '3em',
			width: '1em',
			'&::before': {
				borderWidth: '1em 0 1em 1em',
				borderColor: `transparent transparent transparent ${theme.palette.background.paper}`,
			},
		},
	},
})
