import type { FastifyInstance } from 'fastify';
import * as profileController from '../../controllers/profile/profileController.js';
import { UpdateProfileBodySchema, ProfileResponseSchema, PublicProfileResponseSchema } from '../../schema/profileSchema.js';

export async function profileRoutes(fastify: FastifyInstance) {

  fastify.get('/profile', {
    schema: {
      response: {
        200: ProfileResponseSchema
      }
    },
    handler: profileController.getProfile
  });

  fastify.get('/profile/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' }
        },
        required: ['id']
      },
      response: {
        200: PublicProfileResponseSchema
      }
    },
    handler: profileController.getPublicProfile
  });

  fastify.patch('/profile', {
    schema: {
      body: UpdateProfileBodySchema,
      response: {
        200: ProfileResponseSchema
      }
    },
    handler: profileController.updateProfile
  });

  fastify.delete('/profile', {
    schema: {
      response: {
        204: { type: 'null' }
      }
    },
    handler: profileController.deleteProfile
  });
}
