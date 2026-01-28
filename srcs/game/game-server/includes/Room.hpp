#ifndef ROOM_HPP

# define ROOM_HPP

# include "Mob.hpp"

class ARoomEvent
{
protected:
	std::string _type;
public:
	virtual ~ARoomEvent() {};
	virtual	void	createEvent(void) = 0;
	virtual bool	isCleared(void) = 0;
	virtual bool	isStarted(void) = 0;
	virtual void	checkCleared(void) = 0;
	std::string	const	&getType(void) const;
};

//make the room event a mob rush, player need to kill every mob in the room to clear it
class MobRush : public ARoomEvent
{
private:
	std::vector<std::string>			&_roomPlan;
	std::map<int, std::unique_ptr<Mob>>	_mobs;
	std::vector<int>					_mobsId;
	int									_nbrMob;
	int									_nbrDead;

	bool	_started;
	bool	_cleared;

	void	createEvent(void);
public:
	MobRush(std::vector<std::string> &roomPlan);
	~MobRush();

	bool	isCleared(void);
	bool	isStarted(void);
	void	destroyEvent(void);
	void	checkCleared(void);

	void	makeDie(int id);

	std::map<int, std::unique_ptr<Mob>>	&getMobs(void);
};

class Room
{
	private:
		//Width of the room
		int _width;
		//Height of the room
		int _height;
		//if the room is rotated
		int _rotated;
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

		std::shared_ptr<ARoomEvent>	_event;

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
		int													getWidth() const;
		int													getHeight() const;
		int													getRotated() const;
		void												incrementRotate();
		static Room											getWatingRoom();
		std::array<std::array<int, 2>, 4>					getExitsLoc() const;
		std::array<bool, 4>									getExits() const;
		std::string											getName() const;
		std::vector<std::string>							getRoomPlan() const;
		static std::map<std::string, std::shared_ptr<Room>>	getFloor0();
		static void											importRooms();
		void												randomizeRoom();
		void												turnMapLeft(void);
		void												turnMapRight(void);
		void												turnMapUpDown(void);
		void												setEvent(void);
		std::shared_ptr<ARoomEvent>							getRoomEvent(void) const;
		std::shared_ptr<ARoomEvent>							getRoomEventRef(void);
};

std::ostream &operator<<(std::ostream &o, Room const &obj);

#endif