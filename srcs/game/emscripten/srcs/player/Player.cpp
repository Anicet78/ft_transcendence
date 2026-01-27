#include"Player.hpp"

Player::Player(std::string uid, std::string name) : _uid(uid), _name(name), _x(0), _y(0),
					_screenX(0), _screenY(0), _anim(0), _hp(3), _atk(1), _def(0), _atkState(false),
					_camera(_x, _y), _last_dir(0), _frame(0), _prev_state(PLAYER_IDLE)
{}

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

int	Player::getFrame(void) const {
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
	if (this->_node->getRoom()->getName() == "waiting" || this->_node->getRoom()->getName() == "start")
	{
		this->_node = node;
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
	}
	else
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

void Player::setDir(int dir)
{
	this->_last_dir = dir;
}

void	Player::setAnim(int anim)
{
	this->_anim = anim;
}

void	Player::startAtk(void) {
	this->_atkState = true;
}

void	Player::endAtk(void) {
	this->_atkState = false;
}

bool	Player::checkAtkState(void) const {
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