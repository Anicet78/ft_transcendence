#include "Game.hpp"

int	check_tile(int x, int y, Player &player)
{
	int h = player.getRoom().getRoomPlan().size();
	if (y < 0 || y >= h)
		return (0);
	int w = player.getRoom().getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (0);
	if (player.getRoom().getRoomPlan()[y][x] == '0' || player.getRoom().getRoomPlan()[y][x] == '3')
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

static int checkTileWall(int x, int y, Player &player, char c, char s)
{
	auto plan = player.getRoom().getRoomPlan();
	int h = plan.size();
	if (y < 0 || y >= h)
		return (1);
	int w = plan[y].size();
	if (x < 0 || x >= w)
		return (1);
	if (plan[y][x] == c)
		return (1);
	if (s && plan[y][x] == s)
		return (1);
	return (0);
}

static uint8_t	checkWall(int x, int y, Player &player, char c, char s)
{
	uint8_t res = 0;
	
	int minY = y - 1, maxY = y + 1;
	int minX = x - 1, maxX = x + 1;

	for (int i = minY; i <= maxY; i++)
	{
		for (int j = minX; j <= maxX; j++)
		{
			if (checkTileWall(j, i, player, c, s))
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
			}
		}
	}
	return res;
}

void	manage_stairs(int x, int y, Player &player)
{
	auto plan = player.getRoomRef().getRoomPlan();
	int	tile_s = gSdl.getMapTileSize() * 2;

	if (x - 1 >= 0 && plan[y][x - 1] == 'S')
		Assets::rendMap(x * tile_s, y * tile_s, 53, 2, 0);
	else if (x - 1 >= 0)
		Assets::rendMap(x * tile_s, y * tile_s, 51, 2, 0);
	else if (x + 1 < static_cast<int>(plan[y].size()) && plan[y][x + 1] == 'S')
		Assets::rendMap(x * tile_s, y * tile_s, 51, 2, 0);
	else if (x + 1 < static_cast<int>(plan[y].size()))
		Assets::rendMap(x * tile_s, y * tile_s, 53, 2, 0);
}

static void initAutoTile(std::array<std::pair<int, int>, 256> &autoTileOffset)
{
	// Cas neutres
	autoTileOffset[0].first   = Assets::FLOOR;
	autoTileOffset[68].first  = Assets::FLOOR;

	//sandwish
	int sdList[] = {24, 25, 28, 29, 56, 57, 60, 61, 152, 153, 156, 157, 184, 185, 188, 189};
	for (int m : sdList)
		autoTileOffset[m].first = 18;
	int sdfList[] = {39, 66, 67, 71, 80, 81, 98, 99, 102, 103, 195, 196, 198, 199, 200, 227, 230, 231};
	for (int m : sdfList)
		autoTileOffset[m].first = 1;

	// NW
	autoTileOffset[1].first = 38;

	// NW + NE
	autoTileOffset[5].first = 36;
	autoTileOffset[197].first = 36;
	// NW + SW
	autoTileOffset[33].first = 54;

	// NW other corner
	int nwoList[] = {53, 97, 149, 181, 225, 229, 245};
	for (int m : nwoList)
		autoTileOffset[m].first = 38;

	// NW + around
	int nwList[] = {10, 11, 12, 14, 15, 34, 35, 38, 42, 43, 44, 46, 47, 175, 191, 239};
	for (int m : nwList)
		autoTileOffset[m].first = 0;

	// NE + around
	int neList[] = {17, 18, 19, 21, 22, 23, 130, 131, 134, 135, 145, 146, 147, 150, 151, 163, 167, 183, 226, 247};
	for (int m : neList)
		autoTileOffset[m].first = 1;

	// SW + around
	int swList[] = {31, 45, 65, 72, 73, 104, 105, 136, 137, 168, 169, 172, 173, 193, 201, 232, 233, 237, 253};
	for (int m : swList)
		autoTileOffset[m].first = 18;


	// N group
	int nList[] = {2, 3, 6, 7};
	for (int m : nList)
		autoTileOffset[m].first = 1;

	// W group
	int wList[] = {8, 9, 13, 40, 41};
	for (int m : wList)
		autoTileOffset[m].first = 18;

}

