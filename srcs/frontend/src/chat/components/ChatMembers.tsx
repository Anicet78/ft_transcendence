import { useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { useChat } from "../ChatContext";
import { useChatRoleMutation } from "../hooks/useChatRoleMutations";
import { useGroupChatMutations } from "../hooks/useGroupChatMutations";
import { useChatInfo } from "../hooks/useChatInfo";
import { Button } from "@allxsmith/bestax-bulma";

export function ChatMembers({chatId}) {

	const { data: chat } = useChatInfo(chatId);
	const { /*chat,*/ permissions } = useChat();
	const { user } = useAuth();

	const roleMutation = useChatRoleMutation(chatId);
	const {kickMutation} = useGroupChatMutations(chatId);

	 const [open, setOpen] = useState(false); 

	if (!chat)
		return null; //<div>Loading chat...</div>;

	return (
		<div className="mb-4 members-container">
		{/* HEADER */}
			<div className="members-dropdown" onClick={() => setOpen(!open)}>
				<span style={{ marginRight: "6px" }}>
					{open ? "▼" : "▶"}
				</span>
					Members ({chat.members.length})
			</div>

			{open && (<ul className="members-list">
				{chat.members.map((m: any) => (
				<li key={m.chatMemberId} className="mb-1">
					{m.user.username} - <em>{m.role}</em>

					{permissions.canChangeRoles && m.user.appUserId !== user?.id && (
					<select
						className="ml-2 role-options"
						value={m.role}
						onChange={(e) =>
							roleMutation.mutate({
								memberId: m.user.appUserId,
								role: e.target.value
							})
						}
					>
						<option value="owner">Owner</option>
						<option value="admin">Admin</option>
						<option value="moderator">Moderator</option>
						<option value="writer">Writer</option>
						<option value="member">Member</option>
					</select>
					)}

					{/* KICK MEMBER */}
					{permissions.canKick && m.user.appUserId !== user?.id && (
						<Button
							className="chat-kick-button"
							onClick={() => kickMutation.mutate(m.user.appUserId)}
						>
							Kick
						</Button>
					)}
				</li>
				))}
			</ul>
			)}
		</div>
	);
}
