#include"game_sdl.hpp"

int	check_tile(int x, int y) {
	int h = gSdl.room.getRoomPlan().size();
	if (y < 0 || y >= h)
		return (0);
	int w = gSdl.room.getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (0);
	if (gSdl.room.getRoomPlan()[y][x] == '0')
		return (1);
	return (0);
}

int	check_valid_tile(int x, int y) {
	int h = gSdl.room.getRoomPlan().size();
	if (y < 0 || y >= h)
		return (0);
	int w = gSdl.room.getRoomPlan()[y].size();
	if (x < 0 || x >= w)
		return (0);
	if (gSdl.room.getRoomPlan()[y][x] == ' ')
		return (0);
	return (1);
}

//check if the actual tile is at the border of the map
int	check_border(int x, int y) {

	if (!check_valid_tile(x - 1, y - 1) || !check_valid_tile(x, y - 1)
		|| !check_valid_tile(x + 1, y - 1) || !check_valid_tile(x - 1, y)
		|| !check_valid_tile(x + 1, y) || !check_valid_tile(x - 1, y + 1)
		|| !check_valid_tile(x, y + 1) || !check_valid_tile(x + 1, y + 1))
		return (1);
	return (0);
}

//manage the tile print on the border
void	manage_border(int x, int y) {

	int	tile_s = gSdl.getMapTileSize() * 2;

	// check for top left wall corner
	if (check_tile(x + 1, y + 1) && !check_tile(x, y + 1) && !check_tile(x + 1, y)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_LEFT_CORNER, 2);
	}

	// check for top right wall corner
	else if (check_tile(x - 1, y + 1) && !check_tile(x, y + 1) && !check_tile(x - 1, y)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_UP_RIGHT_CORNER, 2);
	}

	//check for down left wall corner 
	else if (check_tile(x + 1, y - 1) && !check_tile(x, y - 1) && !check_tile(x + 1, y)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_LEFT_CORNER, 2);
	}

	//check for down right wall corner
	else if (check_tile(x - 1, y - 1) && !check_tile(x, y - 1) && !check_tile(x - 1, y)) { 
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN_RIGHT_CORNER, 2);
	}

	// check if the wall is on the left
	else if (check_tile(x + 1, y)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_LEFT, 2);
	}

	//check if the wall is on the right
	else if (check_tile(x - 1, y)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_RIGHT, 2);
	}

	//check if the wall is on the top
	else if (check_tile(x, y + 1)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL, 2);
	}

	//check if the wall is on the bottom
	else if (check_tile(x, y - 1)) {
		Assets::rendMap(x * tile_s, y * tile_s, Assets::WALL_DOWN, 2);
	}
}

//manage the wall print
void	manage_wall(int x, int y) {

	int	tile_s = gSdl.getMapTileSize() * 2;

	if (check_border(x, y)) {
		manage_border(x, y);
		return ;
	}
}

//map printer
void	print_map(Player &player)
{

	int	tile_s = gSdl.getMapTileSize() * 2;
	gSdl.room = player.getRoom();
	int h = gSdl.room.getRoomPlan().size();

	for (int y = 0; y < h; y++)
	{
		int w = gSdl.room.getRoomPlan()[y].size();
		for (int x = 0; x < w; x++)
		{
			char c = gSdl.room.getRoomPlan()[y][x];
			if (c == '1')
				manage_wall(x, y);
			else if (c == '0')
				Assets::rendMap(x * tile_s, y * tile_s, Assets::FLOOR, 2);
			else if (c == 'E')
				Assets::rendMap(x * tile_s, y * tile_s, Assets::DOOR_FRONT, 2);
		}
	}
}