import type { FastifyInstance } from 'fastify';
import * as controller from '../../controllers/friendship/friendshipController.js';
import { 
  SendRequestSchema,
  UpdateRequestSchema,
  ParamIdSchema
} from '../../schema/friendshipValidation.js';

async function friendshipRoutes(fastify: FastifyInstance) {

  fastify.get('/friends', {
    preHandler: [fastify.authenticate],
    handler: controller.getFriends
  });

  fastify.get('/friends/requests', {
    preHandler: [fastify.authenticate],
    handler: controller.getRequests
  });

  fastify.post('/friends/:id', {
    preHandler: [fastify.authenticate],
    schema: SendRequestSchema,
    handler: controller.sendRequest
  });

  fastify.patch('/friends/:id', {
    preHandler: [fastify.authenticate],
    schema: UpdateRequestSchema,
    handler: controller.updateRequest
  });

  fastify.delete('/friends/:id', {
    preHandler: [fastify.authenticate],
    schema: ParamIdSchema,
    handler: controller.removeFriend
  });
}

export default friendshipRoutes;
