import { Prisma } from '@prisma/client';

const SOFT_DELETE_MODELS = new Set([
	'Chat',
	'ChatMember',
	'ChatRole',
	'ChatInvitation'
]);//need to complete it, can be used in other 

export const softDeleteMiddleware: Prisma.Middleware = async (params, next) => {
	if (!SOFT_DELETE_MODELS.has(params.model ?? '')) {
	return next(params);
	}
	// AUTO-FILTER ON READS
	if (
		params.action === 'findFirst' ||
		params.action === 'findMany' ||
		params.action === 'findUnique'
	) {
		params.args ??= {};
		params.args.where ??= {};

	// Allow explicit opt-out
	if (params.args.where?.includeDeleted) {
		delete params.args.where.includeDeleted;
		return next(params);
	}

	// Inject deletedAt = null
	if (params.args.where.deletedAt === undefined) {
		params.args.where.deletedAt = null;
	}
	}

	// if (params.action === 'delete') {
	// 	params.action = 'update';
	// 	params.args.data = { deletedAt: new Date() };
	// }

	return next(params);
};
