# include "Map.hpp"

static int checkRoomBorders(quadList const &place, Room const &room)
{
	int valid = room.getExits()[0] + room.getExits()[1]
			  + room.getExits()[2] + room.getExits()[3];

	if (place->north.expired() && room.getExits()[0])
		valid--;
	if (place->east.expired() && room.getExits()[1])
		valid--;
	if (place->south.expired() && room.getExits()[2])
		valid--;
	if (place->west.expired() && room.getExits()[3])
		valid--;

	if (!place->north.expired() && !room.getExits()[0]
			&& place->north.lock()->getRoom() && place->north.lock()->getRoom()->getExits()[2])
		valid = -1;
	if (!place->east.expired() && !room.getExits()[1]
			&& place->east.lock()->getRoom() && place->east.lock()->getRoom()->getExits()[3])
		valid = -1;
	if (!place->south.expired() && !room.getExits()[2]
			&& place->south.lock()->getRoom() && place->south.lock()->getRoom()->getExits()[0])
		valid = -1;
	if (!place->west.expired() && !room.getExits()[3]
			&& place->west.lock()->getRoom() && place->west.lock()->getRoom()->getExits()[1])
		valid = -1;

	return valid > 0;
}

quadList Map::chooseRoom(std::string mapName)
{
	auto F0 = Room::getFloor0();
	Room temp;
	int x = rand() % this->_width;
	int y = rand() % this->_height;
	while (this->_nodes[y * _width + x]->getRoom())
	{
		x = rand() % this->_width;
		y = rand() % this->_height;
	}
	
	quadList tmp = this->_nodes[y * _width + x];
	temp = *F0[mapName].get();
	temp.randomizeRoom();
	while (!checkRoomBorders(tmp, temp))
	{
		temp = *F0[mapName].get();
		temp.randomizeRoom();
	}
	tmp->addRoom(temp);
	return tmp;
}

static void chooseCandidates(quadList &node, std::vector<quadList> &candidates)
{
	if (node->north.expired() == false)
	{
		auto next = node->north.lock();
		if (next && !next->getPath())
			candidates.push_back(next);
	}
	if (node->east.expired() == false)
	{
		auto next = node->east.lock();
		if (next && !next->getPath())
			candidates.push_back(next);
	}
	if (node->south.expired() == false)
	{
		auto next = node->south.lock();
		if (next && !next->getPath())
			candidates.push_back(next);
	}
	if (node->west.expired() == false)
	{
		auto next = node->west.lock();
		if (next && !next->getPath())
			candidates.push_back(next);
	}
}

static void chooseDirections(quadList &node, std::array<bool, 4> &directions)
{
	if (node.get()->north.expired() == false)
	{
		quadList next = node.get()->north.lock();
		if (next && next->getPath() > 0 && node->getPath() != 3)
			directions[0] = 1;
		else if (next && next->getPath() == 3 && node->getPath() == 3)
			directions[0] = 1;
	}
	if (node.get()->east.expired() == false)
	{
		quadList next = node.get()->east.lock();
		if (next && next->getPath() && node->getPath() != 3)
			directions[1] = 1;
		else if (next && next->getPath() == 3 && node->getPath() == 3)
			directions[1] = 1;
	}
	if (node.get()->south.expired() == false)
	{
		quadList next = node.get()->south.lock();
		if (next && next->getPath() && node->getPath() != 3)
			directions[2] = 1;
		else if (next && next->getPath() == 3 && node->getPath() == 3)
			directions[2] = 1;
	}
	if (node.get()->west.expired() == false)
	{
		quadList next = node.get()->west.lock();
		if (next && next->getPath() && node->getPath() != 3)
			directions[3] = 1;
		else if (next && next->getPath() == 3 && node->getPath() == 3)
			directions[3] = 1;
	}
}

bool neighborExists(quadList node, int dir)
{
    switch (dir) {
        case 0: return !node->north.expired();
        case 1: return !node->east.expired();
        case 2: return !node->south.expired();
        case 3: return !node->west.expired();
    }
    return false;
}


