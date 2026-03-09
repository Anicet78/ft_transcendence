import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../serverApi";
import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import toast from "../../Notifications";
import { Button } from "@allxsmith/bestax-bulma";

// export default function GroupChatCreation() {
export default function GroupChatCreation({
	onClose,
	onCreated
}: {
	onClose?: () => void;
	onCreated?: (chatId: string) => void;
}) {
	const [name, setName] = useState("");
	const [selected, setSelected] = useState<string[]>([]);
	const { user } = useAuth();

	//fetch friends
	const { data: friends } = useQuery({
		queryKey: ["friends"],
		queryFn: async () => {
			const res = await api.get("/friends/list");
			const friendships = res.data;

			return friendships.map((f: any) =>
				f.sender.appUserId === user?.id ? f.receiver : f.sender);
		}
	});

		const groupChatInput = () => {

			const trimmed = name.trim();

			if (!trimmed)
				return toast({ title: "Group name required", type: "is-warning" });

			if (trimmed.length < 3)
				return toast({ title: "Name too short", type: "is-warning" });

			if (selected.length < 2)
				return toast({ title: "Select at least 2 friends", type: "is-warning" });

			if (createGroupMutation.isPending)
				return <div>Creating group chat...</div>;

			createGroupMutation.mutate();
		};


	const createGroupMutation = useMutation({
		mutationFn: async () => {
			const result = await api.post("/chat/group/new", {
				name,
				memberIds: selected
			})
			return result.data;
		},
		onSuccess: (chat) => {
			toast({ title: "Group succesfully created", type: "is-success" });
			onCreated?.(chat.chatId);
		},
		onError: (error: Error) => {
			toast ({ title: "Error", message: error.message ?? "Unknown error", type: "is-danger" });
		}
	});

	 if (!friends)
		return <div>Loading friends...</div>; 

	return (
		<div className="chat-creation">
			{onClose && (
				<Button className="back-button" onClick={onClose}>
					Back
				</Button>
			)}

			<h1 aria-label="section title">Create Group Chat</h1>

			<div className="field groupname">
			<label>Group Name</label>
			<input
				className="input"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="please enter an awesome group name"
			/>
			</div>

			<div className="field members-checkbox">
			<label className="select-label">Select Members</label>
			{friends?.map((f: any) => (
				<label key={f.appUserId} className="checkbox is-block">
				<input
					type="checkbox"
					checked={selected.includes(f.appUserId)}
					onChange={() => {
						setSelected((prev) =>
							prev.includes(f.appUserId)
							? prev.filter((id) => id !== f.appUserId)
							: [...prev, f.appUserId]
						);
					}}
				/>
				<span className="ml-2">{f.username}</span>
				</label>
			))}
			</div>

			<Button
				className="group-chat-btn"
				onClickCapture={ groupChatInput}
				//</Box>onClick={() => createGroupMutation.mutate()}
			>
				Create Group Chat
			</Button>
		</div>
	);
}
