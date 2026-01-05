#ifndef ROOM_HPP

# define ROOM_HPP

# include "main.hpp"

class Room
{
	private:
		int _width;
		int _height;
		std::string _name;
		std::vector<std::string> _roomPlan;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF0;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF1;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF2;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF3;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF4;
	
	private:
		static void importMap(std::string mapName);


	public:
		Room(void);
		~Room(void);
	
	public:
		int	getSize() const;
		static void importRooms();
};

#endif