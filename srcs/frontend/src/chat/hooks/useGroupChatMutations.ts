import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useChat } from "../ChatContext";
import api from "../../serverApi";
import { useMessagesMutations } from "./useMessagesMutations";
import toast from '../../Notifications.tsx';

export function useGroupChatMutations(chatId?: string) {

	const { joinChat } = useChat();
	const { sendMessageMutation } = useMessagesMutations(chatId);

	const queryClient = useQueryClient();

	const kickMutation = useMutation({
		mutationFn: async (memberId: string) => {
			await api.post(`/group/${chatId}/kick/${memberId}`);
		},
		onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			joinChat(chatId!);
			toast({ title: "Member kicked", type: "is-success" });
			queryClient.invalidateQueries({ queryKey: ["chat-list"] });//nina
			queryClient.invalidateQueries({
				queryKey: ["chat-info", chatId]
			});
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	const quitChatMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/group/${chatId}/quit`);
		},
		onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			toast({ title: "You succesfully quitted chat", type: "is-success" });
			queryClient.invalidateQueries({ queryKey: ["chat-list"] });//nina
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	const disbandMutation = useMutation({
		mutationFn: async () => {
			await api.post(`/group/${chatId}/disband`);
		},
		onSuccess: () => {
			// Refresh chat info so the kicked member disappears
			toast({ title: "Chat succesfully disbanded", type: "is-success" });
			queryClient.invalidateQueries({ queryKey: ["chat-list"] });//nina
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	const gameInviteMutation = useMutation({
		mutationFn: async () => {
			const result = await api.get("/room/me");
			const  roomId = result.data.roomId;

			await api.post(`/room/${roomId}/attach-chat`, { chatId });
			const content = `Join my game 🎮 http://localhost:5173/join/${roomId}`;
			return sendMessageMutation.mutateAsync({ content, type: "game_invite" });
		},
		onSuccess: () => {
			toast({ title: `Game invite sent`, type: "is-success" });
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	return { kickMutation, quitChatMutation, disbandMutation, gameInviteMutation };
}