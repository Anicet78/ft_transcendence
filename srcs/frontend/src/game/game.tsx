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
		if (user?.id === room?.hostId)
			mutation.mutate();
		else if (!start) {
			navigate("/home");
			return ;
		}

		setGameSocket(new WebSocket('ws://localhost:3000'));

		const initWasm = async () => {

			if (!canvasRef.current || !gameSocket) return;

			gameSocket.onopen = async () => {
				try {
					setModule(await createModule({
						canvas: canvasRef.current,
						noInitialRun: true,
						print: (text: string) => console.log('Wasm Log:', text),
						printErr: (text: string) => console.error('Wasm Error:', text),
					}));
					console.log("Module chargé avec succès !");
				} catch (e) {
					console.error("Erreur chargement Wasm:", e);
				}
			};
		}

		initWasm();

		return () => cancelStart();
	}, []);

	useEffect(() => {
		if (!Module || !gameSocket) return;

		gameSocket.onmessage = async (event) => {
			let data = event.data;

			if (data instanceof Blob)
				data = await data.text();

			try {
				const json = JSON.parse(data);
				// log('📥 Reçu JSON : ' + JSON.stringify(json, null, 2));

				if (Module && Module.getMessage) {
					Module.getMessage(json);
				} else {
					// log("⚠️ Module pas encore prêt, message ignoré");
				}
			}
			catch (e) {
				console.error("❌ JSON.parse error:", e);
				console.log("Type:", typeof data);
				console.log("Raw data:", data);
				// log('📥 Reçu (non-JSON) : ' + data);
			}
		};

		gameSocket.onclose = () => {
			// log('❌ Déconnecté du serveur');
		};

		gameSocket.onerror = (err) => {
			// log('⚠️ Erreur WebSocket');
			console.error(err);
		};
	}, [Module]);

	if (mutation.isPending)
		return <div>Verifying room</div>;

	if (mutation.isError) {
		navigate("/home");
		return;
	}

	if (!gameSocket || gameSocket.readyState != gameSocket.OPEN)
		return <div>Loading game socket</div>;

	if (!Module)
		return <div>Loading game module</div>;

	/* function onCppMessage(obj: Object)
	{
		const payload = JSON.stringify(obj);

		// log('📤 Envoyé JSON : ' + payload);
		gameSocket.send(payload);
	}

	function sendResults(obj)
	{
		const payload = JSON.stringify(obj);

		log('End of game !! \n ' + payload);
		disconnect();
	}

	function disconnect()
	{
		if (socket)
		{
			socket.close();
			socket = null;
		}

		if (Module)
		{
			if (Module.finishGame)
				Module.finishGame();

			if (Module.ctx)
			{
				const ext = Module.ctx.getExtension('WEBGL_lose_context');
				if (ext)
					ext.loseContext();
			}

			Module = null;
		}

		const oldCanvas = document.getElementById("game-canvas");
		const newCanvas = oldCanvas.cloneNode(true);
		oldCanvas.parentNode.replaceChild(newCanvas, oldCanvas);
	} */

	return (
		<Box  m="4" p="6" bgColor="grey-light" textColor="black" justifyContent='space-between'>
			<canvas ref={canvasRef} id="game-canvas" width="800" height="950" tabIndex={1}></canvas>
		</Box>
	)
}

export default Game;