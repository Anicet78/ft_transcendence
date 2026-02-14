import { useParams } from "react-router"
import { useChat } from "./ChatContext";
import { useChatMessages } from "./hooks/useChatMessages";
import { useChatMutations } from "./hooks/useChatMutations";
import { useEffect } from "react";
import { Box } from "@allxsmith/bestax-bulma";
import { MessageList } from "./components/ChatMessageList";
import { ChatInput } from "./components/ChatInput";
import { useChatSocket } from "./hooks/useChatSocket";
import { TypingIndicator } from "./components/ChatTypingIndicator";

const ChatView = () => {
	const { chatId } = useParams();
	//const { chat, role, permissions, typingUsers, joinChat } = useChat();
	const { chat, role, permissions, isTyping, joinChat } = useChat();

	const { messages, isLoading, isError } = useChatMessages(chatId);
	const mutations = useChatMutations(chatId);

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
			<h1 className="title">
				{chat.chatName || (chat.chatType === "private" ? "Private chat" : "Group chat")}
			</h1>

			<MessageList
				messages={messages}
				role={role}
				permissions={permissions}
				onEdit={mutations.editMessageMutation.mutate}
				onModerate={mutations.moderateMessageMutation.mutate}
				onDelete={mutations.deleteMessageMutation.mutate}
				onRestore={mutations.restoreMessageMutation.mutate}
			/>

			{/* <TypingIndicator typingUsers={typingUsers} /> */}
			<TypingIndicator isTyping={isTyping} />

			<ChatInput
				chatId={chatId}
				onSend={mutations.sendMessageMutation.mutate}
			/>
		</Box>
	);
};
export default ChatView;

//need to add chatMembers at top of conversation