#include "Game.hpp"

Engine gSdl;

#ifdef __EMSCRIPTEN__

	std::queue<val> msgJson;


	void finishGame()
	{
		SDL_EventState(SDL_KEYDOWN, SDL_DISABLE);
		SDL_EventState(SDL_KEYUP, SDL_DISABLE);
		emscripten_cancel_main_loop();
	}

	void getMessage(val obj)
	{
		msgJson.push(obj);
		if (msgJson.size() > 7)
			msgJson.pop();
	}

#endif

#ifdef __EMSCRIPTEN__
	EMSCRIPTEN_BINDINGS(module)
	{
		emscripten::function("getMessage", &getMessage);
		emscripten::function("finishGame", &finishGame);
	}
#endif

void mainloopE(void *arg)
{
	static bool init = false;
	static double frameTime = gSdl.getActualTime();
	Game *game = static_cast<Game *>(arg);
	parseJson(init, *game);
	if (!init)
		return ;

	int	ticksPerFrame = 1000 / MAX_FPS;
	gSdl.cap.startTimer();
	while (SDL_PollEvent(&gSdl.event))
	{
		if (gSdl.event.type == SDL_KEYDOWN && gSdl.event.key.keysym.sym == SDLK_ESCAPE)
		{
			emscripten_cancel_main_loop();
			return ;
		}
		else if (gSdl.event.type == SDL_KEYDOWN)
			key_down();
		else if (gSdl.event.type == SDL_KEYUP)
			key_up();
	}
	game_loop(*game, gSdl.getActualTime() - frameTime);
	frameTime = gSdl.getActualTime();
	SDL_RenderPresent(gSdl.renderer);
	SDL_RenderClear(gSdl.renderer);
	int frameTicks = gSdl.cap.getTicks();
	if (frameTicks < ticksPerFrame)
		SDL_Delay(ticksPerFrame - frameTicks);
}

static void	importAssetsAndRoom(void)
{
	Assets::importAssets("../assets/sprite/assets.bmp", 16);
	Assets::importAssets("../assets/sprite/forest/tiles-all.bmp", 32);
	PlayerAssets::importPlayersAssets(100);
	Mob::importMobsAssets(100);

	Room::importRooms();
}

int main(int ac, char **av)
{
	srand(time(0));
	std::string name, id;
	(void)ac, (void)av;
	if (!init_sdl(gSdl))
	{
		std::cerr << "Error in sdl init" << std::endl;
		return (1);
	}
	try
	{
		gSdl.setMapTileSize(16);
		importAssetsAndRoom();

		#ifdef __EMSCRIPTEN__
		id = std::to_string(rand() % 500);
		name = "guest_" + id;
		gSdl.setPlayerName(name);
		gSdl.setPlayerId(id);
		EM_ASM_({
			onCppMessage({
				action: "join_queue",
				player_name: UTF8ToString($0),
				player_id: UTF8ToString($1),
				group_size: 1
			});
		}, name.c_str(), id.c_str());
		#endif

	}
	catch(const std::exception& e)
	{
		std::cerr << e.what() << '\n';
		return (0);
	}
	Player player(id, name, (SDL_Color){0, 255, 0, 255});
	Game	game(player);
	#ifdef __EMSCRIPTEN__
		emscripten_set_main_loop_arg(mainloopE, &game, MAX_FPS, true);
	#endif
	return (0);
}
