import { faker } from '@faker-js/faker'
import { TeamMember, User } from '../types/TeamMember'
import { getRandomFromArray } from './getRandomFromArray'

const impacts = ['Critical', 'High', 'Medium', 'Low', null];
const performances = ['Often exceeds', 'Sometimes exceeds', 'Meets', undefined];
const risksOfLeaving = ['Leaver', 'High', 'Medium', 'Low', undefined];
const successionStatuses = ['No successors', 'Successors identified', 'Successors in place', null];

export const getUsers = (length = 200) => [...Array(length)].map(() => ({
	id: faker.datatype.uuid(),
	fullName: faker.name.fullName(),
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

export const getTeamMembers = (length = 200): TeamMember[] => getUsers(length).map((user) => ({
	id: faker.datatype.uuid(),
	member: user,
	impact: getRandomFromArray(impacts),
	performance: getRandomFromArray(performances),
	riskOfLeaving: getRandomFromArray(risksOfLeaving),
	successionStatus: getRandomFromArray(successionStatuses),
	location: faker.address.city(),
}));

export const getSeparatedTeamMembers = (length = 200): TeamMember[] => [...Array(length)].map(() => getTeamMember(getRandomFromArray(savedUsers)));
