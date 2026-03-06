import { useParams } from "react-router"
import { useEffect } from "react";
import { useChat } from "./ChatContext";
import { useChatMessages } from "./hooks/useChatMessages";

import { useChatSocket } from "./hooks/useChatSocket";
import { useGroupChatMutations } from "./hooks/useGroupChatMutations";
import { ChatMembers } from "./components/ChatMembers";
import { ChatRoom } from "./components/ChatRoom";
import { InviteToGroupChat } from "./components/InviteToGroupChat";
import { useChatInfo } from "./hooks/useChatInfo";
import { useAuth } from "../auth/AuthContext";

function chatNameToDisplay(chat: any, userId?: string) {
	if (chat.chatType === "private") {
		const other = chat.members.find(
			(m: any) => m.user.appUserId !== userId
		);
		return other?.user?.username || "Private chat";
	}
	return chat.chatName || "Group chat";
}

const ChatView = ({ chatId: propChatId, onClose }: {
	chatId?: string;
	onClose?: () => void;
}) => {
	const params = useParams();
	const user = useAuth();
	const chatId = propChatId ?? params.chatId;
	const { data: chat } = useChatInfo(chatId);

	const { /*chat,*/ role, joinChat } = useChat();

	const { isLoading, isError } = useChatMessages(chatId);
	const { quitChatMutation, disbandMutation, gameInviteMutation } = useGroupChatMutations(chatId);

	useChatSocket(chatId, onClose);

	//join new chat add each chatId change
	useEffect(() => {
		if (chatId)
			joinChat(chatId);
	}, [chatId]);

	if (isLoading)
		return <div>Loading chat...</div>;

	if (!chat)
		return <div>Chat Not Found</div>;

	if (isError)
		return <div>Error loading chat</div>;

	//console.log("chatInfo:", chat);

	return (
		<div className='sidebar-content'>

			{onClose && (
				<button
					className="button is-light is-small mb-3"
					onClick={onClose}
				>
				Back to chats
				</button>
			)}

			<h1 className="title">
				{chatNameToDisplay(chat, user?.user?.id) || (chat.chatType === "private" ? "Private chat" : "Group chat")}
			</h1>

			<ChatMembers chatId={chatId} />

			{/* GAME INVITE */}
			<button
				className="button is-info is-small mb-3"
				onClick={() => gameInviteMutation.mutate()}
			>
			Invite to play game 🎮
			</button>

			{/* QUIT CHAT */}
			{chat.chatType === "group" && role !== "owner" && (
				<button
					className="button is-warning is-small mb-3"
					onClick={() => quitChatMutation.mutate()}
				>
					Quit Group Chat
				</button>
			)}

			{/* DISBAND CHAT */}
			{chat.chatType === "group" && role === "owner" && (
				<button
					className="button is-danger is-small mb-3"
					onClick={() => disbandMutation.mutate()}
				>
					Disband Group Chat
				</button>
			)}

			{/* INVITE TO JOIN GROUP CHAT */}
			{chat.chatType === "group" &&
				<InviteToGroupChat
					chatId={chat.chatId}
					existingMembers={chat.members} 
				/>
			}

			<ChatRoom chatId={chatId!} />

			{onClose && (
				<button
					className="button is-light is-small mb-3"
					onClick={onClose}
				>
				Back to chats
				</button>
			)}

		</div>
	);
};
export default ChatView;
