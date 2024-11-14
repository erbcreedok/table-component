import { Meta, Story } from '@storybook/react'
import React from 'react'
import TableComponent, { Table_ColumnDef, TableComponentProps } from '../..'

const meta: Meta = {
	title: 'Data Examples/Teams',
}

export default meta

const columns: Table_ColumnDef<any>[] = [
	{
		header: 'Role',
		id: 'role',
		accessorKey: 'role',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		enablePinning: false,
		enableResizing: false,
		size: 100,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Team Member',
		id: 'employeeName',
		accessorKey: 'employeeName',
		enableColumnOrdering: false,
		enableColumnFilter: false,
		enableHiding: false,
		enablePinning: false,
		enableResizing: false,
		size: 250,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Level',
		id: 'employeeLevel',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		enablePinning: false,
		enableResizing: false,
		size: 70,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Location',
		id: 'location',
		enableColumnOrdering: true,
		enableColumnFilter: false,
		enableHiding: true,
		enablePinning: false,
		enableResizing: false,
		size: 150,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Avg Performance (last 6 months)',
		id: 'averagePerformance',
		enableColumnOrdering: true,
		enableColumnFilter: false,
		enableHiding: true,
		enablePinning: false,
		enableResizing: false,
		size: 170,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Risk of Leaving',
		id: 'riskValue',
		enableColumnOrdering: true,
		enableColumnFilter: false,
		enableHiding: true,
		enablePinning: false,
		enableResizing: false,
		size: 120,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Impact on the Project',
		id: 'impactValue',
		enableColumnOrdering: true,
		enableColumnFilter: false,
		enableHiding: true,
		enablePinning: false,
		enableResizing: false,
		size: 135,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Required Skills',
		id: 'expertize',
		enableColumnOrdering: true,
		enableColumnFilter: false,
		enableHiding: true,
		enablePinning: false,
		enableResizing: false,
		size: 150,
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jan 23',
		id: 'wrkl-id-0',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jan 23',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Feb 23',
		id: 'wrkl-id-1',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Feb',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Mar 23',
		id: 'wrkl-id-2',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Mar',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Apr 23',
		id: 'wrkl-id-3',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Apr',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'May 23',
		id: 'wrkl-id-4',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'May',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jun 23',
		id: 'wrkl-id-5',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jun',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jul 23',
		id: 'wrkl-id-6',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jul',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Aug 23',
		id: 'wrkl-id-7',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Aug',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Sep 23',
		id: 'wrkl-id-8',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Sep',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Oct 23',
		id: 'wrkl-id-9',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Oct',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Nov 23',
		id: 'wrkl-id-10',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Nov',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Dec 23',
		id: 'wrkl-id-11',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Dec 23',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jan 24',
		id: 'wrkl-id-12',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jan 24',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Feb 24',
		id: 'wrkl-id-13',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Feb',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Mar 24',
		id: 'wrkl-id-14',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Mar',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Apr 24',
		id: 'wrkl-id-15',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Apr',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'May 24',
		id: 'wrkl-id-16',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'May',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jun 24',
		id: 'wrkl-id-17',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jun',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jul 24',
		id: 'wrkl-id-18',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jul',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Aug 24',
		id: 'wrkl-id-19',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Aug',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Sep 24',
		id: 'wrkl-id-20',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Sep',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Oct 24',
		id: 'wrkl-id-21',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Oct',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Nov 24',
		id: 'wrkl-id-22',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Nov',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Dec 24',
		id: 'wrkl-id-23',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Dec 24',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jan 25',
		id: 'wrkl-id-24',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jan 25',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Feb 25',
		id: 'wrkl-id-25',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Feb',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Mar 25',
		id: 'wrkl-id-26',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Mar',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Apr 25',
		id: 'wrkl-id-27',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Apr',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'May 25',
		id: 'wrkl-id-28',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'May',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jun 25',
		id: 'wrkl-id-29',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jun',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Jul 25',
		id: 'wrkl-id-30',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jul',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Aug 25',
		id: 'wrkl-id-31',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Aug',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		sortUndefined: 1,
	},
	{
		header: 'Sep 25',
		id: 'wrkl-id-32',
		enableColumnOrdering: false,
		// enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Sep',
		// unitId: '8503000000000021165',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		// _filterFn: 'arrIncludesSome',
		sortUndefined: 1,
	},
	{
		header: 'Oct 25',
		id: 'wrkl-id-33',
		enableColumnOrdering: false,
		// enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Oct',
		// unitId: '8503000000000021165',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		// _filterFn: 'arrIncludesSome',
		sortUndefined: 1,
	},
	{
		header: 'Nov 25',
		id: 'wrkl-id-34',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Nov',
		// unitId: '8503000000000021165',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		// _filterFn: 'arrIncludesSome',
		sortUndefined: 1,
	},
	{
		header: 'Dec 25',
		id: 'wrkl-id-35',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Dec 25',
		// unitId: '8503000000000021165',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		// _filterFn: 'arrIncludesSome',
		sortUndefined: 1,
	},
	{
		header: 'Jan 26',
		id: 'wrkl-id-36',
		// 	accessorKey: 'name',
		enableColumnOrdering: false,
		enableHiding: false,
		enableColumnFilter: false,
		size: 70,
		enableResizing: false,
		enablePinning: false,
		minSize: 70,
		shortHeader: 'Jan 26',
		// unitId: '8503000000000021165',
		filterVariant: 'multi-select',
		columnDefType: 'data',
		// _filterFn: 'arrIncludesSome',
		sortUndefined: 1,
	},
]

