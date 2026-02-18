import { useChat } from "../ChatContext";
import { useChatMessages } from "../hooks/useChatMessages";
import { useMessagesMutations } from "../hooks/useMessagesMutations";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./ChatMessageList";
import { TypingIndicator } from "./ChatTypingIndicator";

export function ChatRoom({ chatId }: {chatId: string}) {

	const {permissions, role, isTyping} = useChat();
	const {messages} = useChatMessages(chatId);
	const mutations = useMessagesMutations(chatId);

	return (
		<>
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
		</>
	);
}