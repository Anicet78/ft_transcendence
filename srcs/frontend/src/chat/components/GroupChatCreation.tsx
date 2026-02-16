import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../../serverApi";
import { useNavigate } from "react-router";
import { useState } from "react";
import { Box } from "@allxsmith/bestax-bulma";
import { useAuth } from "../../auth/AuthContext";

export default function GroupChatCreation() {

	const navigate = useNavigate();
	const [name, setName] = useState("");
	const [selected, setSelected] = useState<string[]>([]);
	const { user } = useAuth();

	//fetch friends
	const { data: friends } = useQuery({
		queryKey: ["friends"],
		queryFn: async () => {
			const res = await api.get("/friends");
			const friendships = res.data;

			return friendships.map((f: any) =>
				f.sender.appUserId === user?.id ? f.receiver : f.sender);
			}
		});

	const createGroupMutation = useMutation({
		mutationFn: async () => {
			const result = await api.post("/chat/group/new", {
				name,
				memberIds: selected
			})
			return result.data;
		},
		onSuccess: (chat) => {
			navigate(`/chat/${chat.chatId}/info`);
		}
	});

	 if (!friends)
		return <div>Loading friends...</div>; 

	return (
		<Box m="4" p="6" bgColor="white">
			<h1 className="title">Create Group Chat</h1>

			<div className="field">
			<label className="label">Group Name</label>
			<input
				className="input"
				value={name}
				onChange={(e) => setName(e.target.value)}
				placeholder="please enter an awesome group name"
			/>
			</div>

			<div className="field">
			<label className="label">Select Members</label>
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

			<button
				className="button is-primary mt-4"
				onClick={() => createGroupMutation.mutate()}
			>
			Create Group Chat
			</button>
		</Box>
	);
}