import { prisma } from '../prisma.js';
import { chat_role_type } from '@prisma/client';
import { AppError } from '../../../schema/errorSchema.js';
// import {
// 	ROLE_RANK,
// 	getRoleRank/*,
// 	type ChatRole */} from '../../../utils/chatRoles.js';

//INVITATION
export async function inviteToGroupChat(chatId: string, senderId: string, receiverId: string) {
	// 1. Check chat exists and is group
	const chat = await prisma.chat.findUnique({
		where: { chatId },
		select: {
			chatId: true,
			chatType: true
		}
	});

	if (!chat || chat.chatType !== 'group') {
		throw new AppError('Chat not found or not a group chat', 404);
	}
	// if (chat.deletedAt !== null) {
	// 	throw new AppError('This chat has been disbanded', 410);
	// }
	// 2. Check sender is a member
	const isMember = await prisma.chatMember.findFirst({
	where: { chatId, userId: senderId }
	});

	if (!isMember) {
		throw new AppError('You are not a member of this group', 403);
	}

	// 3. Check receiver is not already a member
	const alreadyMember = await prisma.chatMember.findFirst({
	where: { chatId, userId: receiverId }
	});

	if (alreadyMember) {
		throw new AppError('User is already a member of this group', 409);//or send 400 ?
	}

	// 4. Prevent duplicate invitations
	const existingInvite = await prisma.chatInvitation.findFirst({
	where: { chatId, receiverId, status: 'waiting' }
	});

	if (existingInvite) {
		throw new AppError('An invitation is already pending for this user', 409);
	}

	// 5. Create invitation
	const invitation = await prisma.chatInvitation.create({
	data: {
		chatId,
		senderId,
		receiverId,
		status: 'waiting'
	},
	select: {
		chatInvitationId: true,
		chatId: true,
		senderId: true,
		receiverId: true,
		status: true,
		createdAt: true
	}
	});

	return invitation;
}


//RETURN USER'S CHAT INVITATIONS (send and received)
export async function listUserChatInvitations(userId: string) {
  const invitations = await prisma.chatInvitation.findMany({
    where: {
      OR: [
        { senderId: userId },
        { receiverId: userId }
      ]
    },
    orderBy: { createdAt: 'desc' },
    select: {
      chatInvitationId: true,
      chatId: true,
      senderId: true,
      receiverId: true,
      status: true,
      createdAt: true,

      sender: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true,
          availability: true
        }
      },

      receiver: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true,
          availability: true
        }
      },

      chat: {
        select: {
          chatId: true,
          chatType: true,
          chatName: true
        }
      }
    }
  });

  return invitations;
}

//ANSWER PENDING GROUP CHAT INVITATION
export async function acceptGroupInvitation( chatInvitationId: string, userId: string ) {
	// 1. Load invitation
	const invitation = await prisma.chatInvitation.findUnique({
	where: { chatInvitationId },
	select: {
		chatInvitationId: true,
		chatId: true,
		receiverId: true,
		status: true
	}
	});

	if (!invitation) {
		throw new AppError('Invitation not found', 404);
	}

	// if (invitation.chatId.deletedAt !== null) {
	// 	throw new AppError('This chat has been disbanded and invitation is no longer available', 410);
	// }

	// 2. Must be waiting
	if (invitation.status !== 'waiting') {
		throw new AppError('Invitation is not pending', 400);
	}

	// 3. Only receiver can accept
	if (invitation.receiverId !== userId) {
		throw new AppError('You are not allowed to accept this invitation', 403);
	}

	// 4. Chat must exist and be group
	const chat = await prisma.chat.findUnique({
	where: { chatId: invitation.chatId! },
	select: { chatType: true }
	});

	if (!chat || chat.chatType !== 'group') {
		throw new AppError('Chat not found or not a group chat', 404);
	}

	// 5. Prevent duplicate membership
	const alreadyMember = await prisma.chatMember.findFirst({
	where: { chatId: invitation.chatId!, userId }
	});

	if (alreadyMember) {
		throw new AppError('You are already a member of this group', 409);
	}

	// 6–7. Create member + role in a transaction
	const result = await prisma.$transaction(async (tx) => {
	const member = await tx.chatMember.create({
		data: {
		chatId: invitation.chatId!,
		userId,
		joinedAt: new Date()
		},
		select: {
		chatMemberId: true,
		chatId: true,
		userId: true,
		joinedAt: true
		}
	});

	await tx.chatRole.create({
		data: {
		chatId: invitation.chatId!,
		userId,
		role: chat_role_type.member,
		attributedBy: userId
		}
	});

	await tx.chatInvitation.update({
		where: { chatInvitationId },
		data: { status: 'accepted' }
	});

	return member;
	});

	return result;
}
