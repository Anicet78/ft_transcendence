#include "Room.hpp"

std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF0;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF1;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF2;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF3;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF4;
std::map<std::string, std::shared_ptr<Room>> Room::_WatingRooms;

Room &Room::operator=(Room const &rhs)
{
	if (&rhs == this)
		return *this;
	this->_name = rhs._name;
	this->_height = rhs._height;
	this->_width = rhs._width;
	this->_exits = rhs._exits;
	this->_roomPlan = rhs._roomPlan;
	this->_exitsLoc = rhs._exitsLoc;
	return *this;
}

//Constructors/Destructors------------------------------------------------

Room::Room(void)
{
	this->_width = 10;
	this->_height = 10;
	this->_rotated = 0;
	this->_exits = {0, 0, 0, 0};
	this->_exitsLoc.fill({-1, -1});
	this->_name = "Empty";
}

Room::Room(Room const &rhs): _width(rhs._width), _height(rhs._height), _rotated(rhs._rotated),
				_exits(rhs._exits), _exitsLoc(rhs._exitsLoc), _name(rhs._name), _roomPlan(rhs._roomPlan)
{}

Room::~Room()
{}

//Member Functions--------------------------------------------------------

int Room::getWidth() const
{
	return this->_width;
}

int Room::getHeight() const
{
	return this->_height;
}

int Room::getRotated(void) const
{
	return this->_rotated;
}

std::string Room::getName() const
{
	return this->_name;
}

std::vector<std::string> Room::getRoomPlan() const
{
	return this->_roomPlan;
}

std::array<bool, 4> Room::getExits() const
{
	return this->_exits;
}

void	Room::incrementRotate(void)
{
	this->_rotated++;
}

std::array<std::array<int, 2>, 4> Room::getExitsLoc() const
{
	return this->_exitsLoc;
}

void Room::updateSize()
{
	int nWidth = 0, nHeight = 0;

	for (auto &line : this->_roomPlan)
	{
		nHeight++;
		if (nWidth < static_cast<int>(line.size()))
			nWidth = line.size();
	}
	this->_width = nWidth;
	this->_height = nHeight;
}

void Room::randomizeRoom()
{
	if (this->_roomPlan.empty())
		return ;
	int num = rand() % 4;
	if (num == 1)
	{
		this->_exits = {0, 0, 0, 0};
		this->turnMapLeft();
		this->_rotated = 1;
	}
	else if (num == 2)
	{
		this->_exits = {0, 0, 0, 0};
		this->turnMapLeft();
		this->turnMapLeft();
		this->turnMapLeft();
		this->_rotated = 3;
	}
	else if (num == 3)
	{
		this->_exits = {0, 0, 0, 0};
		this->turnMapLeft();
		this->turnMapLeft();
		this->_rotated = 2;
	}
}

void Room::identifyExits()
{
	_exits = {0, 0, 0, 0};
    for (size_t i = 0; i < _roomPlan.size(); ++i)
    {
        const std::string& line = _roomPlan[i];
        size_t pos = 0;

        while ((pos = line.find('E', pos)) != std::string::npos)
        {
            // West
            if (pos + 1 < line.size() && line[pos + 1] == '0')
			{
                _exits[3] = 1;
				_exitsLoc[3] = {static_cast<int>(pos), static_cast<int>(i)};
			}

            // East
            else if (pos > 0 && line[pos - 1] == '0')
			{
                _exits[1] = 1;
				_exitsLoc[1] = {static_cast<int>(pos), static_cast<int>(i)};
			}

            // North
            else if (i + 1 < _roomPlan.size() && _roomPlan[i + 1][pos] == '0')
			{
                _exits[0] = 1;
				_exitsLoc[0] = {static_cast<int>(pos), static_cast<int>(i)};
			}

            // South
            else if (i > 0 && _roomPlan[i - 1][pos] == '0')
			{
                _exits[2] = 1;
				_exitsLoc[2] = {static_cast<int>(pos), static_cast<int>(i)};
			}
            ++pos;
        }
    }
}


void Room::turnMapLeft()
{
	auto src = this->_roomPlan;
	this->_roomPlan.clear();

	int height = src.size();

	for (int x = _width - 1; x >= 0; x--)
	{
		std::string line;
		for (int y = 0; y < height; y++)
		{
			if (x < static_cast<int>(src[y].size()))
				line += src[y][x];
			else
				line += ' ';
		}
		this->_roomPlan.push_back(line);
	}
	this->updateSize();
	this->identifyExits();
}


std::map<std::string, std::shared_ptr<Room>> Room::getFloor0()
{
	return _RoomsF0;
}

static int verifFile(std::string str, std::string ext)
{
	std::string strExt = str.substr(str.rfind('.'));
	return strExt == ext;
}

void Room::importMap(std::string &fullPath, std::string mapName, std::map<std::string, std::shared_ptr<Room>> &set)
{
	auto room = std::make_shared<Room>();
	std::ifstream file(fullPath + mapName);
	if (!file.is_open())
		throw std::runtime_error("Impossible d'ouvrir le fichier\n");

	mapName = mapName.substr(0, mapName.size() - 4);
	std::string line;
	int maxWidth = -1, maxHeight = 0;

	while (std::getline(file, line))
	{
		room->_roomPlan.push_back(line);
		if (maxWidth < static_cast<int>(line.size()))
			maxWidth = line.size();
		maxHeight++;
	}
	file.close();
	for (auto& s : room->_roomPlan)
        s.resize(maxWidth, ' ');
	room->_width = maxWidth;
	room->_height = maxHeight;
	room->_name = mapName;
	room->identifyExits();
	set.emplace(mapName, room);
}

void	Room::importFloor(std::string fullPath, std::map<std::string, std::shared_ptr<Room>> &set)
{
	DIR				*dir;
	struct dirent	*entry;

	dir = opendir(fullPath.c_str());
	if (dir == NULL)
		throw std::runtime_error("Error : function oppendir failed");
	entry = readdir(dir);
	while (entry)
	{
		if (verifFile(entry->d_name, ".map"))
			Room::importMap(fullPath, entry->d_name, set);
		entry = readdir(dir);
	}
	closedir(dir);
}

Room Room::getWatingRoom()
{
	// if (!_WatingRooms.size())
	// 	throw std::runtime_error("No wating room available");
	return *_WatingRooms["waiting"].get();
}

void Room::importRooms()
{
	std::string path("../assets/rooms/");
	
	Room::importFloor(path + "waitingRooms/", _WatingRooms);
	Room::importFloor(path + "floor0/", _RoomsF0);
	// for (auto &room : _RoomsF0)
	// 	std::cout << *room.second.get() << std::endl;
}

std::ostream &operator<<(std::ostream &o, Room const &obj)
{
	o << "Room name: " << obj.getName() << std::endl;
	o << "Sizes: " << obj.getWidth() << ", " << obj.getHeight() << std::endl;
	o << "exits: N = " << obj.getExits()[0] << ", E = " << obj.getExits()[1]
	  << ", S = " << obj.getExits()[2] << ", W = " << obj.getExits()[3] << std::endl;
	for (auto line : obj.getRoomPlan())
		o << line << std::endl;
	return o;
}