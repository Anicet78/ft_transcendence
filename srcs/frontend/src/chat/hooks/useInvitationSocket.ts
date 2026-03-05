import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "../../socket/SocketContext";

export function useInvitationSocket() {
	const socket = useSocket();
	const queryClient = useQueryClient();

	useEffect(() => {
		if (!socket)
			return;

		const invalidateInviteList = () => {
  			queryClient.invalidateQueries({ queryKey: ["group-invitations"] });
		};

		socket.on("invite_received", invalidateInviteList);
		socket.on("invite_sent", invalidateInviteList);
		socket.on("invite_accepted", invalidateInviteList);
		socket.on("invite_rejected", invalidateInviteList);
		socket.on("invite_canceled", invalidateInviteList);

		return () => {
			socket.off("invite_received", invalidateInviteList);
			socket.off("invite_sent", invalidateInviteList);
			socket.off("invite_accepted", invalidateInviteList);
			socket.off("invite_rejected", invalidateInviteList);
			socket.off("invite_canceled", invalidateInviteList);
		};
	}, [socket, queryClient]);
}