void	manage_floor(int x, int y, Player &player)
{
	static std::array<std::pair<int, int>, 256>	autoTile;
	auto plan = player.getRoomRef().getRoomPlan();
	int	tile_s = gSdl.getMapTileSize() * 2;
	u_int8_t	mask;

	if (!autoTile[1].first)
	{
		autoTile.fill({19, 0});
		initAutoTile(autoTile);
	}
	mask = checkWall(x, y, player, '1', '3');
	std::cout << "x = " << x << ", y = " << y << ", mask = " << (int)mask << std::endl;
	int tile = autoTile[mask].first;
	if (tile == 36 && plan[y - 1][x] != 'E')
		tile = 38;
	else if (tile == 54 && plan[y][x - 1] != 'E')
		tile = 38;
	Assets::rendMapFlip(x * tile_s, y * tile_s, tile, 2, 0, autoTile[mask].second);
}

int		isBitHere(uint8_t mask, int bit)
{
	return (mask & (1 << bit));
}

void	manage_water(int x, int y, Player &player)
{
	auto plan = player.getRoomRef().getRoomPlan();
	int tile_s = gSdl.getMapTileSize() * 2;
	uint8_t mask = checkWall(x, y, player, '3', 0);
	int tile = 12;
	int flip = 0;


	if (!isBitHere(mask, 1) && !isBitHere(mask, 3) && isBitHere(mask, 4) && isBitHere(mask, 6))
		tile = 41;
	else if (!isBitHere(mask, 1) && isBitHere(mask, 3) && !isBitHere(mask, 4) && isBitHere(mask, 6))
	{
		tile = 41;
		flip = SDL_FLIP_HORIZONTAL;
	}
	else if (isBitHere(mask, 1) && isBitHere(mask, 3) && !isBitHere(mask, 4) && !isBitHere(mask, 6))
		tile = 29;
	else if (isBitHere(mask, 1) && !isBitHere(mask, 3) && isBitHere(mask, 4) && !isBitHere(mask, 6))
		tile = 25;
	else if (!isBitHere(mask, 1) && isBitHere(mask, 3) && !isBitHere(mask, 4) && !isBitHere(mask, 6))
		tile = 76;
	else if (!isBitHere(mask, 1) && !isBitHere(mask, 3) && isBitHere(mask, 4) && !isBitHere(mask, 6))
	{
		tile = 76;
		flip = SDL_FLIP_HORIZONTAL;
	}
	else if (isBitHere(mask, 1) && !isBitHere(mask, 3) && !isBitHere(mask, 4) && !isBitHere(mask, 6))
		tile = 65;
	else if (!isBitHere(mask, 1) && !isBitHere(mask, 3) && !isBitHere(mask, 4) && isBitHere(mask, 6))
		tile = 64;
	else if (!isBitHere(mask, 1) && isBitHere(mask, 6))
		tile = 5;
	else if (isBitHere(mask, 1) && !isBitHere(mask, 6))
		tile = 27;
	else if (!isBitHere(mask, 3) && isBitHere(mask, 4))
		tile = 11;
	else if (isBitHere(mask, 3) && !isBitHere(mask, 4))
		tile = 13;
	else if (!isBitHere(mask, 1) && !isBitHere(mask, 6))
		tile = 75;
	else if (!isBitHere(mask, 3) && !isBitHere(mask, 4))
		tile = 74;
	//égout si mur au-dessus
	if (y - 1 >= 0 && plan[y - 1][x] == '1')
		tile = 63;

	Assets::rendMapFlip(x * tile_s, y * tile_s, tile, 2, 2, flip);
}
