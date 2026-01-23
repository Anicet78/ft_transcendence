#include"Player.hpp"

Player::Player(std::string uid, int partySize, std::string partyName, std::string name, uWS::WebSocket<false, true, PerSocketData> *ws)
				: _uid(uid), _partySize(partySize),  _partyName(partyName), _name(name), _inQueue(true), _inSession(false),
					_launched(0), _connected(0), _exit(' '), _ws(ws), _x(0), _y(0), _anim(0), _last_dir(0), _hp(3), _atk(1), _def(0)
{}

Player::~Player(void)
{}

//get player value

bool Player::isLaunched(void) const
{
	return this->_launched;
}

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

int		Player::getAnim(void) const
{
	return this->_anim;
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

bool Player::isConnected(void) const
{
	return this->_connected;
}

uWS::WebSocket<false, true, PerSocketData> *Player::getWs() const
{
	return this->_ws;
}

quadList Player::getNode() const
{
	return this->_node;
}

quadList Player::getPrevNode() const
{
	return this->_prev_node;
}

int Player::getLastDir(void) const
{
	return this->_last_dir;
}

//set player value

void	Player::setLaunched(bool flag)
{
	this->_launched = flag;
}

void	Player::setConnexion(bool c)
{
	this->_connected = c;
}

void	Player::setExit(char c)
{
	this->_exit = c;
}

void	Player::setPrevNode(const quadList &node)
{
	this->_prev_node = node;
}

void	Player::setNode(const quadList &node)
{
	this->_node = node;
	if (node->getRoom()->getName() == "waiting" || node->getRoom()->getName() == "start")
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

void	Player::setAnim(int anim)
{
	this->_anim = anim;
}

void	Player::setLastDir(int dir)
{
	this->_last_dir = dir;
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