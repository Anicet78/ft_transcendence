import { useQuery } from "@tanstack/react-query";
import api from "../../serverApi";

export function useChatInfo(chatId?: string) {
	return useQuery({
		queryKey: ["chat-info", chatId],
		enabled: !!chatId,
		queryFn: async () => {
			const result = await api.get(`/chat/${chatId}/info`);
			return result.data;
		}
	});
} 