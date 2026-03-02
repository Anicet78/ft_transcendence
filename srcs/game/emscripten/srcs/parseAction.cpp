#include "Game.hpp"

void	respawnPlayer(Player &player, Game &game)
{
	game.clearOtherPlayers();
	player.setNode(player.getStartNode());
	std::vector<std::string> plan = player.getRoom().getRoomPlan();
	for (size_t i = 0; i < plan.size(); i++)
	{
		size_t j = plan[i].find('P');
		if (j != plan[i].npos)
		{
			player.setPos(j, i);
			break;
		}
	}
}

void	setPlayerState(Player &player, Game &game, val &pStatus, int flag)
{
	float x = pStatus["player_x"].as<float>();
	float y = pStatus["player_y"].as<float>();
	int hp = pStatus["player_health"].as<int>();
	int	anim = pStatus["player_anim"].as<int>();
	int kills = pStatus["player_kills"].as<int>();

	player.setHp(hp);
	player.setAnim(anim);
	player.setKills(kills);
	if (flag == 1)
	{
		int dir = pStatus["player_dir"].as<int>();
		player.setDir(dir);
		player.setTargetPos(x, y);
		player.setTimer(0);
	}
	else if (flag == 2)
	{
		int dir = pStatus["player_dir"].as<int>();
		player.setDir(dir);
		player.setPos(x, y);
		player.setTargetPos(x, y);
	}
	else
	{
		bool died = pStatus["player_died"].as<bool>();
		if (died == true)
			respawnPlayer(player, game);

		float pX = player.getX();
		float pY = player.getY();
		float dist = SDL_sqrtf(SDL_powf(x - pX, 2) + SDL_powf(y - pY, 2));
		if (dist > 1.0f)
			player.setPos(x, y);
		else
			player.setPos(pX + (x - pX) * 0.1f, pY + (y - pY) * 0.1f);
	}
}

void	clearLeavedUid(std::vector<std::string> &uidInRoom, Game &game)
{
	auto &otherPlayers = game.getOtherPlayers();
	std::vector<std::string> beDelete;
	for (auto &player : otherPlayers)
	{
		bool toDelete = true;
		const std::string &uid = player.getUid();
		for (auto &uidRoom : uidInRoom)
		{
			if (uid == uidRoom)
			{
				toDelete = false;
				break;
			}
		}
		if (toDelete)
			beDelete.push_back(uid);
	}
	for (auto &del : beDelete)
	{
		game.suppOtherPlayer(del);
	}
}

void	loopPlayerState(Game &game, val playerUpdate)
{
	const int nbrPlayer = playerUpdate["player_num"].as<int>();
	auto &otherPlayers = game.getOtherPlayers();

	// this only serve when game page goes from back to front
	std::vector<std::string> uidInRoom;
	bool	diff = (nbrPlayer - 1 < (int)otherPlayers.size()) ? true : false;
	//-------------------------------------------------------

	val playerStatus = playerUpdate["player_status"];
	for (int i = 0; i < nbrPlayer; i++)
	{
		val pStatus = playerStatus[i];
		std::string uid = pStatus["player_uid"].as<std::string>();

		if (diff)
			uidInRoom.push_back(uid);

		if (game.getPlayer().getUid() == uid)
		{
			Player &player = game.getPlayer();
			setPlayerState(player, game, pStatus, 0);
		}
		else if (game.isInOtherPlayers(uid))
		{
			Player &player = game.getOtherPlayer(uid);
			setPlayerState(player, game, pStatus, 1);
		}
		else
		{
			std::string name = pStatus["player_name"].as<std::string>();
			game.addOtherPlayer(uid, name);
			setPlayerState(otherPlayers.back(), game, pStatus, 2);
		}
	}
	
	if (!uidInRoom.empty())
		clearLeavedUid(uidInRoom, game);
}

void	loopRoomState(Game &game, val roomUpdate)
{
	if (roomUpdate["room_event"].as<std::string>() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*game.getPlayer().getRoomRef().getRoomEvent());
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
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
				mobs[id]->updateLastDir(monster["last_dir"].as<int>());
				mobs[id]->setAnim(monster["mob_anim"].as<int>());
				// if (monster["damaged"].as<int>() == 1)
				// 	mobs[id]->damaged(true);
				
				if (monster["isdead"].as<int>() == 1)
				{
					if (mobs[id]->isDead() == false)
						mobs[id]->setInDeathAnim(true);
					mobs[id]->setIsDead(true);
				}
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