import { faker } from '@faker-js/faker'
import { Meta, Story } from '@storybook/react'
import React, { useState } from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../../'

const meta: Meta = {
	title: 'Features/Infinite Scroll Examples',
}

export default meta;

const columns: Table_ColumnDef<typeof dataDefault[0]>[] = [
    {
        header: 'First Name',
        accessorKey: 'firstName',
    },
    {
        header: 'Last Name',
        accessorKey: 'lastName',
    },
    {
        header: 'Age',
        accessorKey: 'age',
    },
    {
        header: 'Address',
        accessorKey: 'address',
    },
];

const makeData = (arrayLength = 25) => {
    return [...Array(arrayLength)].map(() => ({
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        age: faker.datatype.number(80),
        address: faker.address.streetAddress(),
    }))
}
const dataDefault = makeData(50);

export const InfiniteScrollEnabledDefault: Story<TableComponentProps> = () => {
    const [data, setData] = useState(dataDefault)
    const [isDataLoading, setIsDataLoading] = useState(false)

    const handleLoadData = () => {
        const newData = makeData()

        setIsDataLoading(true)
        setTimeout(() => {
            setIsDataLoading(false)
            setData([...data, ...newData])
        }, 5000);
    }

    return (
        <TableComponent
            columns={columns}
            data={data}
            onInfiniteScrollLoad={handleLoadData}
            showBottomProggressBar={isDataLoading}
            enablePagination
        />
    )
};
