import type { FastifyInstance } from 'fastify';
import * as controller from '../../controllers/friendship/friendshipController.js';
import { Type } from 'typebox';
import {
  FriendsListResponseSchema,
  FriendRequestsListSchema,
  SendRequestParamsSchema,
  updateFriendshipRequestParamsSchema,
  updateFriendshipRequestBodySchema,
  RemoveFriendParamsSchema,
  FriendshipStatusSchema
} from '../../schema/friendshipSchema.js';

async function friendshipRoutes(fastify: FastifyInstance) {

  //GET FRIENDS LIST
  fastify.get('/friends', {
    schema: {
      response: {
        200: FriendsListResponseSchema
      }
    },
    handler: controller.getFriends
  });

  //GET PENDING FRIENDSHIP REQUEST
  fastify.get('/friends/requests', {
    schema: {
      response: {
        200: FriendRequestsListSchema
      }
    },
    handler: controller.getRequests
  });

  //GET FRIENDSHIP'S STATUS WITH A SPECIFIC USER (Nina)
  fastify.get('/friends/status/:userId', {
    schema: {
      response: {
        200: FriendshipStatusSchema
      }
    },
    handler: controller.getFriendshipStatusController
  });

  //SEND FRIENDSHIP REQUEST
  fastify.post('/friends/:id', {
    schema: {
      params: SendRequestParamsSchema,
      response: {
        201: Type.Object({ success: Type.Boolean() })
      }
    },
    handler: controller.sendRequest
  });

  //ACCEPT, REJECT, DELETE FRIENDSHIP REQUEST
  fastify.patch('/friends/:id', {
    schema: {
      params: updateFriendshipRequestParamsSchema,
      body: updateFriendshipRequestBodySchema,
      response: {
        200: Type.Object({ success: Type.Boolean() })
      }
    },
    handler: controller.updateFriendshipRequest
  });

  //DELETE FRIENDSHIP by friend ID
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
