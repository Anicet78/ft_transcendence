import { useNavigate } from 'react-router';
import { useRoom } from '../home/RoomContext';
import './game.css'
import { Box } from '@allxsmith/bestax-bulma';
import { useAuth } from '../auth/AuthContext';
import api from '../serverApi';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { GameModule } from './build/game';
import createModule from './build/game';
import toast from '../Notifications.tsx';
import { SidebarChat } from '../chat/components/SidebarChat';

const Game = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { room, start, cancelStart } = useRoom()!;

	const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
	const [Module, setModule] = useState<GameModule | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const mutation = useMutation({
		mutationFn: () => api.post("/room/launch", room),
	});

	useEffect(() => {
		if (user?.id === room?.hostId) {
			mutation.mutate();
		}
		else if (!start) {
			toast({ title: `An error occurred`, message: 'No active game has been found', type: "is-warning" })
			navigate("/home");
			return ;
		}

		const socket = new WebSocket('wss://localhost:8443/ws/');
		setGameSocket(socket);

		if (!socket) return ;

		return () => {
			if (start) return;

			cancelStart();
			socket.close();

			if (!Module) return;

			Module.finishGame();

			if ((Module as any).ctx) {
				const ext = (Module as any).ctx.getExtension('WEBGL_lose_context');
				if (ext) ext.loseContext();
			}
		};
	}, []);

	useEffect(() => {
		if (!canvasRef.current || mutation.isPending || !gameSocket || !user || !room) return;

		const initWasm = async () => {
			try {
				const mod = await createModule({
					canvas: canvasRef.current,
					noInitialRun: true,
					locateFile: (path: string, prefix: string) => {
						if (path.endsWith(".data")) return `http://localhost:5173/game/build/${path}`;
						return prefix + path;
					},
					onCppMessage: (obj: Object) => gameSocket.send(JSON.stringify(obj)),
					sendResults: (obj: Object) => {
						console.log(JSON.stringify(obj))
						toast({ title: `Game finished !`, type: "is-info" })
						navigate("/home");
					}
				});

				(window as any).onCppMessage = (mod as any).onCppMessage;
				(window as any).sendResults = (mod as any).sendResults;

				setModule(mod);
				// Add username and session size
				mod.callMain([user.id, 'username', room.roomId, room.players.length.toString(), "1"]);
			} catch (e) {
				console.error("Wasm Error:", e);
			}
		};

		initWasm();
	}, [mutation.isPending, gameSocket]);

	useEffect(() => {
		if (!gameSocket || !Module) return;

		gameSocket.onmessage = async (event) => {
			let data = event.data;
			if (data instanceof Blob) data = await data.text();

			try {
				const json = JSON.parse(data);
				if (Module.getMessage) Module.getMessage(json);
			} catch (e) {
				console.error("JSON parse error", e);
			}
		};

		gameSocket.onclose = () => {

		};

		gameSocket.onerror = (err) => {
			console.error(err);
		};

	}, [gameSocket, Module]);

	if (mutation.isPending) {
		return <div>Verifying room</div>;
	}

	if (mutation.isError) {
		toast({ title: `An error occured`, message: "Cannot join the game !", type: "is-danger" })
		navigate("/home");
		return;
	}

	// return (
	// 	<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
	// 		<canvas ref={canvasRef} id="game-canvas" width="800" height="950" tabIndex={1}></canvas>
	// 	</Box>
	// )
	return (
		<div style={{ display: "flex", height: "100vh" }}>
			
			{/* GAME CANVAS */}
			<Box p="6" bgColor="grey-light" style={{ height: "100%", width: "100%" }}>
				<canvas ref={canvasRef} id="game-canvas" width="800" height="950" tabIndex={1}></canvas>
			</Box>

			{/* CHAT SIDEBAR */}
			<SidebarChat />

		</div>
	)

}

export default Game;
