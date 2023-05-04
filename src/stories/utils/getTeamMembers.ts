import { faker } from '@faker-js/faker'
import { TeamMember, UnitTreeItem, User } from '../types/TeamMember'
import { getRandomFromArray } from './getRandomFromArray'

const impacts = ['Critical', 'High', 'Medium', 'Low', null];
const performances = ['Often exceeds', 'Sometimes exceeds', 'Meets', undefined];
const risksOfLeaving = ['Leaver', 'High', 'Medium', 'Low', undefined];
const successionStatuses = ['No successors', 'Successors identified', 'Successors in place', null];

export const getUsers = (length = 200, prefix = '') => [...Array(length)].map((_, index) => ({
	id: faker.datatype.uuid(),
	fullName: `${prefix}${index + 1}. ${faker.name.fullName()}`,
	avatarUrl: faker.image.avatar(),
	role: faker.name.jobTitle(),
}));

const savedUsers = getUsers();

export const getTeamMember = (user?: User) => ({
	id: faker.datatype.uuid(),
	member: user ?? getRandomFromArray(savedUsers),
	impact: getRandomFromArray(impacts),
	performance: getRandomFromArray(performances),
	riskOfLeaving: getRandomFromArray(risksOfLeaving),
	successionStatus: getRandomFromArray(successionStatuses),
	location: faker.address.city(),
})

export const getTeamMembers = (length = 200, prefix = ''): TeamMember[] => getUsers(length, prefix).map((user) => ({
	id: faker.datatype.uuid(),
	member: user,
	impact: getRandomFromArray(impacts),
	performance: getRandomFromArray(performances),
	riskOfLeaving: getRandomFromArray(risksOfLeaving),
	successionStatus: getRandomFromArray(successionStatuses),
	location: faker.address.city(),
}));

export const getExpandingTeamMembers = (length = 200, prefix = ''): TeamMember[] => {
	const members = getTeamMembers(length)
	for (let i = 0; i < length; i++) {
		members[i].subRows = getTeamMembers(3, `${prefix}${i + 1}.`)
	}
	return members
}


export const getUnitTreeItems = (maxDepth = 5, length = 10, depth = 0, prefix = ''): UnitTreeItem[] => {
	if (depth >= maxDepth) return []
	const unitTree: UnitTreeItem[] = []
	const cLength = depth > 1 ? length : Math.pow(2, depth)
	for (let i = 0; i < cLength; i += 1) {
		unitTree.push({
			id: faker.datatype.uuid(),
			name: `${prefix}${i + 1}. ${faker.company.name()}`,
			type: faker.company.companySuffix(),
			keyMembers: getUsers(Math.round(Math.random() * 3 + 2), `${prefix}${i + 1}.`),
			subRows: [
				...(depth > 1 ? getTeamMembers(Math.round(Math.random() * cLength), `${prefix}${i + 1}.`) : []),
				...getUnitTreeItems(maxDepth, length, depth + 1, `${prefix}${i + 1}.`),
			]
		})
	}

	return unitTree
}

export const isUnitTreeItem = (item: unknown): item is UnitTreeItem => {
	return item?.hasOwnProperty('keyMembers') ?? false
}
export const isTeamMember = (item: unknown): item is TeamMember => {
	return item?.hasOwnProperty('member') ?? false
}

export const getSeparatedTeamMembers = (length = 200): TeamMember[] => [...Array(length)].map(() => getTeamMember(getRandomFromArray(savedUsers)));
