import { useMutation } from "@tanstack/react-query";
import { useChat } from "../ChatContext";
import api from "../../serverApi";
import { useMessagesMutations } from "./useMessagesMutations";
import toast from '../../Notifications.tsx';

export function useGroupChatMutations(chatId?: string) {
	
	const { joinChat, leaveChat } = useChat();
	const { sendMessageMutation } = useMessagesMutations(chatId); 

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

	const gameInviteMutation = useMutation({
		mutationFn: async () => {
			const result = await api.get("/room/me");
			const  roomId = result.data.roomId;

			const content = `Join my game 🎮 http://localhost:5173/join/${roomId}`;
			return sendMessageMutation.mutateAsync(content);
		},
		onSuccess: () => {
			toast({ title: `Game invite sent`, type: "is-info" });
		}
	});

	return { kickMutation, quitChatMutation, disbandMutation, gameInviteMutation };
}