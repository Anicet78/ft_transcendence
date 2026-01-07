#include "Map.hpp"

//CHAINED-MAP------------------------------------------------------------------


//Constructors/Destructors------------------------------------------------


chainedMap::chainedMap(void): _path(0)
{}

chainedMap::~chainedMap(void)
{}

//Member Functions--------------------------------------------------------

void chainedMap::addRoom(const Room &room)
{
	this->_room = std::make_shared<Room>(room);

	auto exits = this->_room->getExits();

	if (!exits[0] && !this->north.expired())
	{
		auto tmp = this->north.lock();
		tmp->south.reset();
		this->north.reset();
	}
	if (!exits[1] && !this->east.expired())
	{
		auto tmp = this->east.lock();
		tmp->west.reset();
		this->east.reset();
	}
	if (!exits[2] && !this->south.expired())
	{
		auto tmp = this->south.lock();
		tmp->north.reset();
		this->south.reset();
	}
	if (!exits[3] && !this->west.expired())
	{
		auto tmp = this->west.lock();
		tmp->east.reset();
		this->west.reset();
	}
}

std::shared_ptr<Room> chainedMap::getRoom(void) const
{
	return this->_room;
}

void	chainedMap::setPath(int flag)
{
	this->_path = flag;
}

int chainedMap::getPath() const
{
	return this->_path;
}

//MAP--------------------------------------------------------------------------

//Constructors/Destructors------------------------------------------------

Map::Map(void)
{
	for (int i = 0; i < 25; i++)
		_nodes.push_back(std::make_shared<chainedMap>());
	
	this->_head = _nodes[0];
	this->_height = 5;
	this->_width = 5;

	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{
			if (j != 0)
				_nodes[i * 5 + j]->west = _nodes[i * 5 + j - 1];
			if (j != 4)
				_nodes[i * 5 + j]->east = _nodes[i * 5 + j + 1];
			if (i != 0)
				_nodes[i * 5 + j]->north = _nodes[(i - 1) * 5 + j];
			if (i != 4)
				_nodes[i * 5 + j]->south = _nodes[(i + 1) * 5 + j];
		}
	}
}

Map::Map(int width, int height)
{
	for (int i = 0; i < width * height; i++)
		_nodes.push_back(std::make_shared<chainedMap>());
	
	this->_head = _nodes[0];
	this->_height = height;
	this->_width = width;

	for (int i = 0; i < height; i++)
	{
		for (int j = 0; j < width; j++)
		{
			if (j != 0)
				_nodes[i * width + j]->west = _nodes[i * width + j - 1];
			if (j != width - 1)
				_nodes[i * width + j]->east = _nodes[i * width + j + 1];
			if (i != 0)
				_nodes[i * width + j]->north = _nodes[(i - 1) * width + j];
			if (i != height - 1)
				_nodes[i * width + j]->south = _nodes[(i + 1) * width + j];
		}
	}
}

Map::~Map(void)
{}

//Member Functions--------------------------------------------------------

quadList &Map::getHead()
{
	return this->_head;
}

std::vector<quadList> Map::getNodes() const
{
	return this->_nodes;
}

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
		auto next = node.get()->north.lock();
		if (next && next->getPath())
			directions[0] = 1;
	}
	if (node.get()->east.expired() == false)
	{
		auto next = node.get()->east.lock();
		if (next && next->getPath())
			directions[1] = 1;
	}
	if (node.get()->south.expired() == false)
	{
		auto next = node.get()->south.lock();
		if (next && next->getPath())
			directions[2] = 1;
	}
	if (node.get()->west.expired() == false)
	{
		auto next = node.get()->west.lock();
		if (next && next->getPath())
			directions[3] = 1;
	}
}

static void selectRoom(std::vector<Room> &candidates, std::array<bool, 4> &directions)
{
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
				if (directions[i] && !temp.getExits()[i])
				{
					flag = 1;
					break ;
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

void Map::fillMap(void)
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
	{
		if (node->getPath() != 1)
			continue ;
		
		std::vector<Room> candidates;
		std::array<bool, 4> directions = {0, 0, 0, 0};
	
		if (!node->getRoom())
		{
			chooseDirections(node, directions);

			selectRoom(candidates, directions);

			if (candidates.empty())
				continue ;
			int r = rand() % candidates.size();
			node->addRoom(candidates[r]);
		}
		if (!node->north.expired() && !node->north.lock()->getPath())
			node->north.lock()->setPath(2);
		if (!node->east.expired() && !node->east.lock()->getPath())
			node->east.lock()->setPath(2);
		if (!node->south.expired() && !node->south.lock()->getPath())
			node->south.lock()->setPath(2);
		if (!node->west.expired() && !node->west.lock()->getPath())
			node->west.lock()->setPath(2);
	}

	for (auto &node : this->_nodes)
	{
		if (node->getPath() != 2)
			continue ;
		
		std::vector<Room> candidates;
		std::array<bool, 4> directions = {0, 0, 0, 0};
	
		if (!node->getRoom())
		{
			chooseDirections(node, directions);

			selectRoom(candidates, directions);

			if (candidates.empty())
				continue ;
			int r = rand() % candidates.size();
			node->addRoom(candidates[r]);
		}
		if (!node->north.expired() && !node->north.lock()->getPath())
			node->north.lock()->setPath(3);
		if (!node->east.expired() && !node->east.lock()->getPath())
			node->east.lock()->setPath(3);
		if (!node->south.expired() && !node->south.lock()->getPath())
			node->south.lock()->setPath(3);
		if (!node->west.expired() && !node->west.lock()->getPath())
			node->west.lock()->setPath(3);
	}
}