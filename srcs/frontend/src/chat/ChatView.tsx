import { useParams } from "react-router"
import { useEffect } from "react";
import { useChat } from "./ChatContext";
import { useChatMessages } from "./hooks/useChatMessages";
import { Box } from "@allxsmith/bestax-bulma";

import { useChatSocket } from "./hooks/useChatSocket";
import { useGroupChatMutations } from "./hooks/useGroupChatMutations";
import { ChatMembers } from "./components/ChatMembers";
import { ChatRoom } from "./components/ChatRoom";
import { InviteToGroupChat } from "./components/InviteToGroupChat";

// const ChatView = () => {
const ChatView = ({ chatId: propChatId, onClose }: {
	chatId?: string;
	onClose?: () => void;
}) => {
	const params = useParams();
	const chatId = propChatId ?? params.chatId;

	const { chat, role, joinChat } = useChat();

	const { isLoading, isError } = useChatMessages(chatId);
	const { quitChatMutation, disbandMutation } = useGroupChatMutations(chatId);

	useChatSocket(chatId);

	//join new chat add each chatId change
	useEffect(() => {
		if (chatId)
			joinChat(chatId);
	}, [chatId]);


	if (isLoading || !chat)
		return <div>Loading chat...</div>;

	if (isError)
		return <div>Error loading chat</div>;

	return (
		<Box m="4" p="6" bgColor="white">

			{onClose && (
				<button
					className="button is-light is-small mb-3"
					onClick={onClose}
				>
				Back to chats
				</button>
			)}

			<h1 className="title">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
			</h1>

			<ChatMembers chatId={chatId} />

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

		</Box>
	);
};
export default ChatView;
