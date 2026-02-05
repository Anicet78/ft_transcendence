#include "Game.hpp"

void	setPlayerState(Game &game, Player &player, val &pStatus, const int flag)
{
	float x = pStatus["player_x"].as<float>();
	float y = pStatus["player_y"].as<float>();
	int hp = pStatus["player_health"].as<int>();
	int	anim = pStatus["player_anim"].as<int>();

	player.setPos(x, y);
	player.setHp(hp);
	player.setAnim(anim);

	if (flag == 1)
	{
		std::string exit_door = pStatus["player_exit"].as<std::string>();
		if (exit_door != " ")
			updateRoom(game, player, exit_door);
	}
}
//----------------------------------------

// FAUT GERER LE LEAVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE

//----------------------------------------
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
			setPlayerState(game, player, pStatus, 1);
		}
		else if (game.isInOtherPlayers(uid))
		{
			// std::string leaved = pStatus["player_leave"].as<std::string>();
			// if (leaved == "true")
			// 	game.suppOtherPlayer(uid);
			// else
			// {
				Player &player = game.getOtherPlayer(uid);
				setPlayerState(game, player, pStatus, 0);
			// }
		}
		else
		{
			std::string leaved = pStatus["player_leave"].as<std::string>();
			if (leaved == "false")
			{
				std::string name = pStatus["player_name"].as<std::string>();
				Player player = Player(uid, name);
				game.addOtherPlayer(player);
				setPlayerState(game, player, pStatus, 0);
			}
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
					// const int damaged = mob["damaged"].as<int>();
					// const int isdead = mob["isdead"].as<int>();

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