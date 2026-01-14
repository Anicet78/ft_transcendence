#include"Player.hpp"

Player::Player(int uid, std::string name, quadList &node) : _uid(uid), _name(name), _x(0), _y(0), _node(node), _hp(3), _atk(1), _def(0)
{
	int i = 0;
	for (auto &line : _node->getRoom()->getRoomPlan())
	{
		size_t pos = line.find('P');
		if (pos != std::string::npos)
		{
			_x = pos + 0.5, _y = i + 0.5;
			break ;
		}
		i++;
	}
	return ;
}

Player::~Player(void) {
	return ;
}

//get player value
int	Player::getUid(void) const
{
	return (_uid);
}

std::string	Player::getName(void) const
{
	return (_name);
}

float	Player::getX(void) const
{
	return (_x);
}

float	Player::getY(void) const
{
	return (_y);
}

int		Player::getHp(void) const
{
	return (_hp);
}

int		Player::getAtk(void) const
{
	return (_atk);
}

int		Player::getDef(void) const
{
	return (_def);
}

Room	Player::getRoom(void) const
{
	return *this->_node->getRoom().get();
}

quadList Player::getNode() const
{
	return this->_node;
}

//set player value

void Player::setNode(const quadList &node)
{
	this->_node = node;
}

void	Player::setPos(float x, float y)
{
	_x = x;
	_y = y;
	return ;
}

void	Player::setHp(int hp)
{
	_hp = hp;
	return ;
}

void	Player::setAtk(int atk)
{
	_atk = atk;
	return ;
}

void	Player::setDef(int def)
{
	_def = def;
	return ;
}