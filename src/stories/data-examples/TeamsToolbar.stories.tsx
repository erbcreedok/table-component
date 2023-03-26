import { Meta, Story } from '@storybook/react';
import React, { useEffect, useRef, useState } from 'react';
import TableComponent from '../../index';
import { TableComponentProps } from '../../TableComponent';
import { getSeparatedTeamMembers } from '../utils/getTeamMembers';
import { getTeamMembersColumns } from '../utils/getTeamMembersColumns';
import { sortByArrayOrder } from '../utils/sortByArrayOrder';
import { TableToolbar } from '../../TableToolbar/TableToolbar';
import { Box } from '@mui/material';

const toolbarMeta: Meta = {
    title: 'Data Examples/Table Toolbar',
};

export default toolbarMeta;

const groupsSorting = {
    impact: sortByArrayOrder(['Critical', 'High', 'Medium', 'Low']),
    performance: sortByArrayOrder(['Often exceeds', 'Sometimes exceeds', 'Meets']),
    riskOfLeaving: sortByArrayOrder(['Leaver', 'High', 'Medium', 'Low']),
};

const data = getSeparatedTeamMembers();
const columns = getTeamMembersColumns();

export const TeamsToolbar: Story<TableComponentProps> = () => {
    const tableRef = useRef(null);
    const [isTableReady, setIsTableReady] = useState(false);

    useEffect(() => {
        if (tableRef.current) {
            setIsTableReady(true);
        }
    }, [tableRef]);

    return (
        <>
            {/*<Box sx={{ height: 60 }}>*/}
            {/*    {isTableReady && <TableToolbar table={tableRef.current} />}*/}
            {/*</Box>*/}
            <TableComponent
                columns={columns}
                data={data}
                enableAggregationRow={false}
                enableTopToolbar
                enableGrouping
                enableColumnResizing
                enableColumnDragging={false}
                enablePagination={false}
                groupsSorting={groupsSorting}
                groupBorder={{ left: '12px solid white', top: '20px solid white' }}
                initialState={{
                    grouping: ['impact', 'performance'],
                    columnSizing: { impact: 1, performance: 1 },
                    columnVisibility: {
                        impact: false,
                        performance: false,
                    },
                }}
                uppercaseHeader
                enableColumnOrdering
                tableInstanceRef={tableRef}
            />
        </>
    );
};
