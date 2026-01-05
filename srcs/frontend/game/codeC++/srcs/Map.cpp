#include "Map.hpp"

//CHAINED-MAP------------------------------------------------------------------


//Constructors/Destructors------------------------------------------------


chainedMap::chainedMap(void)
{}

chainedMap::~chainedMap(void)
{}

//Member Functions--------------------------------------------------------

void chainedMap::addRoom(const Room &room)
{
	this->_room = std::make_shared<Room>(room);
}

std::shared_ptr<Room> chainedMap::getRoom(void) const
{
	return this->_room;
}

//MAP--------------------------------------------------------------------------

//Constructors/Destructors------------------------------------------------

Map::Map(void)
{
	for (int i = 0; i < 25; i++)
		_nodes.push_back(std::make_shared<chainedMap>());
	
	this->_head = _nodes[0];

	for (int i = 0; i < 5; i++)
	{
		for (int j = 0; j < 5; j++)
		{
			if (j != 0)
				_nodes[i * 5 + j]->_west = _nodes[i * 5 + j - 1];
			if (j != 4)
				_nodes[i * 5 + j]->_east = _nodes[i * 5 + j + 1];
			if (i != 0)
				_nodes[i * 5 + j]->_north = _nodes[(i - 1) * 5 + j];
			if (i != 4)
				_nodes[i * 5 + j]->_south = _nodes[(i + 1) * 5 + j];
		}
	}
}

Map::Map(int width, int height)
{
	for (int i = 0; i < width * height; i++)
		_nodes.push_back(std::make_shared<chainedMap>());
	
	this->_head = _nodes[0];

	for (int i = 0; i < height; i++)
	{
		for (int j = 0; j < width; j++)
		{
			if (j != 0)
				_nodes[i * width + j]->_west = _nodes[i * width + j - 1];
			if (j != width - 1)
				_nodes[i * width + j]->_east = _nodes[i * width + j + 1];
			if (i != 0)
				_nodes[i * width + j]->_north = _nodes[(i - 1) * width + j];
			if (i != height - 1)
				_nodes[i * width + j]->_south = _nodes[(i + 1) * width + j];
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