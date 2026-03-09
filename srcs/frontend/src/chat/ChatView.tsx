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
import { Button } from "@allxsmith/bestax-bulma";
// import { useSocket } from "../socket/SocketContext";

// const ChatView = () => {
const ChatView = ({ chatId: propChatId, onClose }: {
	chatId?: string;
	onClose?: () => void;
}) => {
	const params = useParams();
	const chatId = propChatId ?? params.chatId;
	const { data: chat } = useChatInfo(chatId);

	const { /*chat,*/ role, joinChat } = useChat();

	const { isLoading, isError } = useChatMessages(chatId);
	const { quitChatMutation, disbandMutation, gameInviteMutation } = useGroupChatMutations(chatId);

	// const userSocket = useSocket();

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

	return (
		<div className='sidebar-content'>

			{onClose && (
				<Button
					className="back2chat-btn"
					onClick={onClose}
				>
				Back to chats
				</Button>
			)}

			<h1 className="title">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
			</h1>

			<ChatMembers chatId={chatId} />

			{/* GAME INVITE */}
			<Button
				className="invitation-button"
				onClick={() => gameInviteMutation.mutate()}
			>
				Invite to play game 🎮
			</Button>

			{/* QUIT CHAT */}
			{chat.chatType === "group" && role !== "owner" && (
				<Button
					className="quit-chat-button"
					onClick={() => quitChatMutation.mutate()}
				>
					Quit Group Chat
				</Button>
			)}

			{/* DISBAND CHAT */}
			{chat.chatType === "group" && role === "owner" && (
				<button
					className="quit-chat-button"
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
				<Button
					className="back2chat-btn"
					onClick={onClose}
				>
				Back to chats
				</Button>
			)}

		</div>
	);
};
export default ChatView;
