#include "Game.hpp"

void	print_others(Player &player, std::vector<Player> &otherPlayers) {

	if (otherPlayers.size())
	{
		int	tile_s = gSdl.getMapTileSize() * 2;
		float	playerScreenX;
		float	playerScreenY;
		Camera	&camera = player.getCamera();
		for (Player &op : otherPlayers)
		{
			playerScreenX = (op.getX() - camera.getCamX()) * tile_s;
			playerScreenY = (op.getY() - camera.getCamY()) * tile_s;
			op.printPlayer(playerScreenX, playerScreenY);
		}
	}
}