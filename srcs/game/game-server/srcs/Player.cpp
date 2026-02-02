#include"Player.hpp"

Player::Player(std::string uid, int partySize, std::string partyName, std::string name, uWS::WebSocket<false, true, PerSocketData> *ws)
				: _uid(uid), _partySize(partySize),  _partyName(partyName), _name(name), _inQueue(true), _inSession(false),
					_launched(0), _connected(0), _exit(' '), _ws(ws), _x(0), _y(0), _anim(0), _last_dir(0), _hp(3), _atk(1), _def(0), _box(_x, _y, _last_dir),
					_isAttacking(false), _atkFrame(0)
{
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}

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

Room	&Player::getRoomRef(void)
{
	return *this->_node->getRoom().get();
}

HitBox	&Player::getHitBox(void) {
	return (_box);
}

FRect	&Player::getWallHitBox(void) {
	return (this->_wallHitBox);
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

void	Player::setWallHitBox(void) {
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
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

static bool	checkWallHitBox(std::vector<std::string> const &plan, FRect const &rect, int const flag, Player &player) {
	if (flag == 0)
	{
		float y = rect.y - 0.1;
		if (plan[y][rect.x] == '1' || plan[y][rect.x + rect.h] == '1')
			return (true);

		//if the event in the room is not cleared, player cant go on 'E' tiles
		std::weak_ptr<ARoomEvent> event = player.getRoomRef().getRoomEvent();

		if (!event.expired() && event.lock()->isCleared() == false)
		{
			if (plan[y][rect.x] == 'E' || plan[y][rect.x + rect.h] == 'E')
				return (true);
		}
	}
	if (flag == 1)
	{
		float x = rect.x - 0.1;
		if (plan[rect.y][x] == '1' || plan[rect.y + rect.h][x] == '1')
			return (true);

		//if the event in the room is not cleared, player cant go on 'E' tiles
		std::weak_ptr<ARoomEvent> event = player.getRoomRef().getRoomEvent();

		if (!event.expired() && event.lock()->isCleared() == false)
		{
			if (plan[rect.y][x] == 'E' || plan[rect.y + rect.h][x] == 'E')
				return (true);
		}
	}
	if (flag == 2)
	{
		float y = rect.y + 0.1;
		if (plan[y + rect.h][rect.x] == '1' || plan[y + rect.h][rect.x + rect.w] == '1')
			return (true);
		
		//if the event in the room is not cleared, player cant go on 'E' tiles
		std::weak_ptr<ARoomEvent> event = player.getRoomRef().getRoomEvent();

		if (!event.expired() && event.lock()->isCleared() == false)
		{
			if (plan[y + rect.h][rect.x] == 'E' || plan[y + rect.h][rect.x + rect.w] == 'E')
				return (true);
		}
	}
	if (flag == 3)
	{
		float x = rect.x + 0.1;
		if (plan[rect.y][x + rect.h] == '1' || plan[rect.y + rect.h][x + rect.w] == '1')
			return (true);
		
		//if the event in the room is not cleared, player cant go on 'E' tiles
		std::weak_ptr<ARoomEvent> event = player.getRoomRef().getRoomEvent();

		if (!event.expired() && event.lock()->isCleared() == false)
		{
			if (plan[rect.y][x + rect.h] == 'E' || plan[rect.y + rect.h][x + rect.w] == 'E')
				return (true);
		}
	}
	return (false);
}

void	Player::updateAnim(std::string const &req)
{
    if (!req.empty())
    {
        if (req == "idling")
            this->setAnim(0);
        else if (req == "walking")
            this->setAnim(1);
        else if (req == "attacking")
            this->setAnim(2);
    }
}

void	Player::move(std::map<std::string, std::string> &req) {
    Room room = this->getRoom();
	float x = this->_x, y = this->_y;
	auto plan = room.getRoomPlan();
    this->setWallHitBox();

	if (req["w_key"] == "true")
	{
		y -= 0.1;
		if (!(y >= 0 && !checkWallHitBox(plan, this->_wallHitBox, 0, *this)))
			y += 0.1;
	}
	if (req["a_key"] == "true")
	{
		x -= 0.1;
		if (!(x >= 0 && !checkWallHitBox(plan, this->_wallHitBox, 1, *this)))
			x += 0.1;
	}
	if (req["s_key"] == "true")
	{
		y += 0.1;
		if (!(y < room.getHeight() && !checkWallHitBox(plan, this->_wallHitBox, 2, *this)))
			y -= 0.1;
	}
	if (req["d_key"] == "true")
	{
		x += 0.1;
		if (!(x < room.getWidth() && !checkWallHitBox(plan, this->_wallHitBox, 3, *this)))
			x -= 0.1;
	}
	this->setPos(x, y);
    if (!req["last_dir"].empty())
		this->setLastDir(std::atoi(req["last_dir"].c_str()));
}

bool	Player::getIsAttacking(void) const {
	return (_isAttacking);
}

void	Player::endAttacking(void) {
	this->_isAttacking = false;
}

void	Player::attack(void) {
	_box.updateAtkHitBox();
	_isAttacking = true;
}