import type { FastifyInstance } from "fastify";
import {
  SearchUsersQuerySchema,
  SearchUsersResponseSchema
} from '../../schema/searchSchema.js';
import { searchUsersController } from '../../controllers/search/searchController.js';

export async function searchRoute(fastify: FastifyInstance) {
  fastify.get('/users/search', {
      schema: {
        querystring: SearchUsersQuerySchema,
        response: {
          200: SearchUsersResponseSchema,
        },
      },
    },
    searchUsersController,
  );
} export default searchRoute;
