import type { FastifyRequest, FastifyReply } from 'fastify';
import * as profileService from '../../services/db/profileService.js';
// import { Prisma } from '@prisma/client';
import { /*type UpdateProfileBody,*/ type ProfileResponse, type PublicProfileResponse} from '../../schema/profileSchema.js';
import { mapProfileToResponse, mapPublicProfileToResponse } from './profileMapper.js';

// GET /profile
export async function getProfile( req: FastifyRequest, reply: FastifyReply ) {
  try {
    const userId = req.user.id;

    const profile = await profileService.getProfile(userId);
    if (!profile) {
      return reply.status(404).send({ error: 'Profile not found' });
    }

    const response: ProfileResponse = mapProfileToResponse(profile);
    return reply.send(response);

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}


// GET /profile/:id
export async function getPublicProfile( req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply ) {
  try {
    const userId = req.params.id;

    const profile = await profileService.getPublicProfile(userId);
    if (!profile) {
      return reply.status(404).send({ error: 'User not found' });
    }

    const response: PublicProfileResponse = mapPublicProfileToResponse(profile);
    return reply.send(response);

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}


// // PATCH /profile
// export async function updateProfile( req: FastifyRequest<{ Body: UpdateProfileBody }>, reply: FastifyReply ) {
//   try {
//     const userId = req.user.id;
//     const body = req.body;

// 	const allowedFields: (keyof UpdateProfileBody)[] = [
// 		'firstName', 'lastName', 'username',
// 		'avatarUrl', 'region', 'availability'
// 	];

// 	const updateData: { [K in keyof UpdateProfileBody]?: UpdateProfileBody[K] } = {};

// 	for (const key of allowedFields) {
// 		const value = body[key];
// 		if (value !== undefined) {
// 			updateData[key] = value;
// 		}
// 	}

// 	await profileService.updateProfile(userId, updateData);

//     // const updated = await profileService.updateProfile(userId, updateData);

//     // Prisma returns Date → convert to string
//     // const response: ProfileResponse = {
//     //   ...updated,
//     //   createdAt: updated.createdAt.toISOString(),
//     //   updatedAt: updated.updatedAt.toISOString()
//     // };
//     // return reply.send(response);

// 	// Fetch full profile so we return the correct TypeBox response
// 	const fullProfile = await profileService.getProfile(userId);
// 	if (!fullProfile) {
// 		return reply.status(500).send({ error: 'Profile not found after update' });
// 	}

// 	const response = mapProfileToResponse(fullProfile);
// 	return reply.send(response);

//   } catch (err) {
//     req.log.error(err);

// 	if (err instanceof Prisma.PrismaClientKnownRequestError) {
//       if (err.code === 'P2002') {
//       	return reply.status(409).send({ error: 'Username or email already exists' });
//     	}//Prisma error, unique constraint violation (username or email already taken)
//     }

//     return reply.status(500).send({ error: 'Internal server error' });
//   }
// }


// DELETE /profile
export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
  try {
    const userId = req.user.id;

    await profileService.softDeleteProfile(userId);
    return reply.status(204).send();

  } catch (err) {
    req.log.error(err);
    return reply.status(500).send({ error: 'Internal server error' });
  }
}


// export async function getProfile(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     const userId = req.user.id;
//     const profile = await profileService.getProfile(userId);
  
//     if (!profile)
//       return reply.status(404).send({ error: 'Profile not found' });

//     return reply.send(profile as ProfileResponse);

//   } catch (err) {
//     req.log.error(err);
//     return reply.status(500).send({ error: 'Internal server error' });
//   }
// }

// export async function getPublicProfile(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
//   try {
//     const userId = req.params.id;
//     const profile = await profileService.getPublicProfile(userId);
  
//     if (!profile) {
//       return reply.status(404).send({ error: 'User not found' });
//     }

//     return reply.send(profile as PublicProfileResponse);
  
//   } catch (err) {
//     req.log.error(err);
//     return reply.status(500).send({ error: 'Internal server error' });
//   }
// }

// // export async function updateProfile(
// //   req: FastifyRequest<{ Body: Record<string, unknown> }>,
// //   reply: FastifyReply
// // ) {
// //   try {
// //     const userId = req.user.id;
// //     const body = req.body;

// //     // Allowed fields
// //     const allowedFields = Object.keys(UpdateProfileBodySchema.properties);

// //     // Forbidden fields
// //     const forbidden = Object.keys(body).filter(
// //       key => !allowedFields.includes(key)
// //     );

// //     if (forbidden.length > 0) {
// //       return reply.status(400).send({
// //         error: `Forbidden fields: ${forbidden.join(', ')}`
// //       });
// //     }

// //     // Username uniqueness
// //     if (body.username) {
// //       const existing = await profileService.getUserByUsername(body.username as string);

// //       if (existing && existing.appUserId !== userId) {
// //         return reply.status(409).send({
// //           error: 'Username already exists'
// //         });
// //       }
// //     }

// //     // Build update payload
// //     const updateData: Record<string, unknown> = {};
// //     for (const key of allowedFields) {
// //       if (body[key] !== undefined) {
// //         updateData[key] = body[key];
// //       }
// //     }

// //     // Update
// //     const updated = await profileService.updateProfile(userId, updateData);

// //     return reply.send(normalizeProfileDates(updated));

// //   } catch (err) {
// //     req.log.error(err);

// //     if (err instanceof Prisma.PrismaClientKnownRequestError) {
// //       if (err.code === 'P2002') {
// //         return reply.status(409).send({ error: 'Username already exists' });
// //       }
// //     }

// //     return reply.status(500).send({ error: 'Internal server error' });
// //   }
// // }

// // // export async function updateProfile(req: FastifyRequest, reply: FastifyReply) {
// // //   try {
// // //     const userId = req.user.id;//authenticated user's ID added by Fastify-JWT

// // //     const allowedFields = [
// // //       'firstName', 'lastName', 'username',
// // //       'avatarUrl', 'region', 'availability'
// // //     ];//is called a whitelist

// // //     const body = req.body as Record<string, unknown>;//req.body contains JSON sent by client
// // //     const updateData: Record<string, unknown> = {};

// // //     for (const key of allowedFields) {
// // //       if (body[key] !== undefined) updateData[key] = body[key];
// // //     }//prevents client to update not allowed fields

// // //     const updated = await profileService.updateProfile(userId, updateData);
// // //     return reply.send(updated);

// // //   } catch (err) {
// // //     req.log.error(err);
// // //     if (err instanceof Prisma.PrismaClientKnownRequestError) {
// // //       if (err.code === 'P2002') {
// // //       return reply.status(409).send({ error: 'Username or email already exists' });
// // //       }//Prisma error, unique constraint violation (username or email already taken)
// // //     }
// // //     return reply.status(500).send({ error: 'Internal server error' });
// // //   }
// // // }
// // l

// export async function deleteProfile(req: FastifyRequest, reply: FastifyReply) {
//   try {
//     await profileService.softDeleteProfile(req.user.id);
//     return reply.status(204).send();

//   } catch (err) {
//     req.log.error(err);
//     return reply.status(500).send({ error: 'Internal server error' });
//   }
// }
