import { useEffect, useRef } from "react";
import { useSocket } from "../../socket/SocketContext";

export function useTyping(chatId?: string) {

	const socket = useSocket();
	const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

	const emitTypingEffect = () => {
		if (!socket || !chatId)
			return;

		socket.emit("chat_typing", { chatId });

		//reset timer
		if (timeout.current)
			clearTimeout(timeout.current);

		//after 2 seconds of no typing, stop sending effect
		timeout.current = setTimeout(() => {}, 2000);
		};

		//cleanup on unmount
		useEffect(() => {
			return () => {
				if (timeout.current)
					clearTimeout(timeout.current);
			};
		}, []);

		return { emitTypingEffect };
}
