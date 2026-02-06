#include "Game.hpp"

void	setPlayerState(Player &player, val &pStatus, int flag)
{
	float x = pStatus["player_x"].as<float>();
	float y = pStatus["player_y"].as<float>();
	int hp = pStatus["player_health"].as<int>();
	int	anim = pStatus["player_anim"].as<int>();

	if (flag == 1)
	{
		int dir = pStatus["player_dir"].as<int>();
		player.setDir(dir);
	}

	player.setPos(x, y);
	player.setHp(hp);
	player.setAnim(anim);
}

void	loopPlayerState(Game &game, val playerUpdate)
{
	const int nbrPlayer = playerUpdate["player_num"].as<int>();

	val playerStatus = playerUpdate["player_status"];
	for (int i = 0; i < nbrPlayer; i++)
	{
		val pStatus = playerStatus[i];
		std::string uid = pStatus["player_uid"].as<std::string>();

		if (game.getPlayer().getUid() == uid)
		{
			Player &player = game.getPlayer();
			setPlayerState(player, pStatus, 0);
		}
		else if (game.isInOtherPlayers(uid))
		{
			Player &player = game.getOtherPlayer(uid);
			setPlayerState(player, pStatus, 1);
		}
		else
		{
			std::string name = pStatus["player_name"].as<std::string>();
			Player player = Player(uid, name);
			game.addOtherPlayer(player);
			setPlayerState(player, pStatus, 1);
		}
	}
}

void	loopRoomState(Game &game, val roomUpdate)
{
	if (roomUpdate["room_event"].as<std::string>() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*game.getPlayer().getRoomRef().getRoomEvent());
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
		if (roomUpdate["cleared"].as<std::string>() == "false")
		{
			int nbrMob = roomUpdate["nbr_mob"].as<int>();
			val horde = roomUpdate["mobs"];
			for (int i = 0; i < nbrMob; i++)
			{
				val monster = horde[i];

				int id = monster["mob_id"].as<int>();

				if (!monster.hasOwnProperty(std::string("deathsended").c_str()))
				{
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
					if (mobs[id]->isDead() != true)
						mobs[id]->setIsDead(true);
				}
			}
		}
	}
}