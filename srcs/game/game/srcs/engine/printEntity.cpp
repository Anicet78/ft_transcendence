#include "heads.hpp"

void	print_player(float px, float py, Player &player) {

	static int	frame = 0;
	static int	prev_state = PLAYER_IDLE;
	int			tile_s = gSdl.getMapTileSize() * 2;

	const float x = px - (0.5f * tile_s);
	const float y = py - (0.5f * tile_s);
	// PlayerAssets::updateLastDir();
	if (frame >= 24)
		frame = 0;

	if (player.checkAtkState() == false)
		PlayerAssets::updateLastDir();

	if (player.checkAtkState() == true)
	{
		if (prev_state != PLAYER_ATTACKING)
			frame = 0;
		prev_state = PLAYER_ATTACKING;
		PlayerAssets::rendPlayerAttack(0, x, y, frame / 4, 2);
		if (frame == 23)
			player.endAtk();
	}
	else if (gSdl.key.walking() == true)
	{
		if (prev_state != PLAYER_WALKING)
			frame = 0;
		prev_state = PLAYER_WALKING;
		PlayerAssets::rendPlayerWalk(0, x, y, frame / 4, 2);
	}
	else
	{
		if (prev_state != PLAYER_IDLE)
			frame = 0;
		prev_state = PLAYER_IDLE;
		PlayerAssets::rendPlayerIdle(0, x, y, frame / 4, 2);
	}

	frame++;
}

void	update_mob(Mob &mob, float camX, float camY, int tile_size) {

	mob.updateScreenPos(camX, camY, tile_size);
	mob.getBox().updateHitBox();		
	mob.printMob(camX, camY, tile_size);
	// mob.getBox().printHitBox();
}

int		mob_interaction(Mob &mob, int mobId, Player &player) {
	if (mob.checkInvinsibleFrame() == true && mob.getFrame() == 23)
	{
		std::cout << "eheh" << std::endl;
		mob.endInvinsibleFrame();
	}
	if (player.checkAtkState() == true && mob.checkInvinsibleFrame() == false && mob.getBox().isDmgHit(player.getBox().getAtkHitBox()))
	{
		std::cout << "-------------------Mob #" << mobId << std::endl << "hit" << std::endl;
		mob.setHp(mob.getHp() - 1);
		mob.startInvinsibleFrame();
		
	}
	if (mob.getHp() <= 0)
		return (1);
	return (0);
}

void	room_event(std::shared_ptr<ARoomEvent> event, float camX, float camY, int tile_size, Player &player)
{
	std::string	const &type = event->getType();
	if (event && type == "MobRush")
	{
		MobRush	&rush = dynamic_cast<MobRush &>(*event);
		std::map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
		rush.checkCleared();
		if (mobs.size() > 0)
		{
			for (auto it = mobs.begin(); it != mobs.end();)
			{
				int flag = mob_interaction(*it->second, it->first, player);

				if (!flag)
					update_mob(*it->second, camX, camY, tile_size);
					
				if (flag)
					it = mobs.erase(it);
				else
					it++;
			}
		}
	}
}