import { PrismaClient, roles } from '@prisma/client';
import { hashPassword } from '../src/services/auth/password.js';
const prisma = new PrismaClient();

async function main() {
	const adminEmail = "admin@transcendence.com";
	const adminFirstname = "admin";
	const adminLastname = "admin";
	const adminUsername = "admin";
	const adminPassword = await hashPassword("password123");

	await prisma.appUser.upsert({
		where: { mail: adminEmail },
		update: {},
		create: {
			firstName: adminFirstname,
			lastName: adminLastname,
			username: adminUsername,
			mail: adminEmail,
			region: "EU",
			passwordHash: adminPassword,
			rolesReceived: {
				create: {
					role: "admin",
				}
			}
		},
	});
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());
