#include "Game.hpp"

int	check_tile(int x, int y, Player &player)
{
	int h = player.getRoom().getRoomPlan().size();
	if (y < 0 || y >= h)
		return (0);
	int w = player.getRoom().getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (0);
	if (player.getRoom().getRoomPlan()[y][x] == '0')
		return (1);
	return (0);
}

int	check_valid_tile(int x, int y, Player &player)
{
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
int	check_border(int x, int y, Player &player)
{

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
	if (check_tile(x + 1, y + 1, player) && !check_tile(x, y + 1, player) && !check_tile(x + 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_LEFT_CORNER, 2, player.getFloor());

	// check for top right wall corner
	else if (check_tile(x - 1, y + 1, player) && !check_tile(x, y + 1, player) && !check_tile(x - 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_RIGHT_CORNER, 2, player.getFloor());

	//check for down left wall corner 
	else if (check_tile(x + 1, y - 1, player) && !check_tile(x, y - 1, player) && !check_tile(x + 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_LEFT_CORNER, 2, player.getFloor());

	//check for down right wall corner
	else if (check_tile(x - 1, y - 1, player) && !check_tile(x, y - 1, player) && !check_tile(x - 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_RIGHT_CORNER, 2, player.getFloor());

	// check if the wall is on the left
	else if (check_tile(x + 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_LEFT, 2, player.getFloor());

	//check if the wall is on the right
	else if (check_tile(x - 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_RIGHT, 2, player.getFloor());

	//check if the wall is on the top
	else if (check_tile(x, y + 1, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL, 2, player.getFloor());

	//check if the wall is on the bottom
	else if (check_tile(x, y - 1, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN, 2, player.getFloor());
}

//manage the wall print
void	manage_wall(int x, int y, Player &player)
{
	if (check_border(x, y, player))
	{
		manage_border(x, y, player);
		return ;
	}
}

float	cameraX(Player const &player, int const tile_size) {
	float idealMinX = player.getX() - 12;
	float idealMaxX = player.getX() + 13;
	int roomW = player.getRoom().getRoomPlan()[0].size();

	if (idealMinX < 0)
	{
		idealMinX = 0;
		idealMaxX = std::min(25, roomW);
	}
	else if (idealMaxX > roomW)
	{
		idealMaxX = roomW;
		idealMinX = std::max(0, roomW - 25);
	}

	if (idealMinX > idealMaxX)
		idealMinX = idealMaxX;

	if (roomW * tile_size <= SCREEN_WIDTH)
		idealMinX = 0;
	return (idealMinX);
}

float	cameraY(Player const &player, int const tile_size) {
	float idealMinY = player.getY() - 12;
	float idealMaxY = player.getY() + 13;
	int roomH = player.getRoom().getRoomPlan().size();
	if (idealMinY < 0)
	{
		idealMinY = 0;
		idealMaxY = std::min(25, roomH);
	}
	else if (idealMaxY > roomH)
	{
		idealMaxY = roomH;
		idealMinY = std::max(0, roomH - 25);
	}

	if (idealMinY > idealMaxY)
		idealMinY = idealMaxY;

	if (roomH * tile_size <= SCREEN_HEIGHT)
		idealMinY = 0;
	return (idealMinY);
}

int checkTileWall(int x, int y, Player &player)
{
	int h = player.getRoom().getRoomPlan().size();
	if (y < 0 || y >= h)
		return (1);
	int w = player.getRoom().getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (1);
	if (player.getRoom().getRoomPlan()[y][x] == '1')
		return (1);
	return (0);
}

uint8_t	checkWall(int x, int y, Player &player, int depth)
{
	uint8_t res = 0;
	for (int i = y - 1 - depth; i < y + 1 + depth; i++)
	{
		for (int j = x - 1 - depth; j < x + 1 + depth; j++)
		{
			if (checkTileWall(j, i, player))
			{
				if (i < y && j < x) //North-West
					res |= 1 << 0;
				else if (i < y && j == x) //North
					res |= 1 << 1;
				else if (i < y && j > x) //North-East
					res |= 1 << 2;
				else if (i == y && j < x) //West
					res |= 1 << 3;
				else if (i == y && j > x) //East
					res |= 1 << 4;
				else if (i > y && j < x) //South-West
					res |= 1 << 5;
				else if (i > y && j == x) //South
					res |= 1 << 6;
				else if (i > y  && j > x) //South-East
					res |= 1 << 7;
			}
		}
	}
	return res;
}

void	manage_wall2(int x, int y, Player &player)
{
	(void)player;
	int	tile_s = gSdl.getMapTileSize() * 2;
	Assets::rendMap(x * tile_s, y * tile_s, 226, 1, 1);
}

void	manageSoil(int x, int y, Player &player)
{
	int	tile_s = gSdl.getMapTileSize() * 2;
	int depth = -1;
	uint8_t	mask = 0;
	while (!mask)
	{
		depth++;
		mask = checkWall(x, y, player, depth);
		if (depth > 2)
		{
			depth = 2;
			break ;
		}
	}
	//586
	int color = 226 + depth * 9;
	int color2 = (depth == 2) ? color : color + 9;
	if (!mask) //no neighbors
		Assets::rendMap(x * tile_s, y * tile_s, color, 1, 1);
	else if (mask == 1 || mask == 11 || mask == 47) //NW
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color - 43, 1, 1);
	}
	else if (mask == 2 || mask == 3 || mask == 6 || mask == 7) //N
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color + 45, 1, 1);
	}
	else if (mask == 4 || mask == 151) //NE
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color - 42, 1, 1);
	}
	else if (mask == 8 || mask == 9 || mask == 40 || mask == 41) //W
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color + 1, 1, 1);
	}
	else if (mask == 16 || mask == 20 || mask == 144 || mask == 148) //E
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color - 1, 1, 1);
	}
	else if (mask == 32 || mask == 233) //SW
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color + 2, 1, 1);
	}
	else if (mask == 64 || mask == 96 || mask == 192 || mask == 224) //S
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color - 45, 1, 1);
	}
	else if (mask == 128 || mask == 244) //SE
	{
		Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color + 3, 1, 1);
	}
}

