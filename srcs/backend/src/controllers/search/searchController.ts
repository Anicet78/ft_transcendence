import type { FastifyReply, FastifyRequest } from 'fastify';
import type { SearchUsersQuery } from '../../schema/searchSchema.js';
import { searchUsersService } from '../../services/db/searchService.js';


type SearchUsersRequest = FastifyRequest<{
	Querystring: SearchUsersQuery;
}>;

export async function searchUsersController(
  request: SearchUsersRequest,
  reply: FastifyReply,
) {
	const currentUserId = request.user.id;
	const result = await searchUsersService(currentUserId, request.query);
	return reply.send(result);
}