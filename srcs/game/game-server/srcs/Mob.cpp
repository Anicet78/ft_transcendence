#include "Mob.hpp"
#include "Player.hpp"

Mob::Mob(float x, float y, int hp) : _x(x), _y(y), _lastX(x), _lastY(y), _hp(hp), _last_dir(0), _dirWalk(0), _state(MOB_IDLE), _routine(MOB_WANDERING),
	_lastPlayerX(-1), _lastPlayerY(-1), _timeAction(std::chrono::steady_clock::now()),  _frame(0),
	_isInvinsible(false), _isDead(false), _invFrame(0), _tookDamage(false), _sendDeath(false),
	_box(_x, _y, _last_dir)
{
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
}

Mob::~Mob(void)
{}

//----------------------------setter-------------------------------------

void	Mob::setPos(float x, float y)
{
	_x = x;
	_y = y;
	return ;
}

void	Mob::setHp(int hp)
{
	_hp = hp;
	return ;
}

void	Mob::setState(int state)
{
	this->_state = state;
	this->_timeAction = std::chrono::steady_clock::now();
}

void	Mob::setTimeAction(void)
{
	this->_timeAction = std::chrono::steady_clock::now();
}

void	Mob::setInvFrame(int invFrame)
{
	this->_invFrame = invFrame;
}

void	Mob::updateLastDir(int dir)
{
	this->_last_dir = dir;
}

void	Mob::updateDirWalk(int dir)
{
	this->_dirWalk = dir;
}

void	Mob::setWallHitBox(void)
{
	_wallHitBox = {_x - 0.3f, _y + 0.1f, 0.6f, 0.2f};
	return ;
}


//----------------------------getter-------------------------------------

float	Mob::getX(void) const
{
	return (_x);
}

float	Mob::getY(void) const
{
	return (_y);
}

int		Mob::getHp(void) const
{
	return (_hp);
}

int		Mob::getState(void) const
{
	return (this->_state);
}

int		Mob::getLastDir(void) const
{
	return (_last_dir);
}

int		Mob::getDirWalk(void) const
{
	return (_dirWalk);
}

HitBox	&Mob::getBox(void)
{
	return (_box);
}
FRect	&Mob::getWallHitBox(void)
{
	return (this->_wallHitBox);
}

int		Mob::getFrame(void) const
{
	return (_frame);
}

int		Mob::getRoutine() const
{
	return this->_routine;
}

int		Mob::getInvFrame(void) const
{
	return (_invFrame);
}

double	Mob::getTimeLastAction(void) const
{
	return (std::chrono::duration<double>(std::chrono::steady_clock::now() - this->_timeAction).count());
}

//-----------------------------------------------------------------------

//--------------Mob invinsible frame-------------------------------------
void	Mob::startInvinsibleFrame(void)
{
	this->_isInvinsible = true;
}

void	Mob::endInvinsibleFrame(void)
{
	this->_isInvinsible = false;
}

bool	Mob::checkInvinsibleFrame(void)
{
	return (this->_isInvinsible);
}

//-----------------------------------------------------------------------

//-------------Mob death  flag----------------

void	Mob::die(void)
{
	this->_isDead = true;
}

bool	Mob::isDead(void) const
{
	return (this->_isDead);
}

//-----------------------------------------------------------------------

//-------------Mob take damage flag----------------

void	Mob::damaged(bool value)
{
	_tookDamage = value;
}

bool	Mob::isDamaged(void) const
{
	return (_tookDamage);
}

//-----------------------------------------------------------------------

//-------------Mob death send message flag----------------

void	Mob::setSendDeath(bool value)
{
	_sendDeath = value;
}

bool	Mob::isDeathSend(void) const
{
	return (_sendDeath);
}

//-----------------------------------------------------------------------

//-------------Mob Actions----------------

static bool checkWallHitBox(std::vector<std::string> const &plan, FRect const &r, int flag, float stepX, float stepY)
{
	float x1 = r.x;
	float y1 = r.y;
	float x2 = (r.x + r.w);
	float y2 = (r.y + r.h);

	switch (flag)
	{
		case 0: // haut
			y1 -= stepY;
			y2 -= stepY;
			break;
		case 1: // gauche
			x1 -= stepX;
			x2 -= stepX;
			break;
		case 2: // bas
			y1 += stepY;
			y2 += stepY;
			break;
		case 3: // droite
			x1 += stepX;
			x2 += stepX;
			break;
	}

	if (y1 < 0 || y2 >= static_cast<int>(plan.size()))
		return false;
	if (x1 < 0 || x2 >= static_cast<int>(plan[0].size()))
		return false;

	return (plan[y1][x1] != '1' && plan[y2][x2] != '1' && plan[y1][x1] != 'E' && plan[y2][x2] != 'E');
}

