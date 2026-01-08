#include"Player.hpp"

Player::Player(int uid, std::string name, int x, int y) : _uid(uid), _name(name), _x(x), _y(y), _hp(3), _atk(1), _def(0) {
	return ;
}

Player::~Player(void) {
	return ;
}

//get player value
int	Player::getUid(void) const {
	return (_uid);
}

std::string	Player::getName(void) const {
	return (_name);
}

float	Player::getX(void) const {
	return (_x);
}

float	Player::getY(void) const {
	return (_y);
}

int		Player::getHp(void) const {
	return (_hp);
}

int		Player::getAtk(void) const {
	return (_atk);
}

int		Player::getDef(void) const {
	return (_def);
}

//set player value
void	Player::setPos(float x, float y) {
	_x = x;
	_y = y;
	return ;
}

void	Player::setHp(int hp) {
	_hp = hp;
	return ;
}

void	Player::setAtk(int atk) {
	_atk = atk;
	return ;
}

void	Player::setDef(int def) {
	_def = def;
	return ;
}