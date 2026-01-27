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
		void addRoom(const Room &room);
		std::shared_ptr<Room> getRoom(void) const;
		void setPath(int flag);
		int	getPath() const;
		int getX() const;
		int getY() const;
		void setX(int nb);
		void setY(int nb);
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
		quadList				chooseRoom(std::string mapName);
		int						checkObs(quadList &node);
		void					preparePathMap(void);
		void					fillPrimaryPath(void);
		void					fillOtherRooms(void);
		int						heuristic(const quadList &a, const quadList &b) const;
		std::vector<quadList>	astar(const quadList &start, const quadList &goal);

	public:
		Map(void);
		Map(int width, int height);
		~Map(void);
	
	public:
		quadList				&getHead(void);
		std::vector<quadList>	&getNodes();
		void					fillMap(void);
		int						getWidth() const;
		int						getHeight() const;
		void					setRoomInNode(std::string &roomName, int x, int y, int rot, int roomSet);
		void					setWaitingRoom();
};

void printMap(Map &floor0);

#endif