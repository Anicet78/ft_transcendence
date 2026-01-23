import type { AppUser } from "@prisma/client";
import prisma from "./prisma.js";
import type { User } from "../../schema/userSchema.js";

export const UserService = {
	async getUserById(userId: string): Promise<AppUser | null> {
		return prisma.appUser.findUnique({
			where: { appUserId: userId }
		});
	},
	async getUserByMail(email: string): Promise<AppUser | null> {
		return prisma.appUser.findUnique({
			where: { mail: email }
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
				passwordHash: user.passwordHash
			}
		});
	}
};
