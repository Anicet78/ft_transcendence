#ifndef MAP_HPP

# define MAP_HPP

# include "Room.hpp"

class chainedMap
{
	private:
		std::shared_ptr<Room>	_room;
		int						_path;
		int						_x;
		int						_y;

	public:
		chainedMap(void);
		~chainedMap(void);
	
	public:
		std::weak_ptr<chainedMap>	north;
		std::weak_ptr<chainedMap>	south;
		std::weak_ptr<chainedMap>	east;
		std::weak_ptr<chainedMap>	west;
		std::weak_ptr<chainedMap>	up;
	
	public:
		void					addRoom(const Room &room);
		void					resetRoom();
		std::shared_ptr<Room>	getRoom(void) const;
		void					setPath(int flag);
		int						getPath() const;
		int						getX() const;
		int						getY() const;
		void					setX(int nb);
		void					setY(int nb);
};

using quadList = std::shared_ptr<chainedMap>;

class Map
{
	private:
		int						_width;
		int						_height;
		quadList				_head;
		std::vector<quadList>	_nodes;
	
	private:
		quadList				chooseRoom(std::string mapName, int lvl);
		int						checkObs(quadList &node);
		void					reset();
		void					preparePathMap(int numPlayers, int depth);
		void					fillPrimaryPath(int lvl);
		void					fillOtherRooms(int lvl);
		int						heuristic(const quadList &a, const quadList &b) const;
		std::vector<quadList>	astar(const quadList &start, const quadList &goal);

	public:
		Map(void);
		Map(int width, int height);
		~Map(void);
	
	public:
		quadList				&getHead(void);
		std::vector<quadList>	getNodes() const;
		int						getWidth() const;
		int						getHeight() const;
		void					link(Map &up);
		void					fillMap(int numPlayers, int depth);
		void					setWaitingRoom();
};

void printMap(Map &floor0);
void printRooms(Map &map);

#endif