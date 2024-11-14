import { faker } from '@faker-js/faker'
import { Initiative } from '../types/Initiative'

export const generateInitiatives = (count: number): Initiative[] =>
	[...Array(count)].map(() => ({
		unit: faker.datatype.number(10),
		title: faker.company.name(),
		unitTitle: faker.company.name(),
		organizationType: faker.company.bsNoun(),
		progress: faker.datatype.number(100),
		status: faker.color.human(),
		owner: {
			avatarUrl: faker.image.avatar(),
			fullName: faker.name.fullName(),
		},
	}))
