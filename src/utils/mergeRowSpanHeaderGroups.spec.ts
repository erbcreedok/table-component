import { mergeRowSpan, MRSHeader } from './mergeRowSpanHeaderGroups'

// ! DO NOT REMOVE, use it to get "provided" data
// console.log(
// 	table.getHeaderGroups().map((g) =>
// 		g.headers.map(({ id, isPlaceholder, rowSpan }) => ({
// 			id,
// 			isPlaceholder,
// 			rowSpan,
// 		}))
// 	)
// )

test.each<[MRSHeader[][], MRSHeader[][]]>([
	[[], []],

	[
		[
			[
				{
					id: 'one',
					isPlaceholder: true,
					rowSpan: 0,
				},
				{
					id: 'two',
					isPlaceholder: false,
					rowSpan: 0,
				},
			],

			[
				{
					id: '111',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: '222',
					isPlaceholder: false,
					rowSpan: 0,
				},
			],
		],

		[
			[
				{
					id: '111',
					isPlaceholder: false,
					rowSpan: 2,
				},
				{
					id: 'two',
					isPlaceholder: false,
					rowSpan: 1,
				},
			],

			[
				{
					id: '222',
					isPlaceholder: false,
					rowSpan: 1,
				},
			],
		],
	],

	[
		[
			[
				{
					id: '1_hello_2_firstName_firstName',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: '1_Info_2_age_age',
					isPlaceholder: false,
					rowSpan: 0,
				},
			],

			[
				{
					id: '2_firstName_firstName',
					isPlaceholder: true,
					rowSpan: 0,
				},
				{
					id: '2_lastName_lastName',
					isPlaceholder: true,
					rowSpan: 0,
				},
				{
					id: '2_age_age',
					isPlaceholder: true,
					rowSpan: 0,
				},
				{
					id: '2_More Info_visits',
					isPlaceholder: false,
					rowSpan: 0,
				},
			],

			[
				{
					id: 'firstName',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: 'lastName',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: 'age',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: 'visits',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: 'status',
					isPlaceholder: false,
					rowSpan: 0,
				},
				{
					id: 'progress',
					isPlaceholder: false,
					rowSpan: 0,
				},
			],
		],

		[
			[
				{
					id: '1_hello_2_firstName_firstName',
					isPlaceholder: false,
					rowSpan: 1,
				},
				{
					id: '1_Info_2_age_age',
					isPlaceholder: false,
					rowSpan: 1,
				},
			],

			[
				{
					id: 'firstName',
					isPlaceholder: false,
					rowSpan: 2,
				},
				{
					id: 'lastName',
					isPlaceholder: false,
					rowSpan: 2,
				},
				{
					id: 'age',
					isPlaceholder: false,
					rowSpan: 2,
				},
				{
					id: '2_More Info_visits',
					isPlaceholder: false,
					rowSpan: 1,
				},
			],

			[
				{
					id: 'visits',
					isPlaceholder: false,
					rowSpan: 1,
				},
				{
					id: 'status',
					isPlaceholder: false,
					rowSpan: 1,
				},
				{
					id: 'progress',
					isPlaceholder: false,
					rowSpan: 1,
				},
			],
		],
	],
])('transpose %p %p', (provided, expected) => {
	expect(mergeRowSpan(provided)).toStrictEqual(expected)
})
