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
			std::string leaved = pStatus["player_leave"].as<std::string>();
			if (leaved == "true")
				game.suppOtherPlayer(uid);
			else
			{
				Player &player = game.getOtherPlayer(uid);
				setPlayerState(game, player, pStatus, 0);
			}
		}
		else
		{
			std::string leaved = pStatus["player_leave"].as<std::string>();
			if (leaved == "false")
			{
				std::string name = pStatus["player_name"].as<std::string>();
				Player &player = game.getOtherPlayers().emplace_back(uid, name);
				setPlayerState(game, player, pStatus, 0);
			}
		}
	}
}

// void	loopRoomState(Game &game, val msg)
// {

// }