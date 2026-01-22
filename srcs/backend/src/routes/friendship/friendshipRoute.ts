import type { FastifyInstance } from 'fastify';
import * as controller from '../../controllers/friendship/friendshipController.js';
import { Type } from 'typebox';
import { FriendsListResponseSchema, FriendRequestsListSchema, SendRequestParamsSchema, UpdateRequestParamsSchema, UpdateRequestBodySchema, RemoveFriendParamsSchema } from '../../schema/friendshipSchema.js';

async function friendshipRoutes(fastify: FastifyInstance) {
  fastify.get('/friends', {
    schema: {
      response: {
        200: FriendsListResponseSchema
      }
    },
    handler: controller.getFriends
  });

  fastify.get('/friends/requests', {
    schema: {
      response: {
        200: FriendRequestsListSchema
      }
    },
    handler: controller.getRequests
  });

  fastify.post('/friends/:id', {
    schema: {
      params: SendRequestParamsSchema,
      response: {
        201: Type.Object({ success: Type.Boolean() })
      }
    },
    handler: controller.sendRequest
  });

  fastify.patch('/friends/:id', {
    schema: {
      params: UpdateRequestParamsSchema,
      body: UpdateRequestBodySchema,
      response: {
        200: Type.Object({ success: Type.Boolean() })
      }
    },
    handler: controller.updateRequest
  });

  fastify.delete('/friends/:id', {
    schema: {
      params: RemoveFriendParamsSchema,
      response: {
        204: Type.Null()
      }
    },
    handler: controller.removeFriend
  });

}

export default friendshipRoutes;
