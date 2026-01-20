#include"Player.hpp"

Player::Player(std::string uid, int partySize, std::string partyName, std::string name, uWS::WebSocket<false, true, PerSocketData> *ws)
				: _uid(uid), _partySize(partySize),  _partyName(partyName), _name(name), _inQueue(true), _inSession(false),
					_exit(' '), _ws(ws), _x(0), _y(0), _hp(3), _atk(1), _def(0)
{}

Player::~Player(void)
{}

//get player value

char Player::getExit(void) const
{
	return this->_exit;
}

std::string	Player::getUid(void) const
{
	return (_uid);
}

std::string	Player::getPartyName(void) const
{
	return (_partyName);
}

int Player::getGroupSize() const
{
	return _partySize;
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

bool Player::isInQueue(void) const
{
	return this->_inQueue;
}

bool Player::isInSession(void) const
{
	return this->_inSession;
}

uWS::WebSocket<false, true, PerSocketData> *Player::getWs() const
{
	return this->_ws;
}

quadList Player::getNode() const
{
	return this->_node;
}

//set player value

void Player::setExit(char c)
{
	this->_exit = c;
}

void Player::setNode(const quadList &node)
{
	this->_node = node;
	if (node->getRoom()->getName() == "waiting")
	{
		int i = 0;
		for (auto &line : node->getRoom()->getRoomPlan())
		{
			size_t pos = 0;
			if ((pos = line.find('P')) == std::string::npos)
			{
				i++;
				continue ;
			}
			this->_x = static_cast<int>(pos) + 0.5;
			this->_y = i + 0.5;
			i++;
		}
	}
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

void	Player::setInQueue(bool flag)
{
	this->_inQueue = flag;
}

void	Player::setInSession(bool flag)
{
	this->_inSession = flag;
}