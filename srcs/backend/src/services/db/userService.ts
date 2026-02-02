import type { AppUser } from "@prisma/client";
import { prisma } from "./prisma.js";
import type { User } from "../../schema/userSchema.js";

export const UserService = {
	async getUserById(userId: string) {
		return prisma.appUser.findUnique({
			where: { appUserId: userId },
			include: {
				rolesReceived: {
					where: {
						deletedAt: null,
					},
					orderBy: {
						createdAt: 'desc',
					},
					take: 1,
				},
			}
		});
	},
	async getUserByMail(email: string): Promise<AppUser | null> {
		return prisma.appUser.findUnique({
			where: { mail: email },
			include: {
				rolesReceived: {
					where: {
						deletedAt: null,
					},
					orderBy: {
						createdAt: 'desc',
					},
					take: 1,
				},
			}
		});
	},
	async createUser(user: User): Promise<AppUser> {
		return prisma.appUser.create({
			data: {
				firstName: user.firstname,
				lastName: user.lastname,
				username: user.username,
				mail: user.email,
				region: user.region,
				passwordHash: user.passwordHash,
				rolesReceived: {
					create: {
						role: "user"
					}
				}
			},
		});
	},
	async setAvailabality(userId: string, availabality: boolean): Promise<AppUser> {
		return prisma.appUser.update({
			data: {
				availability: availabality
			},
			where: {
				appUserId: userId
			}
		});
	}
};
