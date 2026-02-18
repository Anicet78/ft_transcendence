import { useMutation } from "@tanstack/react-query";
import { useChat } from "../ChatContext";
import api from "../../serverApi";

export function useGroupChatMutations(chatId?: string) {
	
	const { joinChat, leaveChat } = useChat();

	const kickMutation = useMutation({
		mutationFn: async (memberId: string) => {
			await api.post(`/group/${chatId}/kick/${memberId}`);
		},
		onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			joinChat(chatId!);
		}
	});

	const quitChatMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/group/${chatId}/quit`);
		},
		onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			leaveChat();
			window.location.href = "/chat/list";
		}
	});

	const disbandMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/group/${chatId}/disband`);
		},
		onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			leaveChat();
			window.location.href = "/chat/list";
		}
	});

	return { kickMutation, quitChatMutation, disbandMutation };
}