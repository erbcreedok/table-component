import React, { useState } from 'react'
import { Meta, Story } from '@storybook/react'
import TableComponent, { TableComponentProps } from '../../'
import { faker } from '@faker-js/faker'
import { MenuItem } from '@mui/material'
import { ensureArray } from '../../utils/ensureArray'

const meta: Meta = {
	title: 'Features/Editing Examples',
}

export default meta

const data = [...Array(10)].map(() => ({
	firstName: faker.name.firstName(),
	lastName: faker.name.lastName(),
	address: faker.address.streetAddress(),
	state: faker.address.state(),
	phoneNumber: faker.phone.number(),
}))

export const EditingEnabledEditModeModalDefault: Story<
	TableComponentProps
> = () => {
	const [tableData, setTableData] = useState(data)

	const handleSaveRow = ({ exitEditingMode, rows, values }) => {
		ensureArray(rows).forEach((row) => {
			tableData[row.index] = values
		})
		setTableData([...tableData])
		exitEditingMode()
	}

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
					enableEditing: false,
				},
			]}
			data={tableData}
			enableEditing
			onEditingRowsSave={handleSaveRow}
		/>
	)
}

export const EditingEnabledEditModeRow: Story<TableComponentProps> = () => {
	const [tableData, setTableData] = useState(data)

	const handleSaveRow = ({ exitEditingMode, rows, values }) => {
		ensureArray(rows).forEach((row) => {
			tableData[row.index] = values
		})
		setTableData([...tableData])
		exitEditingMode()
	}

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
					enableEditing: false,
				},
			]}
			data={tableData}
			enableEditing
			editingMode="row"
			onEditingRowsSave={handleSaveRow}
		/>
	)
}

export const EditingEnabledEditModeCell: Story<TableComponentProps> = () => {
	const [tableData, setTableData] = useState(data)

	const handleSaveCell = (cell, value) => {
		tableData[cell.row.index][cell.column.id] = value
		setTableData([...tableData])
	}

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
					enableEditing: false,
				},
			]}
			data={tableData}
			editingMode="cell"
			enableEditing
			muiEditInputProps={({ cell }) => ({
				onBlur: (event) => {
					handleSaveCell(cell, event.target.value)
				},
			})}
		/>
	)
}

export const EditingEnabledEditModeTable: Story<TableComponentProps> = () => {
	const [tableData, setTableData] = useState(
		data.map((row, index) => ({
			...row,
			...(index % 3 === 0
				? {
						subRows: [...Array(4)].map(() => ({
							firstName: faker.name.firstName(),
							lastName: faker.name.lastName(),
							address: faker.address.streetAddress(),
							state: faker.address.state(),
							phoneNumber: faker.phone.number(),
						})),
				  }
				: {}),
		}))
	)

	const handleSaveCell = (cell, value) => {
		tableData[+cell.row.index][cell.column.id] = value
		setTableData([...tableData])
		console.info('saved cell with value: ', value)
	}

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
					enableEditing: ({ row }) => {
						const e =
							(!row.subRows || row.subRows.length === 0) && row.index !== 1
						return e
					},
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
				},
			]}
			data={tableData}
			enableExpanding
			enableRowNumbers={false}
			editingMode="table"
			enableEditing={({ row }) => {
				return row.index !== 1
			}}
			muiEditInputProps={({ cell }) => ({
				onBlur: (event) => {
					handleSaveCell(cell, event.target.value)
				},
			})}
		/>
	)
}

export const EditingCustomizeInput: Story<TableComponentProps> = () => {
	const [tableData, setTableData] = useState(data)

	const handleSaveRow = ({ rows, values }) => {
		ensureArray(rows).forEach((row) => {
			tableData[row.index] = values
		})
		setTableData([...tableData])
	}

	const usStates = [
		'Alabama',
		'Alaska',
		'American Samoa',
		'Arizona',
		'Arkansas',
		'California',
		'Colorado',
		'Connecticut',
		'Delaware',
		'Florida',
		'Georgia',
		'Guam',
		'Hawaii',
		'Idaho',
		'Illinois',
		'Indiana',
		'Iowa',
		'Kansas',
		'Kentucky',
		'Louisiana',
		'Maine',
		'Maryland',
		'Massachusetts',
		'Michigan',
		'Minnesota',
		'Mississippi',
		'Missouri',
		'Montana',
		'Nebraska',
		'Nevada',
		'New Hampshire',
		'New Jersey',
		'New Mexico',
		'New York',
		'North Carolina',
		'North Dakota',
		'Ohio',
		'Oklahoma',
		'Oregon',
		'Palau',
		'Pennsylvania',
		'Rhode Island',
		'South Carolina',
		'South Dakota',
		'Tennessee',
		'Texas',
		'Utah',
		'Vermont',
		'Virgin Island',
		'Virginia',
		'Washington',
		'West Virginia',
		'Wisconsin',
		'Wyoming',
	]

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
					muiEditInputProps: () => ({
						children: usStates.map((state) => (
							<MenuItem key={state} value={state}>
								{state}
							</MenuItem>
						)),
						select: true,
					}),
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
				},
			]}
			data={tableData}
			enableRowActions
			enableEditing
			muiEditInputProps={{ variant: 'outlined' }}
			onEditingRowsSave={handleSaveRow}
		/>
	)
}

