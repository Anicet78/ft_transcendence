import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../serverApi";

export function useChatRoleMutation(chatId?: string) {

	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ memberId, role }: { memberId: string; role: string }) => {
			await api.patch(`/group/${chatId}/role/${memberId}`, { role });
		},
		onSuccess: () => {
			queryClient.invalidateQueries(["chat-info"], chatId);
		}
	});
}