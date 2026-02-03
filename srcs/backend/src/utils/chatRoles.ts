import { chat_role_type } from '@prisma/client';

export const ROLE_RANK: Record<chat_role_type, number> = {
	owner: 5,
	admin: 4,
	moderator: 3,
	writer: 2,
	member: 1
};

//Safe helper: returns rank, defaults to member
export function getRoleRank(
	role: chat_role_type | null | undefined
): number {
	return role ? ROLE_RANK[role] : ROLE_RANK.member;
}
