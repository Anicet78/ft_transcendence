#include "Room.hpp"

std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF0;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF1;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF2;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF3;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF4;

Room &Room::operator=(Room const &rhs)
{
	if (&rhs == this)
		return *this;
	this->_name = rhs._name;
	this->_height = rhs._height;
	this->_width = rhs._width;
	if (!rhs._roomPlan.empty())
	{
		int num = rand() % 4;
		if (num == 1)
			turnMapLeft(this->_roomPlan, rhs._roomPlan, rhs._width);
		else if (num == 2)
			turnMapRight(this->_roomPlan, rhs._roomPlan, rhs._width);
		else if (num == 3)
			turnMapUpDown(this->_roomPlan, rhs._roomPlan);
		else
			this->_roomPlan = rhs._roomPlan;
		this->identifyExits();
	}
	else
		this->_exits = rhs._exits;
	return *this;
}

//Constructors/Destructors------------------------------------------------

Room::Room(void)
{
	this->_width = 10;
	this->_height = 10;
	this->_exits = {0, 0, 0, 0};
	this->_name = "Empty";
}

Room::Room(Room const &rhs): _width(rhs._width), _height(rhs._height), _exits(rhs._exits), _name(rhs._name)
{
	if (!rhs._roomPlan.empty())
	{
		this->_exits = {0, 0, 0, 0};
		int num = rand() % 4;
		if (num == 1)
			turnMapLeft(this->_roomPlan, rhs._roomPlan, rhs._width);
		else if (num == 2)
			turnMapRight(this->_roomPlan, rhs._roomPlan, rhs._width);
		else if (num == 3)
			turnMapUpDown(this->_roomPlan, rhs._roomPlan);
		else
			this->_roomPlan = rhs._roomPlan;
		this->identifyExits();
	}
}

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

std::string Room::getName() const
{
	return this->_name;
}

std::vector<std::string> Room::getRoomPlan() const
{
	return this->_roomPlan;
}

std::array<int, 4> Room::getExits() const
{
	return this->_exits;
}

void Room::identifyExits()
{
    for (size_t i = 0; i < _roomPlan.size(); ++i)
    {
        const std::string& line = _roomPlan[i];
        size_t pos = 0;

        while ((pos = line.find('E', pos)) != std::string::npos)
        {
            // West
            if (pos + 1 < line.size() && line[pos + 1] == '0')
                _exits[3] = 1;

            // East
            else if (pos > 0 && line[pos - 1] == '0')
                _exits[1] = 1;

            // North
            else if (i + 1 < _roomPlan.size() && _roomPlan[i + 1][pos] == '0')
                _exits[0] = 1;

            // South
            else if (i > 0 && _roomPlan[i - 1][pos] == '0')
                _exits[2] = 1;
            ++pos;
        }
    }
}


void Room::turnMapLeft(std::vector<std::string> &dest,
                       const std::vector<std::string> &src,
                       int width)
{
	dest.clear();

	int height = src.size();

	for (int x = width - 1; x >= 0; x--)
	{
		std::string line;
		for (int y = 0; y < height; y++)
		{
			if (x < static_cast<int>(src[y].size()))
				line += src[y][x];
			else
				line += ' ';
		}
		dest.push_back(line);
	}
}

void Room::turnMapRight(std::vector<std::string> &dest,
                       const std::vector<std::string> &src,
                       int width)
{
	dest.clear();

	int height = src.size();

	for (int x = 0; x < width; x++)
	{
		std::string line;
		for (int y = height - 1; y >= 0; y--)
		{
			if (x < static_cast<int>(src[y].size()))
				line += src[y][x];
			else
				line += ' ';
		}
		dest.push_back(line);
	}
}

void	Room::turnMapUpDown(std::vector<std::string> &dest, const std::vector<std::string> &src)
{
	for (int i = src.size() - 1; i >= 0; i--)
		dest.push_back(src[i]);
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

void Room::importMap(std::string mapName)
{
	auto room = std::make_shared<Room>();
	std::ifstream file("./assets/rooms/floor0/" + mapName);
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
	_RoomsF0.emplace(mapName, room);
}

void Room::importRooms()
{
	DIR				*dir;
	struct dirent	*entry;

	dir = opendir("./assets/rooms/floor0");
	if (dir == NULL)
		throw std::runtime_error("Error : function oppendir failed");
	entry = readdir(dir);
	while (entry)
	{
		if (verifFile(entry->d_name, ".map"))
			Room::importMap(entry->d_name);
		entry = readdir(dir);
	}
	closedir(dir);

	for (auto &pair : _RoomsF0)
		std::cout << *pair.second.get() << std::endl;
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