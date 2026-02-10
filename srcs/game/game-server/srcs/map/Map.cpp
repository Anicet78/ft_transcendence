#include "Map.hpp"

//CHAINED-MAP------------------------------------------------------------------


//Constructors/Destructors------------------------------------------------


chainedMap::chainedMap(void): _path(0), _x(0), _y(0)
{}

chainedMap::~chainedMap(void)
{}

//Member Functions--------------------------------------------------------

void chainedMap::resetRoom()
{
	this->_room.reset();
}

void chainedMap::addRoom(const Room &room)
{
	if (this->_room)
		*this->_room = room;
	else
		this->_room = std::make_shared<Room>(room);

	this->_room->setRoomId(room.getName() + "_" + std::to_string(this->getX()) + std::to_string(this->getY()));
	this->_room->setEvent();

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

int chainedMap::getX() const
{
	return this->_x;
}

int chainedMap::getY() const
{
	return this->_y;
}

void chainedMap::setX(int nb)
{
	this->_x = nb;
}

void chainedMap::setY(int nb)
{
	this->_y = nb;
}

//MAP--------------------------------------------------------------------------

//Constructors/Destructors------------------------------------------------

Map::Map(void)
{
	for (int i = 0; i < 25; i++)
	{
		_nodes.push_back(std::make_shared<chainedMap>());
		_nodes[i]->setX(i % 5);
		_nodes[i]->setY(i / 5);
	}
	
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
	{
		_nodes.push_back(std::make_shared<chainedMap>());
		_nodes[i]->setX(i % width);
		_nodes[i]->setY(i / width);
	}
	
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

void	Map::reset()
{
	for (int i = 0; i < _height; i++)
	{
		for (int j = 0; j < _width; j++)
		{
			quadList node = this->_nodes[i * _width + j];
			node->resetRoom();
			node->setPath(0);
			if (j != 0)
				node->west = _nodes[i * _width + j - 1];
			if (j != _width - 1)
				node->east = _nodes[i * _width + j + 1];
			if (i != 0)
				node->north = _nodes[(i - 1) * _width + j];
			if (i != _height - 1)
				node->south = _nodes[(i + 1) * _width + j];
		}
	}
}

void	Map::link(Map &up)
{
	size_t pos = 0;
	for (quadList &node : this->_nodes)
	{
		if (!node->getRoom() || node->getRoom()->getName() != "stairs")
			continue ;
		for (; pos < up._nodes.size(); pos++)
		{
			if (!up._nodes[pos]->getRoom() || up._nodes[pos]->getRoom()->getName() != "start")
				continue ;
			node->up = up._nodes[pos];
			pos++;
			break ;
		}
		if (pos == up._nodes.size())
			break ;
	}
}

void	Map::setWaitingRoom()
{
	this->_nodes[0]->addRoom(Room::getWatingRoom());
}

quadList &Map::getHead()
{
	return this->_head;
}

std::vector<quadList> Map::getNodes() const
{
	return this->_nodes;
}

int	Map::getHeight() const
{
	return this->_height;
}

int	Map::getWidth() const
{
	return this->_width;
}