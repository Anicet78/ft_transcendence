import { useQuery } from "@tanstack/react-query";
import api from "../../serverApi";
import type { GetResponse } from "../../types/GetType";

type ChatMessagesResponse = GetResponse<"/chat/{chatId}/messages", "get">;

//GET CHAT MESSAGES
export function useChatMessages(chatId?: string) {
	const query = useQuery({
		queryKey: ["chat-messages", chatId],
		queryFn: async () => {
			const res = await api.get<ChatMessagesResponse>(`/chat/${chatId}/messages`);
			return res.data;
		},
	enabled: !!chatId
	});

	return {
		...query,
		messages: (query.data ?? []).filter(m => m.status !== "deleted")
		//dotn show deleted message
		// need to work on this for not showing deleted and moderated messages ONLY for members and writers
	};
}
