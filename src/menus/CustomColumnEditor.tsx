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
} from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { useBoolean, useOnClickOutside } from 'usehooks-ts'
import { useForm, SubmitHandler } from 'react-hook-form'

import {
	SetColumns,
	TableData,
	Table_DefinedColumnDef,
} from '../TableComponent'
import { useTableContext } from '../context/useTableContext'
import { handleStopPropagation } from '../utils/withStopPropagation'

import { commonListItemStyles, commonMenuItemStyles } from './constants'

type Inputs = {
	header: string
	shortHeader: string
	subtitle: string
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
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
	} = useForm<Inputs>({
		defaultValues: {
			header: columnDef.header,
			shortHeader: columnDef.shortHeader,
			subtitle: columnDef.subtitle,
		},
	})

	const {
		table: {
			options: {
				icons: { TextTypeIcon },
				localization,
				customColumns,
			},
		},
		config: { originalColumns },
	} = useTableContext()

	const handleSave: SubmitHandler<Inputs> = useCallback(
		({ header, shortHeader, subtitle }) => {
			const index = originalColumns.findIndex(
				(c) => c.accessorKey === columnDef.id
			)
			const nextColumns = [...originalColumns]
			const updatedColumn = nextColumns[index]

			updatedColumn.header = header

			if (shortHeader === '' || shortHeader === undefined)
				delete updatedColumn.shortHeader
			else updatedColumn.shortHeader = shortHeader

			if (subtitle === '' || subtitle === undefined)
				delete updatedColumn.subtitle
			else updatedColumn.subtitle = subtitle

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

	const { shortHeader, subtitle } = getValues()

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
						{shortHeader !== undefined && (
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
						{subtitle !== undefined && (
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
						<Box>
							<strong>{localization.type}</strong>
							<Select
								value="text"
								disabled
								sx={(theme) => ({
									marginTop: theme.spacing(),
								})}
								size="small"
								fullWidth
							>
								<MenuItem
									value="text"
									sx={{ ...commonMenuItemStyles, padding: '0px' }}
								>
									<Box sx={commonListItemStyles}>
										<ListItemIcon>
											<TextTypeIcon />
										</ListItemIcon>
										{localization.text}
									</Box>
								</MenuItem>
							</Select>
						</Box>
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

			<Menu
				ref={addPropertyMenuRef}
				open={isPropertyMenu}
				onClose={setPropertyMenuFalse}
				anchorEl={addPropertyRef?.current}
				sx={{ zIndex: zIndex.tooltip, width: 260 }}
			>
				<MenuList>
					<MenuItem
						onClick={() => {
							setValue('shortHeader', '')
							setPropertyMenuFalse()
						}}
					>
						<Box sx={commonListItemStyles}>{localization.shortName}</Box>
					</MenuItem>
					<MenuItem
						onClick={() => {
							setValue('subtitle', '')
							setPropertyMenuFalse()
						}}
					>
						<Box sx={commonListItemStyles}>{localization.subtitle}</Box>
					</MenuItem>
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