static bool checkWallHitBox2(std::vector<std::string> const &plan,
							FRect const &r, float stepX, float stepY)
{
	float x1f = r.x + stepX;
	float y1f = r.y + stepY;
	float x2f = (r.x + r.w) + stepX;
	float y2f = (r.y + r.h) + stepY;

	if (y1f < 0 || y2f >= static_cast<float>(plan.size()))
		return false;
	if (x1f < 0 || x2f >= static_cast<float>(plan[0].size()))
		return false;

	int x1 = static_cast<int>(x1f);
	int y1 = static_cast<int>(y1f);
	int x2 = static_cast<int>(x2f);
	int y2 = static_cast<int>(y2f);

	auto isBlocked = [&](int y, int x)
	{
		char c = plan[y][x];
		return (c == '1' || c == 'E');
	};

	return (!isBlocked(y1, x1) && !isBlocked(y1, x2) &&
			!isBlocked(y2, x1) && !isBlocked(y2, x2));
}

void	Mob::move(std::vector<std::string> const &map, float px, float py, float scaleX, float scaleY)
{
	float dx = px - this->_x;
	float dy = py - this->_y;
	float len = sqrt(dx * dx + dy * dy);
	if (len > 0.00001f)
	{
		dx /= len;
		dy /= len;
	}
	float stepX = dx * scaleX;
	float stepY = dy * scaleY;

	if (checkWallHitBox2(map, this->_wallHitBox, stepX, stepY))
	{
		this->_x += stepX;
		this->_y += stepY;
	}
	else
	{
		if (checkWallHitBox2(map, this->_wallHitBox, stepX, 0.0f))
			this->_x += stepX;

		if (checkWallHitBox2(map, this->_wallHitBox, 0.0f, stepY))
			this->_y += stepY;
	}
}

void Mob::moveDodge(std::vector<std::string> const &map, float px, float py, float scaleX, float scaleY)
{
	float rx = this->_x - px;
	float ry = this->_y - py;

	float len = sqrt(rx * rx + ry * ry);
	if (len < 0.00001f)
		return ;

	rx /= len;
	ry /= len;

	// vecteur tangent (anti-horaire)
	float tx = -ry;
	float ty = rx;

	float stepX = tx * scaleX;
	float stepY = ty * scaleY;


	if (checkWallHitBox2(map, this->_wallHitBox, stepX, stepY))
	{
		this->_x += stepX;
		this->_y += stepY;
	}
	else
	{
		if (checkWallHitBox2(map, this->_wallHitBox, stepX, 0.0f))
			this->_x += stepX;
		if (checkWallHitBox2(map, this->_wallHitBox, 0.0f, stepY))
			this->_y += stepY;
	}
}


static void changeMobAction(Mob &mob)
{
	int dir;
	switch (rand() % 2)
	{
		case 0:
			mob.setState(MOB_IDLE);
			break;
		case 1:
			mob.setState(MOB_WALKING);
			dir = rand() % 4;
			mob.updateDirWalk(dir);
			if (dir == 1)
				mob.updateLastDir(0);
			else if (dir == 3)
				mob.updateLastDir(1);
			break;
	}
}

bool equal2(float a, float b)
{
	return std::fabs(a - b) < 0.005f;
}

bool reached(float x, float y, float tx, float ty, float threshold = 0.1f)
{
    float dx = x - tx;
    float dy = y - ty;
    return (dx*dx + dy*dy) < (threshold * threshold);
}

void	Mob::wanderingRoutine(std::vector<std::string> const &map)
{
	float x = this->_x;
	float y = this->_y;

	if (this->_state == MOB_CHASE_LAST)
	{
		this->_lastX = this->_x;
		this->_lastY = this->_y;
		this->move(map, this->_lastPlayerX, this->_lastPlayerY, 0.20f, 0.20f);

		if (reached(this->_x, this->_y, this->_lastPlayerX, this->_lastPlayerY)
			|| reached(this->_x, this->_y, this->_lastX, this->_lastY))
		{
			this->_lastPlayerX = -1;
			this->_lastPlayerY = -1;
			this->_state = MOB_IDLE;
		}

		return ;
	}

	if (this->getTimeLastAction() > 1)
		changeMobAction(*this);

	if (this->getState() == MOB_WALKING)
	{
		switch (this->_dirWalk)
		{
			case 0:
				y -= 0.1;
				if (y < 0 || !checkWallHitBox(map, this->_wallHitBox, 0, 0.1, 0.1))
				{
					changeMobAction(*this);
					return ;
				}
				break;
			case 1:
				x += 0.1;
				if (x >= map[y].size() || !checkWallHitBox(map, this->_wallHitBox, 3, 0.1, 0.1))
				{
					changeMobAction(*this);
					return ;
				}
				break;
			case 2:
				y += 0.1;
				if (y >= map.size() || !checkWallHitBox(map, this->_wallHitBox, 2, 0.1, 0.1))
				{
					changeMobAction(*this);
					return ;
				}
				break;
			case 3 :
				x -= 0.1;
				if (x < 0 || !checkWallHitBox(map, this->_wallHitBox, 1, 0.1, 0.1))
				{
					changeMobAction(*this);
					return ;
				}
				break;
		}
		this->setPos(x,y);
	}
}

