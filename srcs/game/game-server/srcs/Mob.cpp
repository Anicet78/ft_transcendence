#include "Mob.hpp"

Mob::Mob(float x, float y, int hp) : _x(x), _y(y), _hp(hp), _last_dir(0), _frame(0), _isInvinsible(false)/*, _box(_x, _y, _screenX, _screenY, _last_dir)*/ {
	return ;
}

Mob::~Mob(void) {

}

//----------------------------setter-------------------------------------

void	Mob::setPos(float x, float y) {
	_x = x;
	_y = y;
	return ;
}

void	Mob::setHp(int hp) {
	_hp = hp;
	return ;
}

float	Mob::getX(void) const {
	return (_x);
}

float	Mob::getY(void) const {
	return (_y);
}

int		Mob::getHp(void) const {
	return (_hp);
}

int		Mob::getLastDir(void) const {
	return (_last_dir);
}

// HitBox	&Mob::getBox(void) {
// 	return (_box);
// }

int		Mob::getFrame(void) const {
	return (_frame);
}

//-----------------------------------------------------------------------

void	Mob::startInvinsibleFrame(void) {
	this->_isInvinsible = true;
	this->_frame = -1;
}

void	Mob::endInvinsibleFrame(void) {
	this->_isInvinsible = false;
	this->_frame = 0;
}

bool	Mob::checkInvinsibleFrame(void) {
	return (this->_isInvinsible);
}