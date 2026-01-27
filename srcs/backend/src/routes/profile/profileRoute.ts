import type { FastifyInstance } from 'fastify';
import * as profileController from '../../controllers/profile/profileController.js';
import { DeleteProfileResponseSchema, ProfileIdParamsSchema, UpdateProfileBodySchema, ProfileResponseSchema, PublicProfileResponseSchema } from '../../schema/profileSchema.js';

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
      params: ProfileIdParamsSchema,
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
        204: DeleteProfileResponseSchema
      }
    },
    handler: profileController.deleteProfile
  });
}
