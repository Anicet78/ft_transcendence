import { prisma } from './prisma.js';
import { AppError } from '../../schema/errorSchema.js';

//shared chat infos model
export const chatSelect = {
	chatId: true,
	chatType: true,
	chatName: true,
	createdAt: true,
	deletedAt: true,

	creator: {
	select: {
		appUserId: true,
		username: true,
		avatarUrl: true,
		availability: true
	}
	},

	members: {
	select: {
		chatMemberId: true,
		joinedAt: true,
		leftAt: true,
		user: {
		select: {
			appUserId: true,
			username: true,
			avatarUrl: true,
			availability: true
		}
		}
	}
	},

	roles: {
	select: {
		userId: true,
		role: true
	}
	}
};

export async function getChatByIdForUser(chatId: string, userId: string) {
	// Ensure user is a member
	const isMember = await prisma.chatMember.findFirst({
	where: { chatId, userId }
	});

	if (!isMember) {
	throw new AppError('You are not a member of this chat', 403);
	}

	// Fetch chat with full details
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: chatSelect
	});

	if (!chat) {
	throw new AppError('Chat not found', 404);
	}

	return chat;
}


//RETURN USER'S CHAT LIST
export async function listUserChats(userId: string) {
	const chats = await prisma.chat.findMany({
	where: {
		members: {
		some: { userId }
		}
	},
	select: chatSelect
	// {
	// 	chatId: true,
	// 	chatType: true,
	// 	chatName: true,
	// 	createdAt: true,

	// 	creator: {
	// 	select: {
	// 		appUserId: true,
	// 		username: true,
	// 		avatarUrl: true,
	// 		availability: true
	// 	}
	// 	},

	// 	members: {
	// 	select: {
	// 		chatMemberId: true,
	// 		joinedAt: true,
	// 		user: {
	// 		select: {
	// 			appUserId: true,
	// 			username: true,
	// 			avatarUrl: true,
	// 			availability: true
	// 		}
	// 		}
	// 	}
	// 	},

	// 	roles: {
	// 	select: {
	// 		userId: true,
	// 		role: true
	// 	}
	// 	}//maybe should only send group chat name ? See what front thinks
	// }
	});

	return chats;
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


//SEND MESSAGE
export async function sendMessage(chatId: string, userId: string, content: string) {
	// 1. check if chat exists
	const chat = await prisma.chat.findUnique({
	where: { chatId },
	select: { chatId: true }
	});

	if (!chat) {
		throw new AppError('Chat not found', 404);
	}

	// if (chat.deletedAt !== null) {
	// 	throw new AppError('This chat has been disbanded', 410);
	// }

	// 2. is user a member
	const member = await prisma.chatMember.findFirst({
	where: { chatId, userId }
	});

	if (!member) {
		throw new AppError('You are not a member of this chat', 403);
	}

	// 3. check user is not banned
	const ban = await prisma.chatBan.findFirst({
	where: {
		chatId,
		userId,
		deletedAt: null,
		OR: [
		{ expiresAt: null },
		{ expiresAt: { gt: new Date() } }
		]
	}
	});

	if (ban) {
	throw new AppError('You are banned from this chat', 403);
	}

	// 4. Check user role always writting (writer or above)
	const role = await prisma.chatRole.findFirst({
		where: { chatId, userId },
		select: { role: true }
	});
	
	const userRole = role?.role ?? 'member';//check user role, if dont exists, define as member by default
	if (userRole == 'member') {
		throw new AppError('You do not have permission to write in this chat', 403);
	}

	// 4. Create message
	const message = await prisma.chatMessage.create({
	data: {
		chatId,
		userId,
		status: 'posted',
		content
	},
	select: {
		messageId: true,
		chatId: true,
		userId: true,
		content: true,
		status: true,
		postedAt: true
	}
	});

	return message;
}

//DELETE MESSAGE
export async function deleteMessage(messageId: string, userId: string) {
	// 1. Load message
	const message = await prisma.chatMessage.findUnique({
	where: { messageId },
	select: {
		messageId: true,
		chatId: true,
		userId: true, // author
		status: true
	}
	});

	if (!message) {
		throw new AppError('Message not found', 404);
	}

	// 2. Load user role in this chat
	// const role = await prisma.chatRole.findFirst({
	// where: { chatId: message.chatId, userId },
	// select: { role: true }
	// });
	// const userRole = role?.role ?? 'member';
	// const isModeratorOrAbove = ; 
	//NEED to add check if user is moderator

	const isAuthor = message.userId === userId;
	if (!isAuthor /*&& !isModeratorOrAbove*/) {
		throw new AppError('You do not have permission to delete this message', 403);
	}

	// 3. Soft delete
	const updated = await prisma.chatMessage.update({
	where: { messageId },
	data: {
		status: 'deleted',
		deletedAt: new Date()
	},
	select: {
		messageId: true,
		chatId: true,
		status: true,
		deletedAt: true
	}
	});

	return updated;
}

//RETRIEVE CONVERSATION MESSAGES
export async function getChatMessages(chatId: string, userId: string) {
  // 1. Check user is member of this conversation
  const isMember = await prisma.chatMember.findFirst({
    where: { chatId, userId }
  });

  if (!isMember) {
    throw new AppError('You are not a member of this chat', 403);
  }

  // 2. Retrieve messages
  const messages = await prisma.chatMessage.findMany({
    where: { chatId },
    orderBy: { postedAt: 'asc' },
    select: {
      messageId: true,
      chatId: true,
      userId: true,
      content: true,
      status: true,
      postedAt: true,
      editedAt: true,
      deletedAt: true,
      author: {
        select: {
          appUserId: true,
          username: true,
          avatarUrl: true,
          availability: true
        }
      }
    }
  });

  return messages;
}

