#include "Game.hpp"

void	manageFloorPrint(int x, int y, char c, Player &player, int iteration)
{
	int	tile_s = gSdl.getMapTileSize() * 2;
	if (player.getFloor())
	{
		if (c == '1'  || c == ' ')
			manage_wall_forest(x, y, player, iteration);
		if (c == '2')
			Assets::rendMap(x * tile_s, y * tile_s, 865, 1, 1);
		else if (c == '0' || c == 'P' || c == 'E')
			manageSoil(x, y, player);
	}
	else if (player.getFloor() == 0)
	{
		if (c == '1' && !iteration)
			manage_wall(x, y, player);
		else if (c == '3')
			manage_water(x, y, player);
		else if (c == '0' || c == 'P')
			manage_floor(x, y, player);
		else if (c == 'E')
			Assets::rendMap(x * tile_s, y * tile_s, Assets::DOOR_FRONT, 2, 0);
		else if (c == 'S')
			manage_stairs(x, y, player);
	}
}

void	print_map(Player &player)
{
	static int	mapX = -1;
	static int	mapY = -1;
	static int	floor = -1;

	quadList	node = player.getNode();
	int	tile_s = gSdl.getMapTileSize() * 2;

	if (mapX != node->getX() || mapY != node->getY() || floor != player.getFloor())
	{
		mapX = node->getX();
		mapY = node->getY();
		floor = player.getFloor();

		if (gSdl.texture == NULL)
		{
			gSdl.texture = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, gSdl.maxTexWidth, gSdl.maxTexHeight);
			SDL_SetTextureBlendMode(gSdl.texture, SDL_BLENDMODE_BLEND);
		}
		if (gSdl.texture2 == NULL)
		{
			gSdl.texture2 = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, gSdl.maxTexWidth, gSdl.maxTexHeight);
			SDL_SetTextureBlendMode(gSdl.texture2, SDL_BLENDMODE_BLEND);
		}

		SDL_SetRenderTarget(gSdl.renderer, gSdl.texture);
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 0);
		SDL_RenderClear(gSdl.renderer);

		int h = player.getRoom().getRoomPlan().size();
		for (int y = 0; y < h; y++)
		{
			int w = player.getRoom().getRoomPlan()[y].size();
			for (int x = 0; x < w; x++)
			{
				char c = player.getRoom().getRoomPlan()[y][x];
				manageFloorPrint(x, y, c, player, 0);
			}
		}
		if (player.getFloor())
		{
			SDL_SetRenderTarget(gSdl.renderer, gSdl.texture2);
			SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 0);
			SDL_RenderClear(gSdl.renderer);
			for (int y = 0; y < h; y++)
			{
				int w = player.getRoom().getRoomPlan()[y].size();
				for (int x = 0; x < w; x++)
				{
					char c = player.getRoom().getRoomPlan()[y][x];
					if (c != '1' && c != ' ')
						continue ;
					manageFloorPrint(x, y, c, player, 1);
				}
			}
		}
		SDL_SetRenderTarget(gSdl.renderer, gSdl.game);
	}

	int roomH = player.getRoom().getRoomPlan().size();
	int roomW = player.getRoom().getRoomPlan()[0].size();
	Camera	&camera = player.getCamera();
	camera.updateCamera(tile_s, roomW, roomH);
	player.updateScreenPos(tile_s);
	SDL_Rect dst = {0, 0, SCREEN_WIDTH, GAME_HEIGHT};
	SDL_RenderCopy(gSdl.renderer, gSdl.texture, &camera.getCamera(), &dst);
}
