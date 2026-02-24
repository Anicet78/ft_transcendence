import { useQuery } from "@tanstack/react-query";
import api from "../../serverApi";
import type { GetResponse } from "../../types/GetType";
import { useChat } from "../ChatContext";

type ChatMessagesResponse = GetResponse<"/chat/{chatId}/messages", "get">;

//GET CHAT MESSAGES
export function useChatMessages(chatId?: string) {
	
	const { role } = useChat();

	const query = useQuery({
		queryKey: ["chat-messages", chatId],
		queryFn: async () => {
			const res = await api.get<ChatMessagesResponse>(`/chat/${chatId}/messages`);
			return res.data;
		},
	enabled: !!chatId
	});

	const allMessages = query.data ?? [];

	const messages = 
	["owner", "admin", "moderator"].includes(role ?? "")
		? allMessages // moderators and above see everything
		: allMessages.filter(m => m.status === "posted" || m.status === "edited"); // members/writers see only posted

	return {
		...query,
		messages
		// messages: (query.data ?? []).filter(m => m.status !== "deleted")
		//dont show deleted message
		// need to work on this for not showing deleted and moderated messages ONLY for members and writers
	};
}

// //GET CHAT RECEIPTS
// export function useChatReceipts(chatId: string) {
// 	return useQuery({
// 		queryKey: ["chat-receipts", chatId],
// 		queryFn: async () => {
// 			const res = await api.get(`/chat/${chatId}/receipts`);
// 			return res.data;
// 		}
// 	});
// }