import { useQuery, useMutation } from "@tanstack/react-query";
import api from "../../serverApi";
import { Box } from "@allxsmith/bestax-bulma";
import { useAuth } from "../../auth/AuthContext";
import toast from "../../Notifications";

// Fetch all chat invitations (pending and not pending at now)
export default function GroupChatInvitations() {

	const { user } = useAuth();

	//get all invitations
	const { data: invitations } = useQuery({
		queryKey: ["group-invitations"],
		queryFn: async () => {
			const res = await api.get("/group/invitations");
			return res.data;
		}
	});

	//accept / reject / cancel received group chat invites
	const updateMutation = useMutation({
		mutationFn: async ( {invId, action} : { invId: string; action: string }) => {
			await api.post(`/group/answer/${invId}`, { action });//need to change route name, lame
		},
		onSuccess: () => {
			toast({ title: "Chat invitation succesfully updated", type: "is-success" });
			window.location.reload();
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	if (!invitations)
		return <div>Loading...</div>;

	return (
		<Box m="4" p="6" bgColor="white">
			<h1 className="title">Group Invitations</h1>

			{invitations.length === 0 && <p>No invitations.</p>}

			{invitations.map((inv: any) => (
			<Box key={inv.chatInvitationId} className="box" m="2" p="4">
				<p><strong>Group:</strong> {inv.chat.chatName}</p>
				<p><strong>From:</strong> {inv.sender.username}</p>
				<p><strong>To:</strong> {inv.receiver.username}</p>
				<p><strong>Status:</strong> {inv.status}</p>


				{/* RECEIVED INVITATION */}
				{inv.receiver.appUserId === user?.id && inv.status === "waiting" && (
					<>
					<button
						className="button is-success is-small mt-2 mr-2"
						onClick={() =>
							updateMutation.mutate({
								invId: inv.chatInvitationId,
								action: "accept"
							})
						}
					>
						Accept
					</button>

					<button
						className="button is-danger is-small mt-2"
						onClick={() =>
						updateMutation.mutate({
							invId: inv.chatInvitationId,
							action: "reject"
						})
						}
					>
						Reject
					</button>
					</>
				)}

				{/* SENT INVITATION */}
				{inv.sender.appUserId === user?.id && inv.status === "waiting" && (
					<>
					<button className="button is-light is-small mt-2 mr-2" disabled>
						Pending
					</button>

					<button
						className="button is-warning is-small mt-2"
						onClick={() =>
						updateMutation.mutate({
							invId: inv.chatInvitationId,
							action: "cancel"
						})
						}
					>
						Cancel
					</button>
					</>
				)}
			</Box>
			))}
		</Box>
	);
}