const data: any[] = [
	{
		positionExtId: '520619286',
		profileExtId: 'e7c175ec-f427-43e3-93c4-2bbd555a084d',
		employeeExtId: '8760000000006293839',
		employeeName: 'Igor Sukharev',
		avatarUrl:
			'https://static.cdn.epam.com/avatar/c8cbfc9ca2370eed28de9fb4fdb8ac7a.jpg',
		employeeLevel: '3',
		employeeTrack: 'A',
		role: 'Key Developer',
		title: 'Senior Software Engineer',
		unitExtId: '8503000000000021165',
		unitName: 'Uber Table',
		unitType: 'STREAM',
		projectName: 'EPM-DCE',
		expertize: 'JavaScript, ReactJS, TypeScript',
		location: 'Georgia, Tbilisi, Kvernadze, 10',
		startDate: '2023-09-06T00:00:00Z',
		plannedEndDate: '2024-06-30T00:00:00Z',
		timeOnProject: '4 months',
		daysOnProject: 133,
		workloadPosition: [
			{
				workload: 86,
				yearMonth: '2023-09',
			},
			{
				workload: 100,
				yearMonth: '2023-10',
			},
			{
				workload: 100,
				yearMonth: '2023-11',
			},
			{
				workload: 100,
				yearMonth: '2023-12',
			},
			{
				workload: 100,
				yearMonth: '2024-01',
			},
			{
				workload: 100,
				yearMonth: '2024-02',
			},
			{
				workload: 100,
				yearMonth: '2024-03',
			},
			{
				workload: 100,
				yearMonth: '2024-04',
			},
			{
				workload: 100,
				yearMonth: '2024-05',
			},
			{
				workload: 100,
				yearMonth: '2024-06',
			},
			{
				workload: 0,
				yearMonth: '2024-07',
			},
			{
				workload: 0,
				yearMonth: '2024-08',
			},
			{
				workload: 0,
				yearMonth: '2024-09',
			},
			{
				workload: 0,
				yearMonth: '2024-10',
			},
			{
				workload: 0,
				yearMonth: '2024-11',
			},
			{
				workload: 0,
				yearMonth: '2024-12',
			},
			{
				workload: 0,
				yearMonth: '2025-01',
			},
			{
				workload: 0,
				yearMonth: '2025-02',
			},
			{
				workload: 0,
				yearMonth: '2025-03',
			},
			{
				workload: 0,
				yearMonth: '2025-04',
			},
			{
				workload: 0,
				yearMonth: '2025-05',
			},
			{
				workload: 0,
				yearMonth: '2025-06',
			},
			{
				workload: 0,
				yearMonth: '2025-07',
			},
			{
				workload: 0,
				yearMonth: '2025-08',
			},
			{
				workload: 0,
				yearMonth: '2025-09',
			},
			{
				workload: 0,
				yearMonth: '2025-10',
			},
			{
				workload: 0,
				yearMonth: '2025-11',
			},
			{
				workload: 0,
				yearMonth: '2025-12',
			},
			{
				workload: 0,
				yearMonth: '2026-01',
			},
		],
		workloadEmployee: [
			{
				yearMonth: '2023-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 86,
					},
				],
			},
			{
				yearMonth: '2023-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2026-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
		],
		profileAccessSet: {
			accessScopes: ['SELF'],
			mainAccessScope: 'SELF',
			canAddSuccessor: true,
		},
		positionAccessScope: ['BASIC'],
		performanceValue: 'No permission',
		averagePerformance: 'No permission',
		riskValue: 'No permission',
		impactValue: 'No permission',
	},
	{
		positionExtId: '416826826',
		profileExtId: 'ea4903fe-30b0-4f80-8e29-d9a4784660c0',
		employeeExtId: '4060741400358545501',
		employeeName: 'Tatiana Petrovskaia',
		avatarUrl:
			'https://static.cdn.epam.com/avatar/c855538230109a2cf981db064cac23f4.jpg',
		employeeLevel: '3',
		employeeTrack: 'A',
		role: 'Business Analyst',
		title: 'Senior Business Analyst',
		unitExtId: '8503000000000021165',
		unitName: 'Uber Table',
		unitType: 'STREAM',
		projectName: 'EPM-DCE',
		expertize: 'Business Analysis',
		location: 'Spain, Malaga, Avenida Imperio Argentina, 19-21',
		startDate: '2023-01-02T00:00:00Z',
		plannedEndDate: '2024-06-30T00:00:00Z',
		timeOnProject: '1 year',
		daysOnProject: 380,
		workloadPosition: [
			{
				workload: 50,
				yearMonth: '2023-01',
			},
			{
				workload: 50,
				yearMonth: '2023-02',
			},
			{
				workload: 50,
				yearMonth: '2023-03',
			},
			{
				workload: 50,
				yearMonth: '2023-04',
			},
			{
				workload: 50,
				yearMonth: '2023-05',
			},
			{
				workload: 50,
				yearMonth: '2023-06',
			},
			{
				workload: 50,
				yearMonth: '2023-07',
			},
			{
				workload: 100,
				yearMonth: '2023-08',
			},
			{
				workload: 100,
				yearMonth: '2023-09',
			},
			{
				workload: 100,
				yearMonth: '2023-10',
			},
			{
				workload: 100,
				yearMonth: '2023-11',
			},
			{
				workload: 100,
				yearMonth: '2023-12',
			},
			{
				workload: 100,
				yearMonth: '2024-01',
			},
			{
				workload: 100,
				yearMonth: '2024-02',
			},
			{
				workload: 100,
				yearMonth: '2024-03',
			},
			{
				workload: 100,
				yearMonth: '2024-04',
			},
			{
				workload: 100,
				yearMonth: '2024-05',
			},
			{
				workload: 100,
				yearMonth: '2024-06',
			},
			{
				workload: 0,
				yearMonth: '2024-07',
			},
			{
				workload: 0,
				yearMonth: '2024-08',
			},
			{
				workload: 0,
				yearMonth: '2024-09',
			},
			{
				workload: 0,
				yearMonth: '2024-10',
			},
			{
				workload: 0,
				yearMonth: '2024-11',
			},
			{
				workload: 0,
				yearMonth: '2024-12',
			},
			{
				workload: 0,
				yearMonth: '2025-01',
			},
			{
				workload: 0,
				yearMonth: '2025-02',
			},
			{
				workload: 0,
				yearMonth: '2025-03',
			},
			{
				workload: 0,
				yearMonth: '2025-04',
			},
			{
				workload: 0,
				yearMonth: '2025-05',
			},
			{
				workload: 0,
				yearMonth: '2025-06',
			},
			{
				workload: 0,
				yearMonth: '2025-07',
			},
			{
				workload: 0,
				yearMonth: '2025-08',
			},
			{
				workload: 0,
				yearMonth: '2025-09',
			},
			{
				workload: 0,
				yearMonth: '2025-10',
			},
			{
				workload: 0,
				yearMonth: '2025-11',
			},
			{
				workload: 0,
				yearMonth: '2025-12',
			},
			{
				workload: 0,
				yearMonth: '2026-01',
			},
		],
		workloadEmployee: [
			{
				yearMonth: '2023-01',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 50,
					},
				],
			},
			{
				yearMonth: '2023-02',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
				],
			},
			{
				yearMonth: '2023-03',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 22,
					},
				],
			},
			{
				yearMonth: '2023-04',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-05',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-06',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-07',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 50,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-08',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 20,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 30,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-09',
				positionWorkload: [
					{
						unitName: 'EPM-PLX',
						role: 'Business Analysis Team Lead',
						workload: 15,
					},
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
					{
						unitName: 'EPM-CLUB',
						role: 'Business Analyst',
						workload: 0,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
					{
						unitName: 'NUNA-DEV',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2023-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2026-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Business Analyst',
						workload: 0,
					},
				],
			},
		],
		profileAccessSet: {
			accessScopes: ['NO'],
			mainAccessScope: 'NO',
			canAddSuccessor: true,
		},
		positionAccessScope: ['BASIC'],
		performanceValue: 'No permission',
		averagePerformance: 'No permission',
		riskValue: 'No permission',
		impactValue: 'No permission',
	},
	{
		positionExtId: '499005065',
		profileExtId: '8dbe67f3-2f86-44de-a0d7-46f78f34cf53',
		employeeExtId: '4060741400330838312',
		employeeName: 'Uladzislau Piatrenka',
		avatarUrl:
			'https://static.cdn.epam.com/avatar/665dc52b01fd43e5cd7a62bf8a6653f9.jpg',
		employeeLevel: '2',
		employeeTrack: 'A',
		role: 'Developer',
		title: 'Software Engineer',
		unitExtId: '8503000000000021165',
		unitName: 'Uber Table',
		unitType: 'STREAM',
		projectName: 'EPM-DCE',
		expertize: 'Front-End Development, ReactJS, Russian, Troubleshooting',
		location: 'Georgia, Tbilisi, Kvernadze, 10',
		startDate: '2023-08-01T00:00:00Z',
		plannedEndDate: '2024-06-30T00:00:00Z',
		timeOnProject: '5 months',
		daysOnProject: 169,
		workloadPosition: [
			{
				workload: 100,
				yearMonth: '2023-08',
			},
			{
				workload: 100,
				yearMonth: '2023-09',
			},
			{
				workload: 100,
				yearMonth: '2023-10',
			},
			{
				workload: 100,
				yearMonth: '2023-11',
			},
			{
				workload: 100,
				yearMonth: '2023-12',
			},
			{
				workload: 100,
				yearMonth: '2024-01',
			},
			{
				workload: 100,
				yearMonth: '2024-02',
			},
			{
				workload: 100,
				yearMonth: '2024-03',
			},
			{
				workload: 100,
				yearMonth: '2024-04',
			},
			{
				workload: 100,
				yearMonth: '2024-05',
			},
			{
				workload: 100,
				yearMonth: '2024-06',
			},
			{
				workload: 0,
				yearMonth: '2024-07',
			},
			{
				workload: 0,
				yearMonth: '2024-08',
			},
			{
				workload: 0,
				yearMonth: '2024-09',
			},
			{
				workload: 0,
				yearMonth: '2024-10',
			},
			{
				workload: 0,
				yearMonth: '2024-11',
			},
			{
				workload: 0,
				yearMonth: '2024-12',
			},
			{
				workload: 0,
				yearMonth: '2025-01',
			},
			{
				workload: 0,
				yearMonth: '2025-02',
			},
			{
				workload: 0,
				yearMonth: '2025-03',
			},
			{
				workload: 0,
				yearMonth: '2025-04',
			},
			{
				workload: 0,
				yearMonth: '2025-05',
			},
			{
				workload: 0,
				yearMonth: '2025-06',
			},
			{
				workload: 0,
				yearMonth: '2025-07',
			},
			{
				workload: 0,
				yearMonth: '2025-08',
			},
			{
				workload: 0,
				yearMonth: '2025-09',
			},
			{
				workload: 0,
				yearMonth: '2025-10',
			},
			{
				workload: 0,
				yearMonth: '2025-11',
			},
			{
				workload: 0,
				yearMonth: '2025-12',
			},
			{
				workload: 0,
				yearMonth: '2026-01',
			},
		],
		workloadEmployee: [
			{
				yearMonth: '2023-01',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-02',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-03',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-04',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-05',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-06',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-07',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2026-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Developer',
						workload: 0,
					},
				],
			},
		],
		profileAccessSet: {
			accessScopes: ['NO'],
			mainAccessScope: 'NO',
			canAddSuccessor: true,
		},
		positionAccessScope: ['BASIC'],
		performanceValue: 'No permission',
		averagePerformance: 'No permission',
		riskValue: 'No permission',
		impactValue: 'No permission',
	},
	{
		positionExtId: '499005127',
		profileExtId: '0383fe2f-7b77-437a-9518-854f83da7b71',
		employeeExtId: '8760000000000479761',
		employeeName: 'Yerbol Syzdyk',
		avatarUrl:
			'https://static.cdn.epam.com/avatar/f24a69cf72973f6cffcef0f5dcfa6ad5.jpg',
		employeeLevel: '3',
		employeeTrack: 'A',
		role: 'Key Developer',
		title: 'Senior Software Engineer',
		unitExtId: '8503000000000021165',
		unitName: 'Uber Table',
		unitType: 'STREAM',
		projectName: 'EPM-DCE',
		expertize: 'JavaScript, ReactJS',
		location: 'Kazakhstan, Almaty, Zhibek Zholy, 135/10a',
		startDate: '2023-08-01T00:00:00Z',
		plannedEndDate: '2024-06-30T00:00:00Z',
		timeOnProject: '5 months',
		daysOnProject: 169,
		workloadPosition: [
			{
				workload: 100,
				yearMonth: '2023-08',
			},
			{
				workload: 100,
				yearMonth: '2023-09',
			},
			{
				workload: 100,
				yearMonth: '2023-10',
			},
			{
				workload: 100,
				yearMonth: '2023-11',
			},
			{
				workload: 100,
				yearMonth: '2023-12',
			},
			{
				workload: 100,
				yearMonth: '2024-01',
			},
			{
				workload: 100,
				yearMonth: '2024-02',
			},
			{
				workload: 100,
				yearMonth: '2024-03',
			},
			{
				workload: 100,
				yearMonth: '2024-04',
			},
			{
				workload: 100,
				yearMonth: '2024-05',
			},
			{
				workload: 100,
				yearMonth: '2024-06',
			},
			{
				workload: 0,
				yearMonth: '2024-07',
			},
			{
				workload: 0,
				yearMonth: '2024-08',
			},
			{
				workload: 0,
				yearMonth: '2024-09',
			},
			{
				workload: 0,
				yearMonth: '2024-10',
			},
			{
				workload: 0,
				yearMonth: '2024-11',
			},
			{
				workload: 0,
				yearMonth: '2024-12',
			},
			{
				workload: 0,
				yearMonth: '2025-01',
			},
			{
				workload: 0,
				yearMonth: '2025-02',
			},
			{
				workload: 0,
				yearMonth: '2025-03',
			},
			{
				workload: 0,
				yearMonth: '2025-04',
			},
			{
				workload: 0,
				yearMonth: '2025-05',
			},
			{
				workload: 0,
				yearMonth: '2025-06',
			},
			{
				workload: 0,
				yearMonth: '2025-07',
			},
			{
				workload: 0,
				yearMonth: '2025-08',
			},
			{
				workload: 0,
				yearMonth: '2025-09',
			},
			{
				workload: 0,
				yearMonth: '2025-10',
			},
			{
				workload: 0,
				yearMonth: '2025-11',
			},
			{
				workload: 0,
				yearMonth: '2025-12',
			},
			{
				workload: 0,
				yearMonth: '2026-01',
			},
		],
		workloadEmployee: [
			{
				yearMonth: '2023-01',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-02',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-03',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-04',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-05',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-06',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-07',
				positionWorkload: [
					{
						unitName: 'EPM-DMTM',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2023-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},

			{
				yearMonth: '2024-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 100,
					},
				],
			},
			{
				yearMonth: '2024-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2024-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-02',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-03',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-04',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-05',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-06',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-07',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-08',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-09',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-10',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-11',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2025-12',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
			{
				yearMonth: '2026-01',
				positionWorkload: [
					{
						unitName: 'EPM-DCE',
						role: 'Key Developer',
						workload: 0,
					},
				],
			},
		],
		profileAccessSet: {
			accessScopes: ['NO'],
			mainAccessScope: 'NO',
			canAddSuccessor: true,
		},
		positionAccessScope: ['BASIC'],
		performanceValue: 'No permission',
		averagePerformance: 'No permission',
		riskValue: 'No permission',
		impactValue: 'No permission',
	},
]

