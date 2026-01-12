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

//manage the tile print on the border
void	manage_border(float x, float y, float rx, float ry)
{
	// check for top left wall corner
	if (check_tile(rx + 1, ry + 1) && !check_tile(rx, ry + 1) && !check_tile(rx + 1, ry)) {
		Assets::rendMap(x, y, Assets::WALL_UP_LEFT_CORNER, 2);
	}

	// check for top right wall corner
	else if (check_tile(rx - 1, ry + 1) && !check_tile(rx, ry + 1) && !check_tile(rx - 1, ry)) {
		Assets::rendMap(x, y, Assets::WALL_UP_RIGHT_CORNER, 2);
	}

	//check for down left wall corner 
	else if (check_tile(rx + 1, ry - 1) && !check_tile(rx, ry - 1) && !check_tile(rx + 1, ry)) {
		Assets::rendMap(x, y, Assets::WALL_DOWN_LEFT_CORNER, 2);
	}

	//check for down right wall corner
	else if (check_tile(rx - 1, ry - 1) && !check_tile(rx, ry - 1) && !check_tile(rx - 1, ry)) { 
		Assets::rendMap(x, y, Assets::WALL_DOWN_RIGHT_CORNER, 2);
	}

	// check if the wall is on the left
	else if (check_tile(rx + 1, ry)) {
		Assets::rendMap(x, y, Assets::WALL_LEFT, 2);
	}

	//check if the wall is on the right
	else if (check_tile(rx - 1, ry)) {
		Assets::rendMap(x, y, Assets::WALL_RIGHT, 2);
	}

	//check if the wall is on the top
	else if (check_tile(rx, ry + 1)) {
		Assets::rendMap(x, y, Assets::WALL, 2);
	}

	//check if the wall is on the bottom
	else if (check_tile(rx, ry - 1)) {
		Assets::rendMap(x, y, Assets::WALL_DOWN, 2);
	}
}

//manage the wall print
void	manage_wall(float x, float y, float rx, float ry)
{

	// int	tile_s = gSdl.getMapTileSize() * 2;

	if (check_border(rx, ry)) {
		manage_border(x, y, rx, ry);
		return ;
	}
}


void	PlayerAssets::print_map(Player &player)
{

	float tile_s = gSdl.getMapTileSize() * 2;
    int mapMaxTile = 800 / tile_s;
    gSdl.room = player.getRoom();
    float h = gSdl.room.getRoomPlan().size();
    float w = gSdl.room.getRoomPlan()[0].size();
    
    float playerX = player.getX();
    float playerY = player.getY();
    int numTilesY = mapMaxTile;
	int numTilesX = mapMaxTile;
    float idealMinX = playerX - 12;
    float idealMaxX = playerX + 13;
    float idealMinY = playerY - 12;
    float idealMaxY = playerY + 13;
    
    float minX = idealMinX;
    float maxX = idealMaxX;
    float minY = idealMinY;
    float maxY = idealMaxY;
    
    if (idealMinX < 0)
	{
        minX = 0;
        maxX = std::min(25.0f, w);
    }
	else if (idealMaxX > w)
	{
        maxX = w;
        minX = std::max(0.0f, w - 25);
    }
    
    if (idealMinY < 0)
	{
        minY = 0;
        maxY = std::min(25.0f, h);
    }
	else if (idealMaxY > h)
	{
        maxY = h;
        minY = std::max(0.0f, h - 25);
    }	
    
    float playerScreenX = (playerX - minX) * tile_s;
    float playerScreenY = (playerY - minY) * tile_s;
    
    float scrollMinX = (int)minX;
    float scrollMinY = (int)minY;
    float offsetX = (minX - scrollMinX) * tile_s;
    float offsetY = (minY - scrollMinY) * tile_s;
	if (offsetX > 0.01f)
		numTilesX++;
	if (offsetY > 0.01f)
		numTilesY++;
	if (mapRenderTexture == nullptr || lastRenderWidth != 800
		|| lastRenderHeight != 800)
	{
        
        if (mapRenderTexture != nullptr)
            SDL_DestroyTexture(mapRenderTexture);
            
        mapRenderTexture = SDL_CreateTexture(
            gSdl.renderer,
            SDL_PIXELFORMAT_RGBA8888,
            SDL_TEXTUREACCESS_TARGET,
            800,
            800
        );
        SDL_SetTextureBlendMode(mapRenderTexture, SDL_BLENDMODE_BLEND);
        
        lastRenderWidth = 800;
        lastRenderHeight = 800;
    }
    
    // Définir la texture comme target de rendu
    SDL_SetRenderTarget(gSdl.renderer, mapRenderTexture);
    
    // Effacer la texture
    SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 0);
    SDL_RenderClear(gSdl.renderer);

	for (int ty = 0; ty < numTilesY && (scrollMinY + ty) < maxY; ty++)
    {
        int ry = scrollMinY + ty;
        if (ry < 0 || ry >= h)
			continue;
        
        for (int tx = 0; tx < numTilesX && (scrollMinX + tx) < maxX; tx++)
        {
            int rx = scrollMinX + tx;
            if (rx < 0 || rx >= w)
				continue;
            
            char c = gSdl.room.getRoomPlan()[ry][rx];
            
            float renderX = tx * tile_s - offsetX;
            float renderY = ty * tile_s - offsetY;
            
            if (c == '1')
                manage_wall(renderX, renderY, rx, ry);
            else if (c == '0')
                Assets::rendMap(renderX, renderY, Assets::FLOOR, 2);
            else if (c == 'E')
                Assets::rendMap(renderX, renderY, Assets::DOOR_FRONT, 2);
        }
    }
    
    //PlayerAssets::rendPlayerWalk(0, playerScreenX - 0.5 * tile_s, playerScreenY - 0.5 * tile_s, 0, 2);
	print_player(playerScreenX, playerScreenY);
	SDL_SetRenderTarget(gSdl.renderer, nullptr);
    
    SDL_RenderCopy(gSdl.renderer, mapRenderTexture, nullptr, nullptr);
}