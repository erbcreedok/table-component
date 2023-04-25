export type User = {
	id: string;
	fullName: string;
	avatarUrl: string;
	role: string;
}
export type TeamMember = {
	id: string;
	member: User;
	impact: string | null;
	performance?: string | null;
	riskOfLeaving?: string | null;
	successionStatus: string | null;
	location: string;
	subRows?: TeamMember[]
}

export type UnitTreeItem = {
	id: string;
	name: string;
	type: string;
	attritionRisk?: number;
	performance?: number;
	seniority?: number;
	keyMembers?: User[];
	subRows?: (UnitTreeItem | TeamMember)[];
}