void	Mob::attack(Player &player)
{
	HitBox	&box = player.getHitBox();

	this->_box.updateAtkHitBox();
	if (this->_state != MOB_ATTACKING)
		this->setState(MOB_ATTACKING);

	//NERFED, TOO HARD
	if (this->getTimeLastAction() <= 0.05f && !this->_isInvinsible) //<- from 0.1f to 0.05f
		this->_isInvinsible = true;
	else if (this->getTimeLastAction() > 0.05f && this->_isInvinsible) //<- from 0.1f to 0.05f
		this->_isInvinsible = false;
	if (this->getTimeLastAction() <= 0.3f)
	//----------------
		return ;
	box.updateHurtBox();
	if (!player.checkInvinsibleFrame() && box.isDmgHit(this->_box.getAtkHitBox()))
	{
		player.setHp(player.getHp() - 1);
		player.startInvinsibleFrame();
		std::cout << player.getHp() << std::endl;
		if (player.getHp() <= 0)
		{
			player.dieAction();
			return ;
		}
	}
}

void	Mob::chasingRoutine(Player &player, std::vector<std::string> const &map)
{
	if (this->_state == MOB_HURT)
	{
		float scale = -0.25f * (1.f - (this->getTimeLastAction() / 0.5));
		this->move(map, player.getX(), player.getY(), scale, scale);
		if (this->getTimeLastAction() > 0.5)
			this->setState(MOB_IDLE);
		return ;
	}
	if (this->_state == MOB_ATTACKING)
	{
		this->attack(player);
		if (this->getTimeLastAction() > 0.4)
			this->_state = MOB_WALKING;
		return ;
	}
	if (this->isInSight(player, map))
	{
		if (dist(player.getX(), player.getY(), *this) > 1.2)
		{
			if (this->_state != MOB_RUNNING)
				this->_state = MOB_RUNNING;
			float dx = player.getX() - this->_x;
			float dy = player.getY() - this->_y;
			if (std::fabs(dy) > std::fabs(dx))
			{
				if (dy >= 0)
					this->_last_dir = 3;
				else
					this->_last_dir = 2;
			}
			else
			{
				if (dx >= 0)
					this->_last_dir = 0;
				else
					this->_last_dir = 1;
			}
			this->_lastPlayerX = player.getX();
			this->_lastPlayerY = player.getY();
			this->_lastX = this->_x;
			this->_lastY = this->_y;
			this->move(map, player.getX(), player.getY(), 0.22f, 0.22f);
			if (equal2(this->_x, this->_lastX) && equal2(this->_y, this->_lastY))
			{
				this->setState(MOB_IDLE);
				this->_routine = MOB_WANDERING;
			}
		}
		else if (this->getTimeLastAction() > 0.8 || this->_state == MOB_RUNNING)
			this->attack(player);
	}
	else
	{
		this->_routine = MOB_WANDERING;
		this->_state = MOB_CHASE_LAST;
	}
}

bool Mob::isInSight(Player &player, std::vector<std::string> const &map)
{
	float mx = this->_x, my = this->_y;
	float dx = player.getX() - mx;
	float dy = player.getY() - my;

	float steps = std::max(std::fabs(dx), std::fabs(dy));
	if (steps < 0.0001f)
		return true;

	float incX = dx / steps;
	float incY = dy / steps;

	for (int i = 0; i <= static_cast<int>(steps); i++)
	{
		int ix = static_cast<int>(mx);
		int iy = static_cast<int>(my);

		if (iy < 0 || iy >= static_cast<int>(map.size()))
			return false;
		if (ix < 0 || ix >= static_cast<int>(map[0].size()))
			return false;

		char c = map[iy][ix];
		if (c == '1' || c == 'E')
			return false;

		mx += incX;
		my += incY;
	}
	return true;
}

float	dist(float px, float py, Mob const &mob)
{
	float x = px - mob.getX();
	float y = py - mob.getY();
	return (sqrt(x * x + y * y));
}

void	Mob::dodge(Player &player, std::vector<std::string> const &map)
{
	if (this->getTimeLastAction() > 0.35f)
	{
		this->setState(MOB_WALKING);
		this->_routine = MOB_CHASING;
		this->_lastPlayerX = player.getX();
		this->_lastPlayerY = player.getY();
		return ;
	}
	this->moveDodge(map, player.getX(), player.getY(), -0.3f, -0.3f);
}

void	Mob::MobAction(Player &player, std::vector<std::string> const &map)
{
	this->setWallHitBox();


	if (this->_state == MOB_DODGE)
	{
		dodge(player, map);
		return ;
	}

	if (this->_routine == MOB_WANDERING && player.getX() >= 0 && player.getY() >= 0
			&& dist(player.getX(), player.getY(), *this) < 4.f && isInSight(player, map))
		this->_routine = MOB_CHASING;

	if (this->_routine == MOB_WANDERING)
		wanderingRoutine(map);
	if (this->_routine == MOB_CHASING)
		chasingRoutine(player, map);
}
