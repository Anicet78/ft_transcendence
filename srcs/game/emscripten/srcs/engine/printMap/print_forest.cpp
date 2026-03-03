#include "Game.hpp"

static int checkTileWall(int x, int y, Player &player, char c, char s)
{
	int h = player.getRoom().getRoomPlan().size();
	if (y < 0 || y >= h)
		return (1);
	int w = player.getRoom().getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (1);
	if (player.getRoom().getRoomPlan()[y][x] == c)
		return (1);
	if (s && player.getRoom().getRoomPlan()[y][x] == s)
		return (1);
	return (0);
}

static uint8_t	checkWall(int x, int y, Player &player, int depth, char c, char s)
{
	uint8_t res = 0;
	
	int minY = y - 1 - depth, maxY = y + 1 + depth;
	int minX = x - 1 - depth, maxX = x + 1 + depth;

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

void	manage_wall_forest(int x, int y, Player &player, int iteration)
{
	static std::vector<int>	plan;
	static quadList node;
	int	tile_s = gSdl.getMapTileSize() * 2;
	static int w;

	if (node != player.getNode())
	{
		w = player.getRoom().getRoomPlan()[0].size();
		node = player.getNode();
		plan.assign(w * node->getRoom()->getRoomPlan().size(), 0);
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

static void initAutoTileOffset(std::array<int, 256> &autoTileOffset)
{
	// Cas neutres
	autoTileOffset[0]   = 0;
	autoTileOffset[24]  = 0;
	autoTileOffset[68]  = 0;

	// NW
	autoTileOffset[1]   = 46;
	// NE
	autoTileOffset[4]   = 44;
	// SW
	autoTileOffset[32]  = -44;
	// SE
	autoTileOffset[128] = -46;

	// Coins opposés
	autoTileOffset[36]  = 185;
	autoTileOffset[129] = 184;

	// NW + around
	int nwList[] = {10, 11, 12, 13, 14, 15, 34, 35, 38, 39, 42, 43, 44, 45, 46, 47};
	for (int m : nwList)
		autoTileOffset[m] = -43;

	// NE + around
	int neList[] = {17, 18, 19, 21, 22, 23, 130, 131, 134, 135, 145, 146, 147, 149, 150, 151};
	for (int m : neList)
		autoTileOffset[m] = -42;

	// SW + around
	int swList[] = {65, 72, 73, 97, 104, 105, 136, 137, 168, 169, 193, 200, 201, 225, 232, 233};
	for (int m : swList)
		autoTileOffset[m] = 2;

	// SE + around
	int seList[] = {48, 52, 68, 80, 84, 100, 112, 116, 176, 180, 196, 208, 212, 228, 240, 244};
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

static void initAutoTileOffset2(std::array<int, 256> &autoTileOffset)
{
	// Cas neutres
	autoTileOffset[0]   = 0;
	autoTileOffset[24]  = 0;
	autoTileOffset[68]  = 0;

	// NW
	autoTileOffset[1]   = 3;
	// NE
	autoTileOffset[4]   = 2;
	// SW
	autoTileOffset[32]  = -42;
	// SE
	autoTileOffset[128] = -43;

	// Coins opposés
	autoTileOffset[36]  = 185;
	autoTileOffset[129] = 184;

	// NW + around
	int nwList[] = {10, 11, 12, 13, 14, 15, 34, 35, 38, 39, 42, 43, 44, 45, 46, 47};
	for (int m : nwList)
		autoTileOffset[m] = -46;

	// NE + around
	int neList[] = {17, 18, 19, 21, 22, 23, 130, 131, 134, 135, 145, 146, 147, 149, 150, 151};
	for (int m : neList)
		autoTileOffset[m] = -44;

	// SW + around
	int swList[] = {65, 72, 73, 97, 104, 105, 136, 137, 168, 169, 193, 200, 201, 225, 232, 233};
	for (int m : swList)
		autoTileOffset[m] = 44;

	// SE + around
	int seList[] = {48, 52, 68, 80, 84, 100, 112, 116, 176, 180, 196, 208, 212, 228, 240, 244};
	for (int m : seList)
		autoTileOffset[m] = 46;

	// N group
	int nList[] = {2, 3, 5, 6, 7};
	for (int m : nList)
		autoTileOffset[m] = -45;

	// W group
	int wList[] = {8, 9, 33, 40, 41};
	for (int m : wList)
		autoTileOffset[m] = -1;

	// E group
	int eList[] = {16, 20, 132, 144, 148};
	for (int m : eList)
		autoTileOffset[m] = 1;

	// S group
	int sList[] = {64, 96, 160, 192, 224};
	for (int m : sList)
		autoTileOffset[m] = 45;
}

static void initAutoTileOffset3(std::array<int, 256> &autoTileOffset)
{
	// Cas neutres
	autoTileOffset[0]   = 0;
	autoTileOffset[24]  = 0;
	autoTileOffset[68]  = 0;

	// NW
	autoTileOffset[1]   = 46;
	// NE
	autoTileOffset[4]   = 44;
	// SW
	autoTileOffset[32]  = -44;
	// SE
	autoTileOffset[128] = -46;

	// Coins opposés
	autoTileOffset[36]  = 50;
	autoTileOffset[129] = 49;

	// NW + around
	int nwList[] = {10, 11, 12, 13, 14, 15, 34, 35, 38, 39, 42, 43, 44, 45, 46, 47};
	for (int m : nwList)
		autoTileOffset[m] = -46;

	// NE + around
	int neList[] = {17, 18, 19, 21, 22, 23, 130, 131, 134, 135, 145, 146, 147, 149, 150, 151};
	for (int m : neList)
		autoTileOffset[m] = -44;

	// SW + around
	int swList[] = {65, 72, 73, 97, 104, 105, 136, 137, 168, 169, 193, 200, 201, 225, 232, 233};
	for (int m : swList)
		autoTileOffset[m] = 44;

	// SE + around
	int seList[] = {48, 52, 68, 80, 84, 100, 112, 116, 176, 180, 196, 208, 212, 228, 240, 244};
	for (int m : seList)
		autoTileOffset[m] = 46;

	// N group
	int nList[] = {2, 3, 5, 6, 7};
	for (int m : nList)
		autoTileOffset[m] = 90;

	// W group
	int wList[] = {8, 9, 33, 40, 41};
	for (int m : wList)
		autoTileOffset[m] = 2;

	// E group
	int eList[] = {16, 20, 132, 144, 148};
	for (int m : eList)
		autoTileOffset[m] = 2;

	// S group
	int sList[] = {64, 96, 160, 192, 224};
	for (int m : sList)
		autoTileOffset[m] = 90;
}


void	manageSoil(int x, int y, Player &player)
{
	static std::array<int, 256>	autoTileOffset = {0};
	static std::array<int, 256>	autoTileOffset2 = {0};
	static std::array<int, 256>	autoTileOffset3 = {0};

	int	tile_s = gSdl.getMapTileSize() * 2;
	int depthTree = -1, depthPath = -1;
	uint8_t	maskTree = 0, maskPath = 0;

	if (!autoTileOffset[1])
		initAutoTileOffset(autoTileOffset);
	if (!autoTileOffset2[1])
		initAutoTileOffset2(autoTileOffset2);
	if (!autoTileOffset3[1])
		initAutoTileOffset3(autoTileOffset3);

	while (!maskTree)
	{
		depthTree++;
		if (depthTree <= 2)
			maskTree = checkWall(x, y, player, depthTree, '1', 0);
		else
		{
			depthTree--;
			break ;
		}
	}

	while (!maskPath)
	{
		depthPath++;
		if (depthPath <= 2)
			maskPath = checkWall(x, y, player, depthPath, '2', 'E');
		else
		{
			depthPath--;
			break ;
		}
	}

	int color, color2;
	int offset;

	if (maskTree && maskPath && depthTree == depthPath)
	{
		maskTree |= maskPath;
		if (depthPath == 0)
		{
			color = 676;
			offset = autoTileOffset3[maskPath];
			int offset3 = autoTileOffset[maskTree];
			color2 = 541;
			Assets::rendMap(x * tile_s, y * tile_s, 550, 1, 1);
			Assets::rendMap(x * tile_s, y * tile_s, color2 + offset3, 1, 1);
			Assets::rendMap(x * tile_s, y * tile_s, color + offset, 1, 1);
			return ;
		}
		color = 541 + depthTree * 9;
		offset = autoTileOffset[maskTree];
		color2 = (depthTree == 2) ? color : color + 9;
	}
	else
	{
		color = 541 + depthTree * 9;
		offset = autoTileOffset[maskTree];
		color2 = (depthTree == 2) ? color : color + 9;
	}
	
	Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
	Assets::rendMap(x * tile_s, y * tile_s, color + offset, 1, 1);

	if ((depthTree < 2 && depthTree <= depthPath) || (depthTree == 2 && !maskPath) || depthPath == 2)
		return ;

	if (depthPath == 0)
	{
		color = 676;
		offset = autoTileOffset3[maskPath];
		int offset2 = autoTileOffset2[maskPath];
		color2 = 550;
		Assets::rendMap(x * tile_s, y * tile_s, 865, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, 856 + offset2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color2 + offset2, 1, 1);
		Assets::rendMap(x * tile_s, y * tile_s, color + offset, 1, 1);
		return ;
	}
	else
	{
		color = 550;
		offset = autoTileOffset[maskPath];
		color2 = 559;
	}
	
	Assets::rendMap(x * tile_s, y * tile_s, color2, 1, 1);
	Assets::rendMap(x * tile_s, y * tile_s, color + offset, 1, 1);
}
