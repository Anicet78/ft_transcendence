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
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_LEFT_CORNER, 2, 0);

	// check for top right wall corner
	else if (check_tile(x - 1, y + 1, player) && !check_tile(x, y + 1, player) && !check_tile(x - 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_RIGHT_CORNER, 2, 0);

	//check for down left wall corner 
	else if (check_tile(x + 1, y - 1, player) && !check_tile(x, y - 1, player) && !check_tile(x + 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_LEFT_CORNER, 2, 0);

	//check for down right wall corner
	else if (check_tile(x - 1, y - 1, player) && !check_tile(x, y - 1, player) && !check_tile(x - 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_RIGHT_CORNER, 2, 0);

	// check if the wall is on the left
	else if (check_tile(x + 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_LEFT, 2, 0);

	//check if the wall is on the right
	else if (check_tile(x - 1, y, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_RIGHT, 2, 0);

	//check if the wall is on the top
	else if (check_tile(x, y + 1, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL, 2, 0);

	//check if the wall is on the bottom
	else if (check_tile(x, y - 1, player))
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN, 2, 0);
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
	
	int minY = y - 1 - depth, maxY = y + 1 + depth;
	int minX = x - 1 - depth, maxX = x + 1 + depth;

	for (int i = minY; i <= maxY; i++)
	{
		for (int j = minX; j <= maxX; j++)
		{
			if (checkTileWall(j, i, player))
			{
				if (i < y && j == x) //North
					res |= 1 << 1;
				else if (i == y && j < x) //West
					res |= 1 << 3;
				else if (i == y && j > x) //East
					res |= 1 << 4;
				else if (i > y && j == x) //South
					res |= 1 << 6;

				else if (i < y && j < x && i == minY && j == minX) //North-West
					res |= 1 << 0;
				else if (i < y && j > x && i == minY && j == maxX) //North-East
					res |= 1 << 2;
				else if (i > y && j < x && i == maxY && j == minX) //South-West
					res |= 1 << 5;
				else if (i > y  && j > x && i == maxY && j == maxX) //South-East
					res |= 1 << 7;

				else if (i < y && j < x && i == minY) //North North-West
					res |= 1 << 1;
				else if (i < y && j > x && i == minY) //North North-East
					res |= 1 << 1;
				else if (i < y && j < x && j == minX) //West North-West
					res |= 1 << 3;
				else if (i > y && j < x && j == minX) //West South-West
					res |= 1 << 3;
				else if (i < y && j > x && j == maxX) //East North-East
					res |= 1 << 4;
				else if (i > y  && j > x && j == maxX) //East South-East
					res |= 1 << 4;
				else if (i > y && j < x && i == maxY) //South South-West
					res |= 1 << 6;
				else if (i > y  && j > x && i == maxY) //South South-East
					res |= 1 << 6;
			}
		}
	}
	return res;
}

static int checkLastTree(int x, int y, int w, std::vector<int> &plan)
{
	if (y - 1 >= 0 && plan[(y - 1) * w + x] == 1)
		return 1;
	if (x - 1 >= 0 && plan[y * w + x - 1] == 1)	
		return 1;
	return 0;
}

void	manage_wall2(int x, int y, Player &player, int iteration)
{
	static std::vector<int>	plan;
	static quadList node;
	int	tile_s = gSdl.getMapTileSize() * 2;
	static int w;

	if (node != player.getNode())
	{
		w = player.getRoom().getRoomPlan()[0].size();
		node = player.getNode();
		plan.assign(w * player.getRoom().getRoomPlan().size(), 0);
	}


	if (!iteration && !checkLastTree(x, y, w, plan))
	{
		Assets::rendMap(x * tile_s, y * tile_s, 226, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, 145, 1, 1);
		plan[y * w + x] = 1;
	}
	else if (!iteration)
		Assets::rendMap(x * tile_s, y * tile_s, 226, 1, 1);
	else if (iteration && plan[y * w + x])
	{
		if (x - 2 >= 0 && plan[y * w + x - 2])
		{
			Assets::rendMap((x - 1) * tile_s, (y - 1) * tile_s, 148, 1, 1);
			Assets::rendMap((x - 1) * tile_s, (y - 2) * tile_s, 103, 1, 1);
			Assets::rendMap((x - 1) * tile_s, (y - 3) * tile_s, 13, 1, 1);

		}
		else
		{
			Assets::rendMap((x - 1) * tile_s, (y - 1) * tile_s, 99, 1, 1);
			Assets::rendMap((x - 1) * tile_s, (y - 2) * tile_s, 54, 1, 1);
			Assets::rendMap((x - 1) * tile_s, (y - 3) * tile_s, 9, 1, 1);
		}

		
		Assets::rendMap(x * tile_s, (y - 1) * tile_s, 100, 1, 1);
		Assets::rendMap(x * tile_s, (y - 2) * tile_s, 55, 1, 1);
		Assets::rendMap(x * tile_s, (y - 3) * tile_s, 10, 1, 1);

		Assets::rendMap((x + 1) * tile_s, (y - 1) * tile_s, 101, 1, 1);
		Assets::rendMap((x + 1) * tile_s, (y - 2) * tile_s, 56, 1, 1);
		Assets::rendMap((x + 1) * tile_s, (y - 3) * tile_s, 11, 1, 1);
	}
	
}

void initAutoTileOffset(std::array<int, 256> &autoTileOffset)
{
	// Cas neutres
	autoTileOffset[0]   = 0;
	autoTileOffset[24]  = 0;
	autoTileOffset[68]  = 0;

	// Coins simples
	autoTileOffset[1]   = 46;
	autoTileOffset[4]   = 44;
	autoTileOffset[32]  = -44;
	autoTileOffset[128] = -46;

	// Coins opposés
	autoTileOffset[36]  = 185;
	autoTileOffset[129] = 186;

	// NW + around
	int nwList[] = {10, 11, 12, 14, 15, 34, 38, 39, 42, 43, 44, 45, 47};
	for (int m : nwList)
		autoTileOffset[m] = -43;

	// NE + around
	int neList[] = {17, 18, 19, 22, 23, 130, 131, 135, 145, 146, 149, 150, 151};
	for (int m : neList)
		autoTileOffset[m] = -42;

	// SW + around
	int swList[] = {65, 72, 73, 104, 105, 136, 137, 169, 193, 200, 225, 232, 233};
	for (int m : swList)
		autoTileOffset[m] = 2;

	// SE + around
	int seList[] = {48, 52, 68, 80, 84, 100, 112, 180, 208, 212, 228, 240, 244};
	for (int m : seList)
		autoTileOffset[m] = 3;

	// N group
	int nList[] = {2, 3, 5, 6, 7};
	for (int m : nList)
		autoTileOffset[m] = 45;

	// W group
	int wList[] = {8, 9, 33, 40, 41};
	for (int m : wList)
		autoTileOffset[m] = 1;

	// E group
	int eList[] = {16, 20, 132, 144, 148};
	for (int m : eList)
		autoTileOffset[m] = -1;

	// S group
	int sList[] = {64, 96, 160, 192, 224};
	for (int m : sList)
		autoTileOffset[m] = -45;
}


void	manageSoil(int x, int y, Player &player)
{
	static std::array<int, 256>	autoTileOffset = {0};
	int	tile_s = gSdl.getMapTileSize() * 2;
	int depth = -1;
	uint8_t	mask = 0;

	if (!autoTileOffset[1])
		initAutoTileOffset(autoTileOffset);

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
	//std::cout << "x = " << x << ", y = " << y << ", mask = " << (int)mask << ", depth = " << depth << std::endl;
	int color = 541 + depth * 9;
	int color2 = (depth == 2) ? color : color + 9;
	int offset = autoTileOffset[mask];
	Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
	Assets::rendMap(x * tile_s, y * tile_s, color + offset, 1, 1);
}

void	manageFloorPrint(int x, int y, char c, Player &player, int iteration)
{
	int	tile_s = gSdl.getMapTileSize() * 2;
	(void)iteration;
	if (player.getFloor() == 0)
	{
		if (c == '1')
			manage_wall(x, y, player);
		else if (c == '0')	
			Assets::rendMap(x * tile_s, y * tile_s, Assets::FLOOR, 2, 0);
		else if (c == 'E')
			Assets::rendMap(x * tile_s, y * tile_s, Assets::DOOR_FRONT, 2, 0);
	}
	else if (player.getFloor() == 1)
	{
		if (c == '1'  || c == ' ')
			manage_wall2(x, y, player, iteration);
		else if (c == '0' || c == 'P')
			manageSoil(x, y, player);
	}
	
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
		{
			gSdl.texture = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 800 * 16, 800 * 16);
			SDL_SetTextureBlendMode(gSdl.texture, SDL_BLENDMODE_BLEND);
		}
		if (gSdl.texture2 == NULL)
		{
			gSdl.texture2 = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 800 * 16, 800 * 16);
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
	SDL_RenderCopy(gSdl.renderer, gSdl.texture2, &camera, NULL);
}