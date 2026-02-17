#include "Game.hpp"

void	updateRoomState(Game &game, val msg)
{
	if (msg["room_event"].as<std::string>() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*game.getPlayer().getRoomRef().getRoomEvent());
		if (rush.isCleared() == false && msg["cleared"].as<std::string>() == "true")
			rush.setCleared(true);
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
		if (msg.hasOwnProperty(std::string("mobs").c_str()))
		{
			int nbr_mob = msg["nbr_mob"].as<int>();
			val mob = msg["mobs"];
			for (int i = 0; i < nbr_mob; i++)
			{
				val monster = mob[i];
				if (!monster.hasOwnProperty(std::string("deathsended").c_str()))
				{
					//gather all mob information from the message
					int id = monster["mob_id"].as<int>();
					float x = monster["mob_x"].as<float>();
					float y = monster["mob_y"].as<float>();

					if (monster["damaged"].as<int>() == 1)
						mobs[id]->damaged(true);
					if (monster["isdead"].as<int>() == 1)
						mobs[id]->setIsDead(true);
					mobs[id]->setPos(x, y);
				}
				else
				{
					int id = monster["mob_id"].as<int>();
					mobs[id]->setIsDead(true);
				}
			}
		}
	}
}

void	changeRoom(Game &game, val playerLeave)
{
	std::string uid = playerLeave["player_uid"].as<std::string>();

	Player &player = game.getPlayer();
	if (player.getUid() == uid)
		updateRoom(game, player, playerLeave["player_exit"].as<std::string>());
	else
		game.suppOtherPlayer(uid);
}