static void selectRoom(quadList &node, std::vector<Room> &candidates, std::array<bool, 4> &directions)
{
	int sum = directions[0] + directions[1] + directions[2] + directions[3];
	for (auto &room : Room::getFloor0())
	{
		if (room.first == "start" || room.first == "stairs")
			continue ;
		Room temp = *room.second.get();
		int j;
		for (j = 0; j < 4; j++)
		{
			int i, flag = 0;
			for (i = 0; i < 4; i++)
			{
				bool roomExit = temp.getExits()[i];
				bool required = directions[i];

				// Required exit missing → reject
				if (sum != 4 && required && !roomExit)
				{
					flag = 1;
					break;
				}
				else if (sum == 4 && required && !roomExit)
				{
					if ((i == 0 && node->north.lock()->getRoom())
						|| (i == 1 && node->east.lock()->getRoom())
						|| (i == 2 && node->south.lock()->getRoom())
						|| (i == 3 && node->west.lock()->getRoom()))
					{
						flag = 1;
						break ;
					}
				}

				//Room has an exit but neighbor is invalid → reject
				if (!required && roomExit && !neighborExists(node, i))
				{
					flag = 1;
					break;
				}
			}

			if (flag)
				temp.turnMapLeft();
			else
				break ;
		}
		if (j < 4)
			candidates.push_back(temp);
	}
}

static void selectAndAddRoom(quadList &node)
{
	if (!node->getRoom())
	{
		std::vector<Room> candidates;
		std::array<bool, 4> directions = {0, 0, 0, 0};

		chooseDirections(node, directions);

		selectRoom(node, candidates, directions);

		if (candidates.empty())
			throw std::runtime_error("No candidate found for the path made\n");
		int r = rand() % candidates.size();
		node->addRoom(candidates[r]);
	}
}

int Map::checkObs(quadList &node)
{
	int x = node->getX();
	int y = node->getY();
	for (int i = y - 1; i <= y + 1; i++)
	{
		if (i < 0 || i >= _height)
			return 0;
		for (int j = x - 1; j <= x + 1; j++)
		{
			if (j < 0 || j >= _width)
				return 0;
			if (_nodes[i * _width + j]->getRoom()
				|| _nodes[i * _width + j]->getPath() != 1)
				return 0;
		}
	}

	return 1;
}

void Map::preparePathMap()
{
	quadList tmp = this->chooseRoom("stairs");
	quadList tmp2 = this->chooseRoom("start");

	quadList travel = tmp;
	travel->setPath(1);

	std::vector<quadList> crossroad;
	while (travel != tmp2)
	{
		std::vector<quadList> neighbors;
	
		chooseCandidates(travel, neighbors);

		if (neighbors.empty())
		{
			if (crossroad.size())
			{
				travel = crossroad[crossroad.size() - 1];
				crossroad.pop_back();
				continue ;
			}
			else
				break ;
		}
		if (neighbors.size() > 1)
			crossroad.push_back(travel);
		int r = rand() % neighbors.size();
		travel = neighbors[r];
		travel->setPath(1);
	}
	tmp2->setPath(1);

	for (auto &node : this->_nodes)
		if (this->checkObs(node))
			node->setPath(2);

	auto path = Map::astar(tmp, tmp2);

	for (auto &node : path)
		node->setPath(3);
}

void Map::fillPrimaryPath()
{
	for (auto &node : this->_nodes)
	{
		if (node->getPath() != 3)
			continue ;
		selectAndAddRoom(node);
		if (!node->north.expired() && !node->north.lock()->getPath())
			node->north.lock()->setPath(1);
		if (!node->east.expired() && !node->east.lock()->getPath())
			node->east.lock()->setPath(1);
		if (!node->south.expired() && !node->south.lock()->getPath())
			node->south.lock()->setPath(1);
		if (!node->west.expired() && !node->west.lock()->getPath())
			node->west.lock()->setPath(1);
	}
}

void Map::fillOtherRooms()
{
	int count = 1;
	while (count)
	{
		count = 0;
		for (auto &node : this->_nodes)
		{
			if (node->getPath() != 1 && node->getPath() != 2)
				continue ;
			selectAndAddRoom(node);
			if (!node->north.expired() && !node->north.lock()->getPath())
			{
				quadList next = node->north.lock();
				selectAndAddRoom(next);
				next->setPath(1);
				count++;
			}
			if (!node->east.expired() && !node->east.lock()->getPath())
			{
				quadList next = node->east.lock();
				selectAndAddRoom(next);
				next->setPath(1);
				count++;
			}
			if (!node->south.expired() && !node->south.lock()->getPath())
			{
				quadList next = node->south.lock();
				selectAndAddRoom(next);
				next->setPath(1);
				count++;
			}
			if (!node->west.expired() && !node->west.lock()->getPath())
			{
				quadList next = node->west.lock();
				selectAndAddRoom(next);
				next->setPath(1);
				count++;
			}
		}
	}
}
void Map::fillMap(void)
{
	this->preparePathMap();

	this->fillPrimaryPath();

	this->fillOtherRooms();
}