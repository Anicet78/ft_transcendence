#include "Room.hpp"

std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF0;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF1;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF2;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF3;
std::map<std::string, std::shared_ptr<Room>> Room::_RoomsF4;

//Constructors/Destructors------------------------------------------------

Room::Room(void)
{
	this->_width = 10;
	this->_height = 10;
}

Room::~Room()
{}

//Member Functions--------------------------------------------------------

int Room::getSize() const
{
	return this->_width;
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
	room->_width = maxWidth;
	room->_height = maxHeight;
	room->_name = mapName;
	_RoomsF0.emplace(mapName, room);
}

void Room::importRooms()
{
	DIR				*dir;
	struct dirent	*entry;
	int				len;

	len = 0;
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
	{
		std::cout << "Room name :" << pair.second->_name << std::endl;
		std::cout << "Sizes :" << pair.second->getSize() << ", " << pair.second->_height << std::endl;
		for (auto line : pair.second->_roomPlan)
		{
			std::cout << line << std::endl;
		}
		std::cout << std::endl;
	}
}