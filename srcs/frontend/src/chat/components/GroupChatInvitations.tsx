import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../serverApi";
import { Button } from "@allxsmith/bestax-bulma";
import { useAuth } from "../../auth/AuthContext";
import toast from "../../Notifications";
import { useInvitationSocket } from "../hooks/useInvitationSocket";

// Fetch all chat invitations (pending and not pending at now)
//export default function GroupChatInvitations() {
export default function GroupChatInvitations({
	onClose
}: {
	onClose?: () => void;
}) {

	useInvitationSocket();
	const { user } = useAuth();
	const queryClient = useQueryClient();

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
			//window.location.reload();//(nina) not goood causes refresh
			queryClient.invalidateQueries({ queryKey: ["group-invitations"] }); 
			queryClient.invalidateQueries({ queryKey: ["chat-list"] });
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	if (!invitations)
		return <div>Loading...</div>;

	return (
		<div className="chat-invitation">
			{onClose && (
				<Button className="back-button" onClick={onClose}>
					Back
				</Button>
			)}

			<h1 aria-label="section title">Group Invitations</h1>

			{invitations.length === 0 && <p>No invitations.</p>}

			{invitations.map((inv: any) => (
			<div key={inv.chatInvitationId} className="invitation-box">
				<p><strong>Group:</strong> {inv.chat.chatName}</p>
				<p><strong>From:</strong> {inv.sender.username}</p>
				<p><strong>To:</strong> {inv.receiver.username}</p>
				<p><strong>Status:</strong> {inv.status}</p>


				{/* RECEIVED INVITATION */}
				{inv.receiver.appUserId === user?.id && inv.status === "waiting" && (
					<>
					<Button
						className="chat-accept-button"
						onClick={() =>
							updateMutation.mutate({
								invId: inv.chatInvitationId,
								action: "accept"
							})
						}
					>
						Accept
					</Button>

					<button
						className="chat-reject-button"
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
					<Button className="chat-pending-button" disabled>
						Pending
					</Button>

					<Button
						className="chat-cancel-button"
						onClick={() =>
						updateMutation.mutate({
							invId: inv.chatInvitationId,
							action: "cancel"
						})
						}
					>
						Cancel
					</Button>
					</>
				)}
			</div>
			))}
		</div>
	);
}
