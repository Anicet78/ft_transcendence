#include "Mob.hpp"

Mob::Mob(float x, float y, int hp) : _x(x), _y(y), _hp(hp), _last_dir(0), _frame(0),
	_isInvinsible(false), _isDead(false), _invFrame(0), _tookDamage(false), _sendDeath(false),
	_box(_x, _y, _last_dir) {
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

void	Mob::setInvFrame(int invFrame) {
	this->_invFrame = invFrame;
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

HitBox	&Mob::getBox(void) {
	return (_box);
}

int		Mob::getFrame(void) const {
	return (_frame);
}

int		Mob::getInvFrame(void) const {
	return (_invFrame);
}

//-----------------------------------------------------------------------

//--------------Mob invinsible frame-------------------------------------
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

//-----------------------------------------------------------------------

//-------------Mob death  flag----------------

void	Mob::die(void) {
	this->_isDead = true;
}

bool	Mob::isDead(void) const {
	return (this->_isDead);
}

//-----------------------------------------------------------------------

//-------------Mob take damage flag----------------

void	Mob::damaged(bool value) {
	_tookDamage = value;
}

bool	Mob::isDamaged(void) const {
	return (_tookDamage);
}

//-----------------------------------------------------------------------

//-------------Mob death send message flag----------------

void	Mob::setSendDeath(bool value) {
	_sendDeath = value;
}

bool	Mob::isDeathSend(void) const {
	return (_sendDeath);
}

//-----------------------------------------------------------------------