const initialState = {
	columnPinning: {
		left: [
			// 	// 'table-util-column',
			'role',
			'employeeName',
			'employeeLevel',
			'location',
			'averagePerformance',
			'riskValue',
			'impactValue',
			'expertize',
		],
	},
}

const state = {}

const multirowHeader = [
	{
		depth: 1,
		pin: false,
		columns: [
			{
				// shorthandText: <p>HHHeader</p>,
				renderText: () => <b>XXXYIIIII66565656</b>,
				text: 'Workload',
				columnIds: [
					'wrkl-id-0',
					'wrkl-id-1',
					'wrkl-id-2',
					'wrkl-id-3',
					'wrkl-id-4',
					'wrkl-id-5',
					'wrkl-id-6',
					'wrkl-id-7',
					'wrkl-id-8',
					'wrkl-id-9',
					'wrkl-id-10',
					'wrkl-id-11',
					'wrkl-id-12',
					'wrkl-id-13',
					'wrkl-id-14',
					'wrkl-id-15',
					'wrkl-id-16',
					'wrkl-id-17',
					'wrkl-id-18',
					'wrkl-id-19',
					'wrkl-id-20',
					'wrkl-id-21',
					'wrkl-id-22',
					'wrkl-id-23',
					'wrkl-id-24',
					'wrkl-id-25',
					'wrkl-id-26',
					'wrkl-id-27',
					'wrkl-id-28',
					'wrkl-id-29',
					'wrkl-id-30',
					'wrkl-id-31',
					'wrkl-id-32',
					'wrkl-id-33',
					'wrkl-id-34',
					'wrkl-id-35',
					'wrkl-id-36',
				],
			},
		],
	},
]

export const ReplicaEpmDce: Story<TableComponentProps> = () => (
	<TableComponent
		columns={columns}
		data={data}
		// enableColumnVirtualization
		// enableRowVirtualization
		initialState={initialState}
		// state={state}
		enableRowNumbers={false}
		// enableColumnOrdering
		// multirowColumnsDisplayDepth={2}
		multirowHeader={multirowHeader}
		enablePinning
	/>
)
