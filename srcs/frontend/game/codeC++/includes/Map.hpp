#ifndef MAP_HPP

# define MAP_HPP

# include "Room.hpp"

class chainedMap
{
	private:
		std::shared_ptr<Room>	_room;
		int						_path;

	public:
		chainedMap(void);
		~chainedMap(void);
	
	public:
		std::weak_ptr<chainedMap>	north;
		std::weak_ptr<chainedMap>	south;
		std::weak_ptr<chainedMap>	east;
		std::weak_ptr<chainedMap>	west;
		void addRoom(const Room &room);
		std::shared_ptr<Room> getRoom(void) const;
		void setPath(int flag);
		int	getPath() const;
};

using quadList = std::shared_ptr<chainedMap>;

class Map
{
	private:
		int _width;
		int _height;
		quadList _head;
		std::vector<quadList> _nodes;
	
	private:
		quadList chooseRoom(std::string mapName);

	public:
		Map(void);
		Map(int width, int height);
		~Map(void);
	
	public:
		quadList &getHead(void);
		std::vector<quadList> getNodes() const;
		void fillMap(void);
};



#endif