// export const EditingWithValidation: Story<TableComponentProps> = () => {
//   const [tableData, setTableData] = useState(data);
//   const [firstNameError, setFirstNameError] = useState<string | boolean>(false);
//   const [lastNameError, setLastNameError] = useState<string | boolean>(false);
//   const [phoneNumberError, setPhoneNumberError] = useState<string | boolean>(
//     false,
//   );

//   const handleSaveRow = ({ row, values }) => {
//     tableData[row.index] = values;
//     setTableData([...tableData]);
//   };

//   const validateFirstName = (value: string) => {
//     if (value.length === 0) return 'First name is required';
//     return false;
//   };

//   const validateLastName = (value: string) => {
//     if (value.length === 0) return 'Last name is required';
//     return false;
//   };

//   const validatePhoneNumber = (value: string) => {
//     if (value.length === 0) return 'Phone number is required';
//     if (!value.match(/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/))
//       return 'Invalid phone number';
//     return false;
//   };

//   return (
//     <TableComponent
//       columns={[
//         {
//           header: 'First Name',
//           accessorKey: 'firstName',
//           muiTableBodyCellEditTextFieldProps: {
//             error: !!firstNameError,
//             helperText: firstNameError,
//           },
//           onCellEditChange: ({ event }) => {
//             setFirstNameError(validateFirstName(event.target.value));
//           },
//         },
//         {
//           header: 'Last Name',
//           accessorKey: 'lastName',
//           muiTableBodyCellEditTextFieldProps: {
//             error: !!lastNameError,
//             helperText: lastNameError,
//           },
//           onCellEditChange: ({ event }) => {
//             setLastNameError(validateLastName(event.target.value));
//           },
//         },
//         {
//           header: 'Phone Number',
//           accessorKey: 'phoneNumber',
//           muiTableBodyCellEditTextFieldProps: {
//             error: !!phoneNumberError,
//             helperText: phoneNumberError,
//           },
//           onCellEditChange: ({ event }) => {
//             setPhoneNumberError(validatePhoneNumber(event.target.value));
//           },
//         },
//       ]}
//       data={tableData}
//       enableRowActions
//       enableEditing
//       onEditingRowsSave={handleSaveRow}
//     />
//   );
// };

export const EditingEnabledAsync: Story<TableComponentProps> = () => {
	const [tableData, setTableData] = useState(data)
	const [isSaving, setIsSaving] = useState(false)

	const handleSaveRow = ({ rows, values }) => {
		setIsSaving(true)
		setTimeout(() => {
			ensureArray(rows).forEach((row) => {
				tableData[row.index] = values
			})
			setTableData([...tableData])
			setIsSaving(false)
		}, 1500)
	}

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
				},
			]}
			data={tableData}
			enableRowActions
			enableEditing
			onEditingRowsSave={handleSaveRow}
			state={{
				showProgressBars: isSaving,
			}}
		/>
	)
}

const nestedData = [...Array(10)].map(() => ({
	name: {
		firstName: faker.name.firstName(),
		lastName: faker.name.lastName(),
	},
	address: faker.address.streetAddress(),
	state: faker.address.state(),
	phoneNumber: faker.phone.number(),
}))

export const EditingNestedData: Story<TableComponentProps> = () => {
	const [tableData, setTableData] = useState(() => nestedData)

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorFn: (row) => row.name.firstName,
					id: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'name.lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
					enableEditing: false,
				},
			]}
			data={tableData}
			enableEditing
			onEditingRowsSave={({ rows, values }) => {
				ensureArray(rows).forEach((row) => {
					tableData[row.index] = {
						name: {
							firstName: values['name.firstName'],
							lastName: values['name.lastName'],
						},
						address: row._valuesCache.address,
						state: row._valuesCache.state,
						phoneNumber: row._valuesCache.phoneNumber,
					}
				})
				setTableData([...tableData])
			}}
		/>
	)
}

export const EditingEnabledEditModeTableWithGroupedRows: Story<
	TableComponentProps
> = () => {
	const [tableData, setTableData] = useState(data)

	const handleSaveRow = ({ exitEditingMode, rows, values }) => {
		ensureArray(rows).forEach((row) => {
			tableData[row.index] = values
		})
		setTableData([...tableData])
		exitEditingMode()
	}

	return (
		<TableComponent
			columns={[
				{
					header: 'First Name',
					accessorKey: 'firstName',
				},
				{
					header: 'Last Name',
					accessorKey: 'lastName',
				},
				{
					header: 'Address',
					accessorKey: 'address',
				},
				{
					header: 'State',
					accessorKey: 'state',
				},
				{
					header: 'Phone Number',
					accessorKey: 'phoneNumber',
					enableEditing: false,
				},
			]}
			data={tableData}
			enableEditing
			enableGrouping
			editingMode="table"
			onEditingRowsSave={handleSaveRow}
		/>
	)
}
