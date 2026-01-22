#include"Player.hpp"

Player::Player(int uid, std::string name, quadList &node) : _uid(uid), _name(name), _x(0), _y(0), _node(node), _hp(3), _atk(1), _def(0), _box(_x, _y, _screenX, _screenY, PlayerAssets::getLastDir()),  _camera(_x, _y)
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
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	_box.updateHitBox();
	return ;
}

Player::~Player(void) {
	return ;
}

//-----------------------------getter-----------------------------

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

SDL_FRect	&Player::getWallHitBox(void) {
	return (_wallHitBox);
}

HitBox	&Player::getBox(void) {
	return (_box);
}

Camera	&Player::getCamera(void) {
	return (_camera);
}

//----------------------------------------------------------------

//-----------------------------setter-----------------------------

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

void	Player::setWallHitBox(void) {
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}

//----------------------------------------------------------------

//-----------------------------action-----------------------------

bool	checkWallHitBox(std::vector<std::string> const &plan, SDL_FRect const &rect, int const flag) {
	if (gSdl.key.w_key && flag == 0)
	{
		float y = rect.y - 0.1;
		if (plan[y][rect.x] == '1' || plan[y][rect.x + rect.h] == '1')
			return (true);
	}
	if (gSdl.key.a_key && flag == 1)
	{
		float x = rect.x - 0.1;
		if (plan[rect.y][x] == '1' || plan[rect.y + rect.h][x] == '1')
			return (true);
	}
	if (gSdl.key.s_key && flag == 2)
	{
		float y = rect.y + 0.1;
		if (plan[y + rect.h][rect.x] == '1' || plan[y + rect.h][rect.x + rect.w] == '1')
			return (true);
	}
	if (gSdl.key.d_key && flag == 3)
	{
		float x = rect.x + 0.1;
		if (plan[rect.y][x + rect.h] == '1' || plan[rect.y + rect.h][x + rect.w] == '1')
			return (true);
	}
	return (false);
}

void	Player::move(float timeStep) {
	Room &room = this->getRoom();
	float x = this->getX(), y = this->getY();
	auto plan = room.getRoomPlan();

	(void)timeStep;
	if (gSdl.key.w_key)
	{
		y -= 0.1;
		if (y >= 0 && !checkWallHitBox(plan, _wallHitBox, 0))
			this->setPos(x, y);
		else
			y += 0.1;
	}
	if (gSdl.key.a_key)
	{
		x -= 0.1;
		if (x >= 0 && !checkWallHitBox(plan, _wallHitBox, 1))
			this->setPos(x, y);
		else
			x += 0.1;
	}
	if (gSdl.key.s_key)
	{
		y += 0.1;
		if (y < room.getHeight() && !checkWallHitBox(plan, _wallHitBox, 2))
			this->setPos(x, y);
		else
			y -= 0.1;
	}
	if (gSdl.key.d_key)
	{
		x += 0.1;
		if (x < room.getWidth() && !checkWallHitBox(plan, _wallHitBox, 3))
			this->setPos(x, y);
		else
			x -= 0.1;
	}
}

//----------------------------------------------------------------

void	Player::updateScreenPos(int tile_s) {
	_screenX = (_x - _camera.getCamX()) * tile_s;
	_screenY = (_y - _camera.getCamY()) * tile_s;
	return ;
}