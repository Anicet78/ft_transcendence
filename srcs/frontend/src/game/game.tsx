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
import wasmUrl from './build/game.wasm?url';
import dataUrl from './build/game.data?url';

const Game = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { room, start, cancelStart } = useRoom()!;
	const [showButton, setShowButton] = useState(false);
	const [boxSize, setBoxSize] = useState({ width: "900px", height: "1050px" });
	const [JsonEnd, setJsonEnd] = useState(Object);


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

		const socketUrl = `wss://${window.location.host}/ws/`;
		const socket = new WebSocket(socketUrl);
		setGameSocket(socket);

		if (!socket) return ;

		return () => {
			if (start) return;

			cancelStart();
			socket.close();
			if (!Module) return;

			Module.finishGame();

			if ((Module as any).ctx)
			{
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
					locateFile: (path: string) => {
						if (path.endsWith('.wasm')) return wasmUrl;
						if (path.endsWith('.data')) return dataUrl;
						return path;
					},
					onCppMessage: (obj: Object) => gameSocket.send(JSON.stringify(obj)),
					sendResults: (obj: Object) => 
					{
						setJsonEnd(obj);
						console.log(JSON.stringify(obj))
						setShowButton(true);
						setBoxSize({ width: "900px", height: "300px" });
						gameSocket.close();
						if (!mod)
							return;
						mod.finishGame();

						if ((mod as any).ctx)
						{
							const ext = (mod as any).ctx.getExtension('WEBGL_lose_context');
							if (ext) ext.loseContext();
						}
					}
				});

				(window as any).onCppMessage = (mod as any).onCppMessage;
				(window as any).sendResults = (mod as any).sendResults;

				setModule(mod);
				// Add username and session size
			} catch (e) {
				console.error("Wasm Error:", e);
			}
		};

		initWasm();
	}, [mutation.isPending, gameSocket]);

	useEffect(() => {
		
		if (!gameSocket || !Module || !user || !room) return;
		gameSocket.onmessage = async (event) => {
			let data = event.data;
			if (data instanceof Blob) data = await data.text();

			try {
				const json = JSON.parse(data);
				if (Module.getMessage) Module.getMessage(json);
			} catch (e)
			{}
		};

		gameSocket.onclose = () => {

		};

		gameSocket.onerror = (err) => {
			console.error(err);
		};

		Module.callMain([user.id, 'username', room.roomId, room.players.length.toString(), "1"]);
	}, [gameSocket, Module]);

	if (mutation.isPending) {
		return <div>Verifying room</div>;
	}

	if (mutation.isError) {
		toast({ title: `An error occured`, message: "Cannot join the game !", type: "is-danger" })
		navigate("/home");
		return;
	}


	function handleHomeClick() {
		navigate("/home");
	}


	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between' style={{ width: boxSize.width, height: boxSize.height}}>
			{showButton &&
			(<div id='end-results'>
				<h2 style={{ marginBottom: "10px" }}> {JsonEnd.is_winner ? "🎉 Victoire !" : "💀 Défaite"}</h2>
				<p style={{ fontSize: "18px"}}> <strong>Monstres tués :</strong> {JsonEnd.mob_killed} </p>
				<p style={{ fontSize: "18px"}}> <strong>Temps :</strong> {JsonEnd.completion_time_min}min {JsonEnd.completion_time_sec}s {Math.round(JsonEnd.completion_time_mil * 1000)}ms </p>
			</div>)}
			<br></br>
			{showButton == true && ( <button id="home-button" onClick={handleHomeClick}> Return home </button> )}
			<canvas ref={canvasRef} id="game-canvas" width="800" height="950" tabIndex={1}></canvas>
		</Box>
	)

}

export default Game;
