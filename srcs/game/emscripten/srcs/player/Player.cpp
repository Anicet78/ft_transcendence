#include"Player.hpp"

Player::Player(std::string uid, std::string name) : _uid(uid), _name(name), _x(0), _y(0),
					_screenX(0), _screenY(0), _anim(0), _hp(3), _atk(1), _def(0), _atkState(false),
					_camera(_x, _y), _floor(0), _last_dir(0), _frame(0), _prev_state(PLAYER_IDLE)
{
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}

Player::~Player(void)
{}

//get player value
std::string	Player::getUid(void) const
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

float	Player::getPrevX(void) const
{
	return(_prevX);
}

float	Player::getPrevY(void) const
{
	return(_prevY);
}

float	Player::getTargetX(void) const
{
	return(_targetX);
}

float	Player::getTargetY(void) const
{
	return(_targetY);
}

float	Player::getTimer(void) const
{
	return(_timer);
}

float	Player::getScreenX(void) const {
	return (_screenX);
}

float	Player::getScreenY(void) const {
	return (_screenY);
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

Room	&Player::getRoom(void) const
{
	return *this->_node->getRoom().get();
}

Room	&Player::getRoomRef(void)
{
	return *this->_node->getRoom().get();
}

quadList Player::getNode() const
{
	return this->_node;
}

Camera	&Player::getCamera(void) {
	return (_camera);
}

int Player::getAnim(void) const
{
	return this->_anim;
}

int	Player::getLastDir(void) const
{
	return this->_last_dir;
}

int Player::getFloor(void) const
{
	return this->_floor;
}

int	Player::getFrame(void) const
{
	return (_frame);
}

//set player value

void	Player::updateLastDir(void)
{
	if (gSdl.key.d_key)
		_last_dir = 0;
	else if (gSdl.key.a_key)
		_last_dir = 1;
}

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

void	Player::setPrevPos(float x, float y)
{
	_prevX = x;
	_prevY = y;
	return ;
}

void	Player::setTargetPos(float x, float y)
{
	_targetX = x;
	_targetY = y;
	return ;
}

void	Player::setTimer(float time)
{
	_timer = time;
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

void Player::setDir(int dir)
{
	this->_last_dir = dir;
}

void	Player::setAnim(int anim)
{
	this->_anim = anim;
}

void	Player::incrementFloor(void)
{
	this->_floor++;
}

void	Player::startAtk(void)
{
	this->_atkState = true;
}

void	Player::endAtk(void)
{
	this->_atkState = false;
}

bool	Player::checkAtkState(void) const
{
	return (_atkState);
}

//----------------------------------------------------------------

void	Player::updateScreenPos(int tile_s) {
	_screenX = (_x - _camera.getCamX()) * tile_s;
	_screenY = (_y - _camera.getCamY()) * tile_s;
	return ;
}

void	Player::printPlayer(float px, float py)
{
	int			tile_s = gSdl.getMapTileSize() * 2;

	const float x = px - (0.5f * tile_s);
	const float y = py - (0.5f * tile_s);
	if (this->_frame >= 24)
		this->_frame = 0;
	if (this->_anim == 2)
	{
		if (this->_prev_state != PLAYER_ATTACKING)
			this->_frame = 0;
		this->_prev_state = PLAYER_ATTACKING;
		PlayerAssets::rendPlayerAttack(0, x, y, this->_frame / 4, 2, this->_last_dir);
	}
	else if (this->_anim == 1)
	{
		if (this->_prev_state != PLAYER_WALKING)
			this->_frame = 0;
		this->_prev_state = PLAYER_WALKING;
		PlayerAssets::rendPlayerWalk(0, x, y, this->_frame / 4, 2, this->_last_dir);
	}
	else
	{
		if (this->_prev_state != PLAYER_IDLE)
			this->_frame = 0;
		this->_prev_state = PLAYER_IDLE;
		PlayerAssets::rendPlayerIdle(0, x, y, this->_frame / 4, 2, this->_last_dir);
	}

	this->_frame = this->_frame + 1;
}

static bool	checkWallHitBox(std::vector<std::string> const &plan, SDL_FRect const &rect, int const flag, Player &player) {
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

void	Player::setWallHitBox(void) {
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}

void	Player::movePrediction(float deltaTime)
{
	Room room = this->getRoom();
	float x = this->_x;
	float y = this->_y;
	auto plan = room.getRoomPlan();
	this->setWallHitBox();

	if (gSdl.key.w_key)
	{
		y -= 6.0f * deltaTime;
		if (!(y >= 0 && !checkWallHitBox(plan, this->_wallHitBox, 0, *this)))
			y += 6.0f * deltaTime;
	}
	if (gSdl.key.a_key)
	{
		x -= 6.0f * deltaTime;
		if (!(x >= 0 && !checkWallHitBox(plan, this->_wallHitBox, 1, *this)))
			x += 6.0f * deltaTime;
	}
	if (gSdl.key.s_key)
	{
		y += 6.0f * deltaTime;
		if (!(y < room.getHeight() && !checkWallHitBox(plan, this->_wallHitBox, 2, *this)))
			y -= 6.0f * deltaTime;
	}
	if (gSdl.key.d_key)
	{
		x += 6.0f * deltaTime;
		if (!(x < room.getWidth() && !checkWallHitBox(plan, this->_wallHitBox, 3, *this)))
			x -= 6.0f * deltaTime;
	}
	this->setPos(x, y);
}