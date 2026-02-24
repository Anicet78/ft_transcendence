import type { FastifyPluginCallback, FastifyRequest } from "fastify";
import fp from "fastify-plugin";
import socketio from 'fastify-socket.io';
import { Server, Socket } from 'socket.io';
import { SocketService } from "../services/socket/SocketService.js";
import { AppError } from "../schema/errorSchema.js";
import { RoomService } from "../services/rooms/roomService.js";
import { prisma } from "../services/db/prisma.js";
import { UserService } from "../services/db/userService.js";
import type { RequestUser } from "../schema/userSchema.js";

type SocketIOOptions = {
	cors?: {
		origin: string | string[];
		methods?: string[];
	};
};

export default fp(async (fastify) => {
	await fastify.register(socketio as unknown as FastifyPluginCallback<SocketIOOptions>, {
		cors: {
			origin: "*", // will be changed to frontend URL later
			methods: ["GET", "POST", "OPTIONS"]
		}
	});

	SocketService.init(fastify);

	fastify.decorateRequest('getSocket', function (this: FastifyRequest): Socket {
		const socketId = this.headers['x-socket-id'] as string;
		const socket = this.server.io.sockets.sockets.get(socketId);

		if (!socket)
			throw new AppError('Socket connection not found', 404);

		return socket;
	});

	fastify.decorate('getSocketByUserId', async function (userId: string): Promise<Socket | null> {
		const matchingSockets = await fastify.io.in(`user:${userId}`).fetchSockets();

		if (matchingSockets.length > 0)
			return matchingSockets[0] as unknown as Socket;

		return null;
	});

	const disconnectionTimers = new Map<string, NodeJS.Timeout>();

	fastify.io.on("connection", async (socket) => {
		const clientId = socket.id;
		try {
			const userPayload: RequestUser | null = fastify.jwt.decode(socket.handshake.auth.token);
			if (!userPayload) {
				socket.disconnect(true);
				return;
			}

			await socket.join(`user:${userPayload.id}`);

			console.log(`Client \`${clientId}\` is connected`);

			if (disconnectionTimers.has(userPayload.id)) {
				clearTimeout(disconnectionTimers.get(userPayload.id));
				disconnectionTimers.delete(userPayload.id);
				console.log(`User ${userPayload.id} is back in time. Room expulsion canceled`);
			}

			socket.on("disconnect", async (reason) => {
				console.log(`Client \`${clientId}\` is gone. Reason: ${reason}`);

				const timer = setTimeout(async () => {
					await RoomService.leave(userPayload.id, socket);
					disconnectionTimers.delete(userPayload.id);
					console.log(`User ${userPayload.id} has been removed from his room (disconnection timeout)`);
				}, 5000);

				disconnectionTimers.set(userPayload.id, timer);

				await UserService.setAvailabality(userPayload.id, false);
			});

			// broadcast typing into chat effect in the chat room
			socket.on("chat_typing", async ({ chatId }) => {

				const isMember = await prisma.chatMember.findFirst({
					where: {
						chatId,
						userId: userPayload.id
					}
				});

				if (!isMember)
					return;

				socket.to(chatId).emit("chat_typing", {
					userId: userPayload.id//,
					// username: userPayload.email
				});
			});

			// // chat read receipts
			// socket.on("chat_receipt", async ({ chatId, messageId }) => {
			// 	await prisma.chatReceipt.upsert({
			// 		where: { userId_chatId: { userId: userPayload.id, chatId } },
			// 		update: { messageId },
			// 		create: { userId: userPayload.id, chatId, messageId }
			// 	});

			// 	socket.to(chatId).emit("chat_receipt_update", {
			// 		// userId: userPayload.id,
			// 		// chatId,
			// 		// messageId
			// 		 userId: userPayload.id,
			// 		 chatId,
			// 		 messageId,
			// 		 user: {
			// 			appUserId: userPayload.id,
			// 			username: userPayload.email // or email if that’s what you have
			// 		 }
			// 	});
			// });


		} catch (err) {
			console.log("An error occured:", err);
			socket.disconnect(true);
		}
	});
});

declare module 'fastify' {
	interface FastifyInstance {
		io: Server;
		getSocketByUserId(userId: string): Promise<Socket | null>;
	}
	interface FastifyRequest {
		getSocket(): Socket;
	}
}
