import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../serverApi.ts';
import toast from '../Notifications.tsx';
import friendshipQueries from './friendshipQueries.ts';
import type { actionType } from './friendshipQueries.ts';

export const useFriendshipModification = (username?: string) => {
	const queryClient = useQueryClient();

	const mutation =  useMutation({
		mutationFn: async ({ action, id }: { action: actionType; id: string }) => {
			switch (action) {
				case 'accept':
				case 'reject':
				case 'cancel':
					return api.patch(`/friends/${id}`, { action });
				case 'add':
					return api.post(`/friends/${id}`);
				case 'remove':
					return api.delete(`/friends/${id}`);
				case 'block':
				case 'unblock':
					return api.post(`/profile/${id}/${action}`);
				default:
					throw new Error('Unknown action');
			}
		},
		// use of '_' to access variables parameters only because I don't need the first one (data, replace by _)
		onSuccess: (_, variables) => {
			const messages: Record<actionType, string> = {
				accept: 'Friendship request accepted successfully!',
				reject: 'Friendship request rejected successfully!',
				cancel: 'Friendship request cancelled successfully!',
				add: 'Friendship request sent successfully!',
				remove: 'Friendship relation successfully removed!',
				block: 'User successfully blocked!',
				unblock: 'User successfully unblocked!',
			};
			toast({
				title: 'Success',
				message: messages[variables.action] || 'Friendship updated successfully!',
				type: 'is-success',
			});
			friendshipQueries(username).forEach((key) => {
				queryClient.invalidateQueries({ queryKey: key });
			})
			queryClient.invalidateQueries({queryKey: ['friends']})
		},
		onError: (error: Error) => {
			toast({ title: `An error occurred`, message: error.message, type: "is-warning" })
		}
	});

	// function to call any action
	const run = (action: actionType, id: string) =>
		mutation.mutate({ action, id });

	return {
		run,
		isLoading: mutation.isPending,
		isError: mutation.isError,
		error: mutation.error,
	};
}

