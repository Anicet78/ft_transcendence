import type { FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../../schema/errorSchema.js';

import { getChatByIdForUser } from '../../services/db/chatService.js';
import type { ChatInfoParams } from '../../schema/chatSchema.js';

import { listUserChats } from '../../services/db/chatService.js';

import { sendMessage } from '../../services/db/chatService.js';
import type { SendMessageParams, SendMessageBody } from '../../schema/chatSchema.js';

import { deleteMessage } from '../../services/db/chatService.js';
import type { DeleteMessageParams } from '../../schema/chatSchema.js';

import { listUserChatInvitations } from '../../services/db/chatService.js';

import { getChatMessages } from '../../services/db/chatService.js';


// //CREATE GROUP CHAT (we're not sending an invite here, members are part of conversation)
function normalizeChat(chat: any) {
	return {
		chatId: chat.chatId,
		chatType: chat.chatType,
		chatName: chat.chatName,
		createdAt: chat.createdAt.toISOString(),
		createdBy: chat.creator,
		members: chat.members.map((m: any) => {
			const role = chat.roles.find((r: any) => r.userId === m.user.appUserId)?.role ?? 'member';
			return {
				chatMemberId: m.chatMemberId,
				joinedAt: m.joinedAt.toISOString(),
				role,
				user: m.user
			};
		})
	};
}

//RETURN CHAT INFOS
export async function getChatInfoController(
	req: FastifyRequest<{ Params: ChatInfoParams }>,
	reply: FastifyReply
	) {
	const userId = req.user.id;
	const { chatId } = req.params;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const chat = await getChatByIdForUser(chatId, userId);

	return reply.status(200).send(normalizeChat(chat));
}

//RETURN USER'S CHAT INVITATIONS (send and received)
export async function listChatInvitationsController(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const userId = req.user.id;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const invitations = await listUserChatInvitations(userId);

  return reply.status(200).send(
    invitations.map(inv => ({
      chatInvitationId: inv.chatInvitationId,
      chatId: inv.chatId,
      status: inv.status,
      createdAt: inv.createdAt?.toISOString() ?? null,
      sender: inv.sender,
      receiver: inv.receiver,
      chat: inv.chat
    }))
  );
}


//RETURN USER'S CHAT LIST
export async function listUserChatsController(
	req: FastifyRequest, reply: FastifyReply
) {
	const userId = req.user.id;

	if (!userId) {
		throw new AppError('Unauthorized', 401);
	}

	const chats = await listUserChats(userId);
	return reply.send(chats.map(normalizeChat));
	// return reply.status(200).send(
	// chats.map(normalizeChat) //should rework that to use it everywhere
	// );
}

//SEND MESSAGE
export async function sendMessageController(
	req: FastifyRequest<{ Params: SendMessageParams; Body: SendMessageBody }>, reply: FastifyReply
) {
	const userId = req.user.id;
	const { chatId } = req.params;
	const { content } = req.body;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const message = await sendMessage(chatId, userId, content);

	return reply.status(201).send({
	messageId: message.messageId,
	chatId: message.chatId,
	userId: message.userId,
	content: message.content,
	status: message.status,
	postedAt: message.postedAt?.toISOString() ?? null
	});
}

//DELETE MESSAGE
export async function deleteMessageController(
	req: FastifyRequest<{ Params: DeleteMessageParams }>,
	reply: FastifyReply
	) {
	const userId = req.user.id;
	const { messageId } = req.params;

	if (!userId) {
	throw new AppError('Unauthorized', 401);
	}

	const result = await deleteMessage(messageId, userId);

	return reply.status(200).send({
	messageId: result.messageId,
	chatId: result.chatId,
	status: result.status,
	deletedAt: result.deletedAt?.toISOString() ?? null
	});
}

//RETRIEVE CHAT MESSAGES
export async function getChatMessagesController(
  req: FastifyRequest<{ Params: { chatId: string } }>,
  reply: FastifyReply
) {
  const userId = req.user.id;
  const { chatId } = req.params;

  if (!userId) {
    throw new AppError('Unauthorized', 401);
  }

  const messages = await getChatMessages(chatId, userId);

  return reply.status(200).send(
    messages.map(m => ({
      messageId: m.messageId,
      chatId: m.chatId,
      userId: m.userId,
      content: m.content,
      status: m.status,
      postedAt: m.postedAt?.toISOString() ?? null,
      editedAt: m.editedAt?.toISOString() ?? null,
      deletedAt: m.deletedAt?.toISOString() ?? null,
      author: m.author
    }))
  );
}

