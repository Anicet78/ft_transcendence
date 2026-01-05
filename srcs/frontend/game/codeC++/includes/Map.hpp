#ifndef MAP_HPP

# define MAP_HPP

# include "Room.hpp"

class chainedMap
{
	private:
		std::shared_ptr<Room>		_room;
		

	public:
		chainedMap(void);
		~chainedMap(void);
	
	public:
		std::weak_ptr<chainedMap>	_north;
		std::weak_ptr<chainedMap>	_south;
		std::weak_ptr<chainedMap>	_east;
		std::weak_ptr<chainedMap>	_west;
		void addRoom(const Room &room);
		std::shared_ptr<Room> getRoom(void) const;
};

using quadList = std::shared_ptr<chainedMap>;

class Map
{
	private:
		quadList _head;
		std::vector<quadList> _nodes;

	public:
		Map(void);
		Map(int width, int height);
		~Map(void);
	
	public:
		quadList &getHead();
};



#endif