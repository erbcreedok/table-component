export type User = {
	id: string
	fullName: string
	avatarUrl: string
	role: string
}
export type TeamMember = {
	id: string
	member: User
	impact: string | null
	performance?: string | null
	riskOfLeaving?: string | null
	successionStatus: string | null
	location: string
	completion?: number | null
	userAgent?: string | null
	subRows?: TeamMember[]
	zipCode: string,
	city: string,
	state: string,
	country: string,
	favoriteQuote: string,
	favoriteColor: string,
	petName: string,
	petType: string[],
}

export type UnitTreeItem = {
	id: string
	name: string
	type: string
	attritionRisk?: number
	performance?: number
	seniority?: number
	keyMembers?: User[]
	getParent(): UnitTreeItem | null
	subRows?: ((UnitTreeItem | TeamMember) & {
		getParent(): UnitTreeItem | null
	})[]
}
