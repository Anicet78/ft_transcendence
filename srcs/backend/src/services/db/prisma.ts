import { PrismaClient } from "@prisma/client";
import { softDeleteMiddleware } from '../../utils/softDeleteMiddleware.js';

export const prisma: PrismaClient = new PrismaClient();

prisma.$use(softDeleteMiddleware);
//this make all soft-deleted rows automatically ignored
//if we want to include soft deleted rows, we can "includeDeleted: true"