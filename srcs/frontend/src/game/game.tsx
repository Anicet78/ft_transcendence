import { useNavigate } from 'react-router';
import { useRoom } from '../home/RoomContext';
import { Box, Button } from '@allxsmith/bestax-bulma';
import { useAuth } from '../auth/AuthContext';
import api from '../serverApi';
import { useMutation } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import type { GameModule } from './build/game';
import createModule from './build/game';
import toast from '../Notifications.tsx';

const Game = () => {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { room, start, cancelStart } = useRoom()!;
	const [showButton, setShowButton] = useState(true);
	const [compact, setCompact] = useState(false);;
	const [JsonEnd, setJsonEnd] = useState(Object);


	const [gameSocket, setGameSocket] = useState<WebSocket | null>(null);
	const socketRef = useRef<WebSocket | null>(null);
	const [Module, setModule] = useState<GameModule | null>(null);
	const moduleRef = useRef<GameModule | null>(null);
	const canvasContainerRef = useRef<HTMLDivElement | null>(null);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	const mutation = useMutation({
		mutationFn: () => api.post("/room/launch", room),
	});


	function createCanvas()
	{
		const canvas = document.createElement('canvas');
		canvas.id = 'canvas';
		canvas.width = 800;
		canvas.height = 950;
		canvas.tabIndex = 1;
		canvasContainerRef.current?.appendChild(canvas);
		canvasRef.current = canvas;
		return canvas;
	}

	function destroyCanvas()
	{
		const canvas = canvasRef.current;
		if (canvas)
		{
			const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
			if (gl)
			{
				const ext = gl.getExtension('WEBGL_lose_context');
				if (ext)
					ext.loseContext();
			}

			setTimeout(() =>
			{
				canvas.width = 0;
				canvas.height = 0;
				canvas.remove();
				canvasRef.current = null;
			}, 100);
		}
	}

	function cleanupWasm()
	{
		try
		{
			destroyCanvas();
			if (moduleRef.current)
			{
				moduleRef.current.finishGame();
				moduleRef.current = null;
			}
			if (socketRef.current)
			{
				socketRef.current.onmessage = null;
				socketRef.current.onerror = null;
				socketRef.current.onclose = null;
				socketRef.current.close();
				socketRef.current = null;
			}
			setModule(null);
		} catch (e) {
			console.error("cleanup error", e);
		}
	}


	useEffect(() => {
		if (user?.id === room?.hostId) {
			mutation.mutate();
		}
		else if (!start) {
			toast({ title: `An error occurred`, message: 'No active game has been found', type: "is-warning" })
			cleanupWasm();
			navigate("/home");
			return ;
		}

		const socketUrl = `wss://${window.location.port == "5173" ? 'localhost:8443' : window.location.host}/ws/`;
		const socket = new WebSocket(socketUrl);
		socketRef.current = socket;
		setGameSocket(socket);

		if (!socket) return ;

		return () =>
		{
			cleanupWasm();
			if (start)
				return;
			cancelStart();
		};
	}, []);

	useEffect(() => {
		if (mutation.isPending || !gameSocket || !user || !room) return;

		const initWasm = async () =>
		{
			const canvas = createCanvas();
			try {
				const mod = await createModule({
					canvas: canvas,
					noInitialRun: true,
					locateFile: (path: string) => {
						if (path.endsWith('.wasm')) return `https://${window.location.host}/game/game.wasm`;
						if (path.endsWith('.data')) return `https://${window.location.host}/game/game.data`;
						return path;
					},
					onCppMessage: (obj: Object) =>
						{
							if (gameSocket.readyState === WebSocket.OPEN)
								gameSocket.send(JSON.stringify(obj))
						},
					sendResults: (obj: Object) =>
					{
						setJsonEnd(obj);
						setShowButton(true);
						setCompact(true);
						delete (window as any).onCppMessage;
						delete (window as any).sendResults;
					}
				});

				(window as any).onCppMessage = (mod as any).onCppMessage;
				(window as any).sendResults = (mod as any).sendResults;
				moduleRef.current = mod;
				setModule(mod);
			} catch (e) {
				console.error("Wasm Error:", e);
			}
		};

		const timer = setTimeout(() =>
		{
			initWasm();
		}, 200);
		return () => clearTimeout(timer);
	}, [mutation.isPending, gameSocket]);


	useEffect(() =>
	{
		const canvas = canvasRef.current;
		if (!canvas || !Module) return;

		const handleCanvasClick = () =>
		{
			canvas.focus();
			canvas.tabIndex = 1;
			Module.enableInput(true);
		};


		const handleDocumentMouseDown = (e: MouseEvent) =>
		{
			if (e.target !== canvas)
			{
				canvas.blur();
				canvas.tabIndex = -1;
				Module.enableInput(false);
			}
		};


		canvas.addEventListener("mousedown", handleCanvasClick);
		document.addEventListener("mousedown", handleDocumentMouseDown);

		return () =>
		{
			canvas.removeEventListener("mousedown", handleCanvasClick);
			document.removeEventListener("mousedown", handleDocumentMouseDown);
		};
	}, [Module]);

	useEffect(() =>
{
    const canvas = canvasRef.current;
    if (!canvas)
        return;

		const handleContextLost = (e: Event) =>
		{
			e.preventDefault();
		};

		canvas.addEventListener("webglcontextlost", handleContextLost, false);
		return () => canvas.removeEventListener("webglcontextlost", handleContextLost);
	}, []);

	useEffect(() =>
	{
		window.addEventListener("beforeunload", cleanupWasm);
		return () => window.removeEventListener("beforeunload", cleanupWasm);
	}, [Module]);

	useEffect(() =>
	{
		const handleVisibility = () =>
		{
			if (!moduleRef.current)
				return;
			if (document.hidden)
				moduleRef.current.pauseGame?.();
			else
				moduleRef.current.resumeGame?.();
		};

		document.addEventListener("visibilitychange", handleVisibility);
		return () => document.removeEventListener("visibilitychange", handleVisibility);
	}, []);

	useEffect(() =>
	{

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

		Module.callMain([user.id, user.username, room.roomId, room.players.length.toString(), room.players.length.toString()]);
	}, [gameSocket, Module]);

	if (mutation.isPending) {
		return <div>Verifying room</div>;
	}

	if (mutation.isError)
		{
		toast({ title: `An error occured`, message: "Cannot join the game !", type: "is-danger" })
		cleanupWasm();
		navigate("/home");
		return;
	}


	function handleHomeClick()
	{
		cleanupWasm();
		navigate("/home");
	}

	JsonEnd.is_winner = true;
	JsonEnd.completion_time_min = 42;
	JsonEnd.completion_time_sec = 42;
	JsonEnd.completion_time_mil = 0.42;
	JsonEnd.mob_killed = 42;

	return (
		<div className={`game-box ${compact ? "game-box--results" : ""}`}>
			{showButton &&
			(<div className='end-results'>
				<h2>{JsonEnd.is_winner ? "🎉 Victory!" : "💀 Defeat"}</h2>
				<p>🗡️ <span>Monsters killed:</span> <span className='game-numbers'>{JsonEnd.mob_killed}</span></p>
				<p>⏱️ <span>Time:</span>
					<span className='game-numbers'>{JsonEnd.completion_time_min}</span>min
					<span className='game-numbers'>{JsonEnd.completion_time_sec}</span>s
					<span className='game-numbers'>{Math.round(JsonEnd.completion_time_mil * 1000)}</span>ms
				</p>
				<Button className="home-button" onClick={handleHomeClick}>Return home</Button>
			</div>)}
			<br></br>
			{showButton == false && (<div ref={canvasContainerRef} id="canvas-container" />)}
		</div>
	)

}

export default Game;