void	manageFloorPrint(int x, int y, char c, Player &player)
{
	int	tile_s = gSdl.getMapTileSize() * 2;
	if (c == '1' && !player.getFloor())
		manage_wall(x, y, player);
	else if (c == '1' && player.getFloor() == 1)
		manage_wall2(x, y, player);
	else if (c == '0' && player.getFloor() == 0)
		Assets::rendMap(x * tile_s, y * tile_s, Assets::FLOOR, 2, player.getFloor());
	else if (c == '0' && player.getFloor())
		manageSoil(x, y, player);
	else if (c == 'P' && player.getFloor())
	{
		Assets::rendMap(x * tile_s, y * tile_s, 244, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, 136, 1, 1);
	}
	else if (c == 'E')
		Assets::rendMap(x * tile_s, y * tile_s, Assets::DOOR_FRONT, 2, player.getFloor());
}

void	print_map(Player &player, std::vector<Player> &otherPlayers)
{
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
				manageFloorPrint(x, y, c, player);
			}
		}
		SDL_SetRenderTarget(gSdl.renderer, NULL);
	}

	float	camX = cameraX(player, tile_s);
	float	camY = cameraY(player, tile_s);
	SDL_Rect camera = {
		static_cast<int>(camX * tile_s),
		static_cast<int>(camY * tile_s),
		SCREEN_WIDTH,
		SCREEN_HEIGHT
	};

	SDL_RenderCopy(gSdl.renderer, gSdl.texture, &camera, NULL);
	float playerScreenX = (player.getX() - camX) * tile_s;
    float playerScreenY = (player.getY() - camY) * tile_s;
	player.printPlayer(playerScreenX, playerScreenY);
	if (otherPlayers.size())
	{
		for (Player &op : otherPlayers)
		{
			playerScreenX = (op.getX() - camX) * tile_s;
			playerScreenY = (op.getY() - camY) * tile_s;
			op.printPlayer(playerScreenX, playerScreenY);
		}
	}
}