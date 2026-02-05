import type { FastifyInstance } from 'fastify';
import * as profileController from '../../controllers/profile/profileController.js';
import { DeleteProfileResponseSchema, ProfileIdParamsSchema, UpdateProfileBodySchema, ProfileResponseSchema, PublicProfileResponseSchema } from '../../schema/profileSchema.js';
import { AppErrorSchema } from '../../schema/errorSchema.js';
import Type from 'typebox';

export async function profileRoutes(fastify: FastifyInstance) {

  fastify.get('/profile', {
    schema: {
      response: {
        200: ProfileResponseSchema,
        404: AppErrorSchema,
        500: AppErrorSchema
      }
    },
    handler: profileController.getProfile
  });

  fastify.get('/profile/:id', {
    schema: {
      params: ProfileIdParamsSchema,
      response: {
        200: PublicProfileResponseSchema,
        404: AppErrorSchema,
        500: AppErrorSchema
      }
    },
    handler: profileController.getPublicProfile
  });

  fastify.patch('/profile', {
    schema: {
      body: UpdateProfileBodySchema,
      response: {
        200: ProfileResponseSchema,
        400: AppErrorSchema,
        409: AppErrorSchema,
        500: AppErrorSchema
      }
    },
    handler: profileController.updateProfile
  });

  fastify.delete('/profile', {
    schema: {
      response: {
        204: DeleteProfileResponseSchema,
        500: AppErrorSchema
      }
    },
    handler: profileController.deleteProfile
  });

  fastify.post('/profile/:id/block', {
    schema: {
      params: ProfileIdParamsSchema,
      body: Type.Null(),
      response: {
        204: Type.Null(),
        400: AppErrorSchema,
        404: AppErrorSchema,
        500: AppErrorSchema
      }
    },
    handler: profileController.blockProfile
  });

  fastify.post('/profile/:id/unblock', {
    schema: {
      params: ProfileIdParamsSchema,
      body: Type.Null(),
      response: {
        204: Type.Null(),
        400: AppErrorSchema,
        404: AppErrorSchema,
        500: AppErrorSchema
      }
    },
    handler: profileController.unblockProfile
  });
}
