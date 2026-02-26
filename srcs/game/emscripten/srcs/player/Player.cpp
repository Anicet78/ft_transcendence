#include"Player.hpp"

Player::Player(std::string uid, std::string name, SDL_Color color) : _uid(uid), _name(name), _x(0), _y(0),
					_screenX(0), _screenY(0), _anim(0), _hp(3), _atk(1), _def(0), _atkState(false),
					_camera(_x, _y, 12, 12, SCREEN_WIDTH, GAME_HEIGHT), _floor(0), _last_dir(0), _frame(0), _prev_state(PLAYER_IDLE), _kills(0), _nbrDeath(0)
{
	SDL_Surface* surf = TTF_RenderText_Blended(gSdl.font, name.c_str(), color);
	if (!surf)
		SDL_Log("RenderText error: %s", TTF_GetError());
	this->_nameTexture = SDL_CreateTextureFromSurface(gSdl.renderer, surf);
	SDL_FreeSurface(surf);
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}

Player::~Player(void)
{
	SDL_DestroyTexture(_nameTexture);
}

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

int		Player::getPrevState(void) const
{
	return (_prev_state);
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

quadList Player::getStartNode() const
{
	return this->_startNode;
}

Camera	&Player::getCamera(void)
{
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

int	Player::getKills(void) const
{
	return (this->_kills);
}

int	Player::getNbrDeath(void) const
{
	return (this->_nbrDeath);
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
	if (this->_atkState)
		return ;
	if (gSdl.key.d_key)
		_last_dir = 0;
	else if (gSdl.key.a_key)
		_last_dir = 1;
	else if (gSdl.key.w_key)
		_last_dir = 2;
	else if (gSdl.key.s_key)
		_last_dir = 3;
}

void Player::setNode(const quadList &node)
{
	this->_node = node;
}

void	Player::setStartNode(const quadList &node)
{
	this->_startNode = node;
}

void	Player::setPos(float x, float y)
{
	_x = x;
	_y = y;
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

void	Player::setKills(int kills)
{
	this->_kills = kills;
	return ;
}

void	Player::setNbrDeath(int value)
{
	this->_nbrDeath = value;
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

void	Player::updateScreenPos(int tile_s)
{
	_screenX = (_x - _camera.getCamX()) * tile_s;
	_screenY = (_y - _camera.getCamY()) * tile_s;
	return ;
}

void	Player::printPlayer(float px, float py, int flag)
{
	int			tile_s = gSdl.getMapTileSize() * 2;
	const float x = px - (0.5f * tile_s);
	const float y = py - (0.5f * tile_s);

	if (flag)
	{
		SDL_SetTextureBlendMode(this->_nameTexture, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(this->_nameTexture, 128);
	}
	
	if (this->_anim == PLAYER_ATTACKING)
	{
		if (!flag && this->_prev_state != PLAYER_ATTACKING)
		{
			this->_frame = 0;
			this->_prev_state = PLAYER_ATTACKING;
			this->startAtk();
		}
		if (!flag && this->_frame >= 24)
		{
			this->_frame = 0;
			this->endAtk();
		}
		int frame = (flag) ? ((!this->_frame) ? 23 : this->_frame - 1) : this->_frame;
		if (this->_last_dir < 2)
			PlayerAssets::rendPlayerAttack(0, x, y, frame / 4, 2, this->_last_dir, flag);
		else if (this->_last_dir == 3)
			PlayerAssets::rendPlayerAttackFront(0, x, y, frame / 4, 2, flag);
		else if (this->_last_dir == 2)
			PlayerAssets::rendPlayerAttackBack(0, x, y, frame / 4, 2, flag);
	}
	else if (this->_anim == PLAYER_WALKING)
	{
		if (!flag && this->_prev_state != PLAYER_WALKING)
		{
			this->_frame = 0;
			this->endAtk();
			this->_prev_state = PLAYER_WALKING;
		}
		if (!flag && this->_frame >= 32)
			this->_frame = 0;
		int frame = (flag) ? ((!this->_frame) ? 31 : this->_frame - 1) : this->_frame;
		if (this->_last_dir < 2)
			PlayerAssets::rendPlayerWalk(0, x, y, frame / 4, 2, this->_last_dir, flag);
		else if (this->_last_dir == 3)
			PlayerAssets::rendPlayerWalkFront(0, x, y, frame / 4, 2, flag);
		else if (this->_last_dir == 2)
			PlayerAssets::rendPlayerWalkBack(0, x, y, frame / 4, 2, flag);
	}
	else if (this->_anim == PLAYER_IDLE)
	{
		if (!flag && this->_prev_state != PLAYER_IDLE)
		{
			this->_frame = 0;
			this->endAtk();
			this->_prev_state = PLAYER_IDLE;
		}
		if (!flag && this->_frame >= 24)
			this->_frame = 0;
		int frame = (flag) ? ((!this->_frame) ? 23 : this->_frame - 1) : this->_frame;
		if (this->_last_dir < 2)
			PlayerAssets::rendPlayerIdle(0, x, y, frame / 4, 2, this->_last_dir, flag);
		else if (this->_last_dir == 3)
			PlayerAssets::rendPlayerIdleFront(0, x, y, frame / 4, 2, flag);
		else if (this->_last_dir == 2)
			PlayerAssets::rendPlayerIdleBack(0, x, y, frame / 4, 2, flag);
	}

	if (!flag)
		this->_frame++;
	int w, h;
	SDL_QueryTexture(this->_nameTexture, nullptr, nullptr, &w, &h);
	SDL_Rect dst = {static_cast<int>(x + 16 - (w / 6)), static_cast<int>(y - 16 - (h / 6)), w / 3, h / 3};
	SDL_RenderCopy(gSdl.renderer, this->_nameTexture, nullptr, &dst);
	if (flag)
		SDL_SetTextureAlphaMod(this->_nameTexture, 255);
}

static bool	checkWallHitBox(std::vector<std::string> const &plan, SDL_FRect const &rect, int const flag, Player &player, float deltaTime)
{
	if (flag == 0)
	{
		float y = rect.y - (6.0f * deltaTime);
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
		float x = rect.x - (6.0f * deltaTime);
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
		float y = rect.y + (6.0f * deltaTime);
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
		float x = rect.x + (6.0f * deltaTime);
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

void	Player::setWallHitBox(void)
{
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}

void	Player::movePrediction(double deltaTime)
{
	Room room = this->getRoom();
	float x = this->_x;
	float y = this->_y;
	auto plan = room.getRoomPlan();
	this->setWallHitBox();
	(void)deltaTime;

	if (gSdl.key.w_key)
	{
		y -= 6.0f * deltaTime;
		if (!(y >= 0 && !checkWallHitBox(plan, this->_wallHitBox, 0, *this, deltaTime)))
			y += 6.0f * deltaTime;
	}
	if (gSdl.key.a_key)
	{
		x -= 6.0f * deltaTime;
		if (!(x >= 0 && !checkWallHitBox(plan, this->_wallHitBox, 1, *this, deltaTime)))
			x += 6.0f * deltaTime;
	}
	if (gSdl.key.s_key)
	{
		y += 6.0f * deltaTime;
		if (!(y < room.getHeight() && !checkWallHitBox(plan, this->_wallHitBox, 2, *this, deltaTime)))
			y -= 6.0f * deltaTime;
	}
	if (gSdl.key.d_key)
	{
		x += 6.0f * deltaTime;
		if (!(x < room.getWidth() && !checkWallHitBox(plan, this->_wallHitBox, 3, *this, deltaTime)))
			x -= 6.0f * deltaTime;
	}
	this->setPos(x, y);
}