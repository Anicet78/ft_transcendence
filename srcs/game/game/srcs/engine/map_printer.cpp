#include "heads.hpp"

int	check_tile(int x, int y, Player &player) {
	int h = player.getRoom().getRoomPlan().size();
	if (y < 0 || y >= h)
		return (0);
	int w = player.getRoom().getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (0);
	char c = player.getRoom().getRoomPlan()[y][x];
	if (c == '0' || c == 'M')
		return (1);
	return (0);
}

int	check_valid_tile(int x, int y, Player &player) {
	int h = player.getRoom().getRoomPlan().size();
	if (y < 0 || y >= h)
		return (0);
	int w = player.getRoom().getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (0);
	if (player.getRoom().getRoomPlan()[y][x] == ' ')
		return (0);
	return (1);
}

//check if the actual tile is at the border of the map
int	check_border(int x, int y, Player &player) {

	if (!check_valid_tile(x - 1, y - 1, player) || !check_valid_tile(x, y - 1, player)
		|| !check_valid_tile(x + 1, y - 1, player) || !check_valid_tile(x - 1, y, player)
		|| !check_valid_tile(x + 1, y, player) || !check_valid_tile(x - 1, y + 1, player)
		|| !check_valid_tile(x, y + 1, player) || !check_valid_tile(x + 1, y + 1, player))
		return (1);
	return (0);
}

void	manage_border(int x, int y, Player &player)
{
	int	tile_s = gSdl.getMapTileSize() * 2;
	// check for top left wall corner
	if (check_tile(x + 1, y + 1, player) && !check_tile(x, y + 1, player) && !check_tile(x + 1, y, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_LEFT_CORNER, 2);
	}

	// check for top right wall corner
	else if (check_tile(x - 1, y + 1, player) && !check_tile(x, y + 1, player) && !check_tile(x - 1, y, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_RIGHT_CORNER, 2);
	}

	//check for down left wall corner 
	else if (check_tile(x + 1, y - 1, player) && !check_tile(x, y - 1, player) && !check_tile(x + 1, y, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_LEFT_CORNER, 2);
	}

	//check for down right wall corner
	else if (check_tile(x - 1, y - 1, player) && !check_tile(x, y - 1, player) && !check_tile(x - 1, y, player)) { 
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_RIGHT_CORNER, 2);
	}

	// check if the wall is on the left
	else if (check_tile(x + 1, y, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_LEFT, 2);
	}

	//check if the wall is on the right
	else if (check_tile(x - 1, y, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_RIGHT, 2);
	}

	//check if the wall is on the top
	else if (check_tile(x, y + 1, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL, 2);
	}

	//check if the wall is on the bottom
	else if (check_tile(x, y - 1, player)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN, 2);
	}
}

//manage the wall print
void	manage_wall(int x, int y, Player &player)
{
	if (check_border(x, y, player)) {
		manage_border(x, y, player);
		return ;
	}
}

void	print_map(Player &player) {
	static int	mapX = -1;
	static int	mapY = -1;

	quadList	node = player.getNode();
	int	tile_s = gSdl.getMapTileSize() * 2;

	if (mapX != node->getX() || mapY != node->getY())
	{
		mapX = node->getX();
		mapY = node->getY();
		if (gSdl.texture == NULL)
			gSdl.texture = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 800 * 16, 800 * 16);

		SDL_SetRenderTarget(gSdl.renderer, gSdl.texture);
		SDL_RenderClear(gSdl.renderer);

		int h = player.getRoom().getRoomPlan().size();
		for (int y = 0; y < h; y++)
		{
			int w = player.getRoom().getRoomPlan()[y].size();
			for (int x = 0; x < w; x++)
			{
				char c = player.getRoom().getRoomPlan()[y][x];
				if (c == '1')
					manage_wall(x, y, player);
				else if (c == '0' || c == 'M')
					Assets::rendMap(x * tile_s, y * tile_s, Assets::FLOOR, 2);
				else if (c == 'E')
					Assets::rendMap(x * tile_s, y * tile_s, Assets::DOOR_FRONT, 2);
			}
		}
		SDL_SetRenderTarget(gSdl.renderer, NULL);
	}

	int roomH = player.getRoom().getRoomPlan().size();
	int roomW = player.getRoom().getRoomPlan()[0].size();
	Camera	&camera = player.getCamera();
	camera.updateCamera(tile_s, roomW, roomH);
	player.updateScreenPos(tile_s);

	SDL_RenderCopy(gSdl.renderer, gSdl.texture, &camera.getCamera(), NULL);
}