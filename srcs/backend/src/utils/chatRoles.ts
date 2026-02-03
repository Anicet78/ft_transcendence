export const CHAT_ROLES = [
	'owner',
	'admin',
	'moderator',
	'writer',
	'member'
] as const;
export type ChatRole = typeof CHAT_ROLES[number];

export const ROLE_RANK: Record<ChatRole, number> = {
	owner: 5,
	admin: 4,
	moderator: 3,
	writer: 2,
	member: 1
};

//Safe helper: returns rank, defaults to member
export function getRoleRank(role: string | null | undefined): number {
	if (role && role in ROLE_RANK) {
		return ROLE_RANK[role as ChatRole];
	}
	return ROLE_RANK.member;
}
