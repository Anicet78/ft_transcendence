#ifndef ROOM_HPP

# define ROOM_HPP

# include "main.hpp"

class Room
{
	private:
		int _width;
		int _height;
		//_exits[0] = North, _exits[1] = East, _exits[2] = South, _exits[3] = West
		std::array<int, 4> _exits;
		std::string _name;
		std::vector<std::string> _roomPlan;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF0;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF1;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF2;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF3;
		static std::map<std::string, std::shared_ptr<Room>> _RoomsF4;
	
	private:
		static void importMap(std::string mapName);
		void		identifyExits();
		static void	turnMapLeft(std::vector<std::string> &dest, const std::vector<std::string> &src, int width);
		static void	turnMapRight(std::vector<std::string> &dest, const std::vector<std::string> &src, int width);
		static void	turnMapUpDown(std::vector<std::string> &dest, const std::vector<std::string> &src);


	public:
		Room(void);
		Room(Room const &rhs);
		Room &operator=(Room const &rhs);
		~Room(void);
	
	public:
		int	getWidth() const;
		int getHeight() const;
		std::array<int, 4> getExits() const;
		std::string getName() const;
		std::vector<std::string> getRoomPlan() const;
		static std::map<std::string, std::shared_ptr<Room>> getFloor0();
		static void importRooms();
};

std::ostream &operator<<(std::ostream &o, Room const &obj);

#endif