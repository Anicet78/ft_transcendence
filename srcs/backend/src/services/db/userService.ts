import type { AppUser, auth_provider } from "@prisma/client";
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
	async getUserByMail(email: string) {
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
	async getUserByUsername(username: string) {
		return prisma.appUser.findUnique({
			where: { username: username },
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
	async getUserByProviderId(provider: auth_provider, providerId: string) {
		return prisma.identify.findUnique({
			where: {
				provider_providerId: {
					provider: provider,
					providerId: providerId
			} },
			select: {
				app_user: {
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
				}
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
	async createUserWithProvider(user: User, provider: auth_provider, providerId: string): Promise<AppUser> {
		return prisma.appUser.create({
			data: {
				firstName: user.firstname,
				lastName: user.lastname,
				username: user.username,
				mail: user.email,
				region: user.region,
				rolesReceived: {
					create: {
						role: "user"
					}
				},
				identify: {
					create: {
						provider: provider,
						providerId: providerId,
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
