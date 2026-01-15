#include "PlayerAssets.hpp"

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

void	manage_border(int x, int y)
{
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
void	manage_wall(int x, int y)
{
	if (check_border(x, y)) {
		manage_border(x, y);
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

// void	print_mob(std::map<int, Mob> &mobs, int camX, int camY, int tile_size) {
// 	static int	frame = 0;
	
// 	if (frame >= 24)
// 		frame = 0;
// 	for (auto i : mobs)
// 	{
// 		Mob	&mob = i.second;
// 		float x = ((mob.getX() - camX) * tile_size) - (0.5f * tile_size);
// 		float y = ((mob.getY() - camY) * tile_size) - (0.5f * tile_size);
// 		mob.rendMobIdle(x, y, frame / 4, 2);
// 	}
// 	frame++; 
// }

void	print_map(Player &player) {
	static int	mapX = -1;
	static int	mapY = -1;

	quadList	node = player.getNode();
	int	tile_s = gSdl.getMapTileSize() * 2;

	if (mapX != node->getX() || mapY != node->getY())
	{
		mapX = node->getX();
		mapY = node->getY();
		gSdl.room = player.getRoom();
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
					manage_wall(x, y);
				else if (c == '0' || c == 'M')
					Assets::rendMap(x * tile_s, y * tile_s, Assets::FLOOR, 2);
				else if (c == 'E')
					Assets::rendMap(x * tile_s, y * tile_s, Assets::DOOR_FRONT, 2);
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
	// print_mob(player.getRoom().getMobs(), camX, camY, tile_s);
	print_player(playerScreenX, playerScreenY);
}