# include "Server.hpp"

void updatePlayer(Player &player, std::map<std::string, std::string> &req)
{
    player.move(req);
    player.updateAnim(req["anim"]);
    int anim = player.getAnim();
    if (anim == 0)
    {
        if (player.getIsAttacking() == true)
            player.endAttacking();
    }
    else if (anim == 1)
    {
        if (player.getIsAttacking() == true)
            player.endAttacking();
    }
    else if (anim == 2)
    {
		player.attack();
    }
}

void	sendLeaveUpdate(Player &player, uWS::App &app, std::string &topic)
{
	std::string roomUpdate = "{\"action\": \"room_change\", \"player_leave\": {";
	roomUpdate += "\"player_uid\":\"" + player.getUid() + '\"';
	roomUpdate += ",\"player_exit\":\"";
	roomUpdate.push_back(player.getExit());
	roomUpdate += "\"}}";

	app.publish(topic, roomUpdate, uWS::OpCode::TEXT);
}

void updateRoom(Player &player, uWS::App &app)
{
    Room room = player.getRoom();
	auto plan = room.getRoomPlan();
	float x = player.getX(), y = player.getY();

	if (plan[y][x] == 'E')
	{
		if (room.getRoomEvent().get() && room.getRoomEvent()->isCleared() == false)
		{
			if (player.getExit() > 32)
				player.setExit(' ');
			return ;
		}
		auto exitsLoc = room.getExitsLoc();

		std::string	oldTopic = room.getRoomId();
 
		if (exitsLoc[2][0] == static_cast<int>(x) && exitsLoc[2][1] == static_cast<int>(y)
			&& !player.getNode()->south.expired())
		{
            player.setExit('S');
            player.setPrevNode(player.getNode());
			player.setNode(player.getNode()->south.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[0][0] + 0.5, exitsLoc[0][1] + 1);
		}
		else if (exitsLoc[0][0] == static_cast<int>(x) && exitsLoc[0][1] == static_cast<int>(y)
			&& !player.getNode()->north.expired())
		{
            player.setExit('N');
            player.setPrevNode(player.getNode());
			player.setNode(player.getNode()->north.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[2][0] + 0.5, exitsLoc[2][1] - 0.1);
		}
		else if (exitsLoc[1][0] == static_cast<int>(x) && exitsLoc[1][1] == static_cast<int>(y)
			&& !player.getNode()->east.expired())
		{
            player.setExit('E');
            player.setPrevNode(player.getNode());
			player.setNode(player.getNode()->east.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[3][0] + 1, exitsLoc[3][1] + 0.5);
		}
		else if (exitsLoc[3][0] == static_cast<int>(x) && exitsLoc[3][1] == static_cast<int>(y)
			&& !player.getNode()->west.expired())
		{
            player.setExit('W');
            player.setPrevNode(player.getNode());
			player.setNode(player.getNode()->west.lock());
			exitsLoc = player.getRoom().getExitsLoc();
			player.setPos(exitsLoc[1][0] - 0.1, exitsLoc[1][1] + 0.5);
		}
		sendLeaveUpdate(player, app, oldTopic);
		player.getWs()->unsubscribe(oldTopic);
		player.getWs()->subscribe(player.getRoom().getRoomId());
	}
	else if (plan[y][x] == 'S')
	{
		if (player.getNode()->up.expired())
			return ;
		std::string oldTopic = player.getRoomRef().getRoomId();
		player.setExit('U');
		player.setPrevNode(player.getNode());
		player.setNode(player.getNode()->up.lock());
		player.findP();
		sendLeaveUpdate(player, app, oldTopic);
		if (player.getWs()->unsubscribe(oldTopic))
			std::cout << "unsubscribe from " << oldTopic << std::endl;
		if (player.getWs()->subscribe(player.getRoomRef().getRoomId()))
			std::cout << "subscribed to " << player.getRoomRef().getRoomId() << std::endl;
	}
    else if (player.getExit() > 32)
    {
        player.setExit(' ');
    }
}

float	abs_dist(Player const &player, Mob const &mob)
{
	return (std::fabs(player.getX() - mob.getX()) + std::fabs(player.getY() - mob.getY()));
}

static void    mobInteraction(MobRush &rush, int id, Mob &mob, Player &player)
{
    if (mob.checkInvinsibleFrame() == true)
    {
        int invFrame = mob.getInvFrame();
        if (invFrame >= 23)
        {
            mob.setInvFrame(0);
            mob.endInvinsibleFrame();
        }
        else
            mob.setInvFrame(invFrame + 1);
    }
	else if (player.getIsAttacking() == true)
	{
		if (abs_dist(player, mob) <= 2)
		{
			HitBox	&box = mob.getBox();
			box.updateHurtBox();
			if (box.isDmgHit(player.getHitBox().getAtkHitBox()))
			{
				mob.damaged(true);
				mob.setHp(mob.getHp() - 1);
				if (mob.getHp() <= 0)
				{
					rush.makeDie(id);
					player.addKills();
					return ;
				}
				mob.startInvinsibleFrame();
			}
		}
	}
}

void	updateWorld(Player &player)
{
	Room &room = player.getRoomRef();
	std::shared_ptr<ARoomEvent> event = room.getRoomEvent();
	if (event && event->getType() == "MobRush")
	{
		MobRush &rush = dynamic_cast<MobRush &>(*event);
		std::unordered_map<int, std::unique_ptr<Mob>> &mobs = rush.getMobs();
		rush.checkCleared();
		if (rush.isCleared() == false)
		{
			for (auto it = mobs.begin(); it != mobs.end(); ++it)
			{
				mobInteraction(rush, it->first, *it->second, player);
			}
		}
	}
}