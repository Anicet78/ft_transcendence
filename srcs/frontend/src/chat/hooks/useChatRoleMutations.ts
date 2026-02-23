import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../serverApi";
import toast from "../../Notifications";

export function useChatRoleMutation(chatId?: string) {

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
			await api.patch(`/group/${chatId}/role/${memberId}`, { role });
		},
		onSuccess: () => {
			toast({ title: "Role succesfully updated", type: "is-success" });
			queryClient.invalidateQueries(["chat-info"], chatId);
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});
}