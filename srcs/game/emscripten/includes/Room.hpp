#ifndef ROOM_HPP

# define ROOM_HPP

# include "Mob.hpp"

class Room
{
	private:
		//Width of the room
		int _width;
		//Height of the room
		int _height;
		//_exits[0] = North, _exits[1] = East, _exits[2] = South, _exits[3] = West
		std::array<bool, 4> _exits;
		//localisations of the exits
		std::array<std::array<int, 2>, 4> _exitsLoc;
		//Name of the room
		std::string _name;
		//Plan of the room
		std::vector<std::string> _roomPlan;
		//Wating Room maps
		static std::map<std::string, std::shared_ptr<Room>> _WatingRooms;
		//Map containing all of the rooms of the floor 0
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF0;
		//Map containing all of the rooms of the floor 1
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF1;
		//Map containing all of the rooms of the floor 2
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF2;
		//Map containing all of the rooms of the floor 3
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF3;
		//Map containing all of the rooms of the floor 4
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF4;
	
	private:
		static void importMap(std::string &fullPath, std::string mapName, std::map<std::string, std::shared_ptr<Room>> &set);
		static void importFloor(std::string fullPath, std::map<std::string, std::shared_ptr<Room>> &set);
		void		identifyExits(void);
		void		updateSize(void);


	public:
		Room(void);
		Room(Room const &rhs);
		Room &operator=(Room const &rhs);
		~Room(void);
	
	public:
		int	getWidth() const;
		int getHeight() const;
		static Room getWatingRoom();
		std::array<std::array<int, 2>, 4> getExitsLoc() const;
		std::array<bool, 4> getExits() const;
		std::string getName() const;
		std::vector<std::string> getRoomPlan() const;
		static std::map<std::string, std::shared_ptr<Room>> getFloor0();
		static void importRooms();
		void	randomizeRoom();
		void	turnMapLeft(void);
		void	turnMapRight(void);
		void	turnMapUpDown(void);
};

std::ostream &operator<<(std::ostream &o, Room const &obj);

#endif