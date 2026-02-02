#include "Room.hpp"

MobRush::MobRush(std::vector<std::string> &roomPlan) :  _roomPlan(roomPlan), _nbrDead(0), _started(false), _cleared(false) {
	this->_type = "MobRush";
	createEvent();
	return ;
}

MobRush::~MobRush() {
	destroyEvent();
	return ;
}

void	MobRush::createEvent(void) {
	int	id = 0;
	int	maxY = _roomPlan.size();
	for (int y = 0; y < maxY; y++)
	{
		int maxX = _roomPlan[y].size();
		for (int x = 0; x < maxX; x++)
		{
			if (_roomPlan[y][x] == '0' && (rand() % 100) < 2)
			{
				_mobs.emplace(id, std::make_unique<Mob>(x + 0.5f, y + 0.5f, 3));
				_mobsId.push_back(id);
				id++;
			}
		}
		_nbrMob = _mobs.size();
	}
}

void	MobRush::destroyEvent(void) {
	for (auto i : _mobsId) {
		_mobs.erase(i);
	}
	return ;
}

void	MobRush::checkCleared(void) {
	if (_cleared == false && _nbrDead == _nbrMob)
		_cleared = true;
}

void	MobRush::makeDie(int id) {
	if (_mobs[id]->isDead() == false)
	{
		_mobs[id]->die();
		_nbrDead++;
	}
}

bool	MobRush::isStarted(void) {
	return(_started);
}

bool	MobRush::isCleared(void) {
	return (_cleared);
}

std::unordered_map<int, std::unique_ptr<Mob> >	&MobRush::getMobs(void) {
	return (_mobs);
}

std::string const	&ARoomEvent::getType(void) const {
	return (this->_type);
}