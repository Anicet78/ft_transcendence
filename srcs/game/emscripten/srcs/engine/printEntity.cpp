#include "Game.hpp"

void	print_others(Player &player, std::vector<Player> &otherPlayers, int flag)
{
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
			if (flag && isUnderTree(player.getRoomRef().getRoomPlan(), op.getX(),op.getY()))
				op.printPlayer(playerScreenX, playerScreenY, flag);
			else
				op.printPlayer(playerScreenX, playerScreenY, flag);
		}
	}
}

void print_mobs(MobRush &mobRush, Player &player, int flag)
{
	int		tile_s = gSdl.getMapTileSize() * 2;
	Camera	&cam = player.getCamera();
	for (auto &mob : mobRush.getMobs())
	{
		if (mob.second->isDead() == false)
		{
			if (mob.second->checkInvinsibleFrame() == true && mob.second->getFrame() >= 23)
				mob.second->endInvinsibleFrame();
			if (mob.second->isDamaged())
				mob.second->startInvinsibleFrame();
			if (flag && isUnderTree(player.getRoomRef().getRoomPlan(), mob.second->getX(), mob.second->getY()))
				mob.second->printMob(cam.getCamX(), cam.getCamY(), tile_s, flag);
			else
				mob.second->printMob(cam.getCamX(), cam.getCamY(), tile_s, flag);
		}
	}
}