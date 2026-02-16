import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../serverApi";

export function useChatMutations(chatId?: string) {

	const queryClient = useQueryClient();

	const invalidate = () =>
	queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });

	return {
		//SEND MESSAGE MUTATION
		sendMessageMutation: useMutation({
			mutationFn: (content: string) =>
			api.post(`/chat/${chatId}`, { content }),
			onSuccess: invalidate //mark cache as old (potentially updated) and update refetch it
		}),

		//DELETE MESSAGE (only by message author, admin use MODERATE action)
		deleteMessageMutation: useMutation({
			mutationFn: (messageId: string) =>
			api.delete(`/chat/${chatId}/message/${messageId}`),
			onSuccess: invalidate
		}),

		//EDIT MESSAGE
		editMessageMutation: useMutation({
			mutationFn: ({ messageId, content }: any) =>
			api.patch(`/chat/${chatId}/message/${messageId}/edit`, { content }),
			onSuccess: invalidate
		}),

		//MODERATE MESSAGE
		moderateMessageMutation: useMutation({
			mutationFn: (messageId: string) =>
			api.patch(`/chat/${chatId}/message/${messageId}/moderate`),
			onSuccess: invalidate
		}),

		//RESTORE MESSAGE
		restoreMessageMutation: useMutation({
			mutationFn: (messageId: string) =>
			api.patch(`/chat/${chatId}/message/${messageId}/restore`),
			onSuccess: invalidate
		})
	};
}
