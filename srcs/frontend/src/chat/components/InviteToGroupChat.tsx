import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../serverApi";
import { Box, Button } from "@allxsmith/bestax-bulma";
import { useAuth } from "../../auth/AuthContext";
import { useParams } from "react-router";
import toast from "../../Notifications";

type Props = {
	chatId?: string;
	existingMembers?: any[];
};

export function InviteToGroupChat({
	chatId: propChatId,
	existingMembers = []
}: Props) {

	const params = useParams();
	const chatId = propChatId ?? params.chatId;

	const { user } = useAuth();

	// Fetch friends
	const { data: friends, isLoading } = useQuery({
		queryKey: ["friends"],
		queryFn: async () => {
		const res = await api.get("/friends/list");
		const friendships = res.data;

		return friendships.map((f: any) =>
			f.sender.appUserId === user?.id ? f.receiver : f.sender
		);
		}
	});

	//fetch all chat invitations
	const { data: invitations } = useQuery({
		queryKey: ["group-invitations"],
		queryFn: async () => {
		const res = await api.get("/group/invitations");
		return res.data;
		}
	});

	//invite friends to join chat mutation
	const inviteMutation = useMutation({
		mutationFn: async (friendId: string) => {
			await api.post(`/group/${chatId}/invite/${friendId}`);
		},
		onSuccess: () => {
			toast({ title: "Invite to group chat send succesfully!", type: "is-success" });
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	if (isLoading || !friends || !invitations)//check if correct to return if no friends
		return null;

	//check if friends are already chat members
	const existingIds = existingMembers?.map((m: any) => m.user.appUserId);
	const eligibleFriends = friends.filter(
		(f: any) => !existingIds.includes(f.appUserId)
	);

	//check if friends already received invite to join chat
	const pendingInvites = invitations.filter( (inv: any) => 
		inv.chatId === chatId && inv.status === "waiting" );

	if (eligibleFriends.length === 0)
		return (
		<div className="invite2group-none">
			No friends available to invite.
		</div>
		);

	return (
		<div className="invite2group">
		<h2>Invite Friends to Join Group</h2>

		{eligibleFriends.map((f: any) => {
			const isPending = pendingInvites.some(
			(inv: any) => inv.receiver.appUserId === f.appUserId
			);
		
		return (
			<div key={f.appUserId} className="friend2invite">
			{f.username}

			{
				isPending ? (
				<Button className="chat-invite-button" disabled>
					Invite pending
				</Button>

				) : (

				<Button
				className="chat-invite-button"
				onClick={() => inviteMutation.mutate(f.appUserId)}
				>
				Invite
				</Button>
				)}
			</div>
			);
		})}
		</div>
	);
}
