import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../serverApi";
import toast from "../../Notifications";

export function useMessagesMutations(chatId?: string) {

	const queryClient = useQueryClient();

	const invalidate = () =>
	queryClient.invalidateQueries({ queryKey: ["chat-messages", chatId] });

	return {
		//SEND MESSAGE MUTATION
		sendMessageMutation: useMutation({
			mutationFn: (content: string) =>
			api.post(`/chat/${chatId}`, { content }),
			onSuccess: invalidate, //mark cache as old (potentially updated) and update refetch it
			onError: (error: Error) => {
				toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
			}
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
			onSuccess: invalidate,
			onError: (error: Error) => {
				toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
			}
		}),

		//MODERATE MESSAGE
		moderateMessageMutation: useMutation({
			mutationFn: (messageId: string) =>
			api.patch(`/chat/${chatId}/message/${messageId}/moderate`),
			onSuccess: invalidate,
			onError: (error: Error) => {
				toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
			}
		}),

		//RESTORE MESSAGE
		restoreMessageMutation: useMutation({
			mutationFn: (messageId: string) =>
			api.patch(`/chat/${chatId}/message/${messageId}/restore`),
			onSuccess: invalidate,
			onError: (error: Error) => {
				toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
			}
		})
	};
}
