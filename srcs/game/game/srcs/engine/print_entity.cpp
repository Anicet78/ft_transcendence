#include "heads.hpp"

void	print_player(float px, float py) {

	static int	frame = 0;
	static int	prev_state = PLAYER_IDLE;
	int			tile_s = gSdl.getMapTileSize() * 2;

	const float x = px - (0.5f * tile_s);
	const float y = py - (0.5f * tile_s);
	PlayerAssets::updateLastDir();
	if (frame >= 24)
		frame = 0;

	if (gSdl.key.attacking() == true)
	{
		if (prev_state != PLAYER_ATTACKING)
			frame = 0;
		prev_state = PLAYER_ATTACKING;
		PlayerAssets::rendPlayerAttack(0, x, y, frame / 4, 2);
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

void	print_mob(std::map<int, std::unique_ptr<Mob>> &mobs, float camX, float camY, int tile_size, Player &player) {
	static int	frame = 0;

	if (frame >= 24)
		frame = 0;
	for (auto &i : mobs)
	{
		Mob	&mob = *i.second;
		float x = ((mob.getX() - camX) * tile_size) - (0.5f * tile_size);
		float y = ((mob.getY() - camY) * tile_size) - (0.5f * tile_size);
		mob.updateScreenPos(camX, camY, tile_size);
		mob.getBox().updateHitBox();
		mob.rendMobIdle(x, y, frame / 4, 2);
		if (mob.getBox().isDmgHit(player.getBox().getAtkHitBox()) && gSdl.key.attacking())
			std::cout << "-------------------Mob #" << i.first << std::endl << "hit" << std::endl;
		mob.getBox().printHitBox();
	}
	frame++;
}

void	print_event(std::shared_ptr<ARoomEvent> event, float camX, float camY, int tile_size, Player &player)
{
	std::string	const &type = event->getType();
	if (event && type == "MobRush")
	{
		MobRush	&rush = dynamic_cast<MobRush &>(*event);
		print_mob(rush.getMobs(), camX, camY, tile_size, player);
	}
}