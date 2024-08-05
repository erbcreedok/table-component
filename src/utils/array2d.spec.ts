import { remove2d, transpose2d } from './array2d'

test.each<[any[][], any[][], any[][]]>([
	[[], [], []],

	[
		[
			[1, 2],
			['a', 'b'],
		],
		[
			[1, 'a'],
			[2, 'b'],
		],
		[
			[1, 2],
			['a', 'b'],
		],
	],

	[
		[
			[1, 2, 3, 4],
			['a', 'b'],
		],
		[
			[1, 'a'],
			[2, 'b'],
			[3, undefined],
			[4, undefined],
		],
		[
			[1, 2, 3, 4],
			['a', 'b', undefined, undefined],
		],
	],

	[
		[
			[1, 2],
			['a', 'b', 'c', 'd'],
		],
		[
			[1, 'a'],
			[2, 'b'],
			[undefined, 'c'],
			[undefined, 'd'],
		],
		[
			[1, 2, undefined, undefined],
			['a', 'b', 'c', 'd'],
		],
	],
])('transpose2d %p %p', (provided, expected1, expected2) => {
	const transposed1 = transpose2d(provided)

	expect(transposed1).toStrictEqual(expected1)

	const transposed2 = transpose2d(transposed1)

	expect(transposed2).toStrictEqual(expected2)
	expect(remove2d(transposed2)).toStrictEqual(provided)
})
