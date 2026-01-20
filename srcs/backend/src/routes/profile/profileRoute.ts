import type { FastifyInstance } from 'fastify';
import * as profileController from '../../controllers/profile/profileController.js';

async function profileRoutes(fastify: FastifyInstance) {

  fastify.get('/profile', {
    preHandler: [fastify.authenticate],
    handler: profileController.getProfile
  });

  fastify.patch('/profile', {
    preHandler: [fastify.authenticate],
    handler: profileController.updateProfile
  });

  fastify.delete('/profile', {
    preHandler: [fastify.authenticate],
    handler: profileController.deleteProfile
  });
}

export default profileRoutes;
 