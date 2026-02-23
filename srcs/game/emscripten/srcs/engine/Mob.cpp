#include "Mob.hpp"

std::unordered_map<int, SDL_Rect>	Mob::_mobWalk;
std::unordered_map<int, SDL_Rect>	Mob::_mobAttack;
std::unordered_map<int, SDL_Rect>	Mob::_mobIdle;
std::unordered_map<int, SDL_Rect>	Mob::_mobHurt;
std::unordered_map<int, SDL_Rect>	Mob::_mobDeath;
std::unordered_map<int, SDL_Rect>	Mob::_mobAttackFront;
std::unordered_map<int, SDL_Rect>	Mob::_mobAttackBack;

SDL_Texture	*Mob::_mobWalkText;
SDL_Texture	*Mob::_mobAttackText;
SDL_Texture	*Mob::_mobIdleText;
SDL_Texture	*Mob::_mobHurtText;
SDL_Texture	*Mob::_mobDeathText;
SDL_Texture	*Mob::_mobAttackFrontText;
SDL_Texture	*Mob::_mobAttackBackText;

int						Mob::_walkImgW;
int						Mob::_walkImgH;

int						Mob::_atkImgW;
int						Mob::_atkImgH;

int						Mob::_idleImgW;
int						Mob::_idleImgH;

int						Mob::_hurtImgW;
int						Mob::_hurtImgH;

int						Mob::_deathImgW;
int						Mob::_deathImgH;

int						Mob::_atkFrontImgW;
int						Mob::_atkFrontImgH;

int						Mob::_atkBackImgW;
int						Mob::_atkBackImgH;

Mob::Mob(int id, float x, float y, int hp) : _id(id), _x(x), _y(y),
		_screenX(0), _screenY(0), _hp(hp), _last_dir(0), _anim(MOB_IDLE),
		_prev_state(MOB_IDLE), _frame(0), _isDead(false), _inDeathAnimation(false)
{
	(void)_id;
}

Mob::~Mob(void)
{
	SDL_DestroyTexture(_mobWalkText);
	SDL_DestroyTexture(_mobIdleText);
	SDL_DestroyTexture(_mobDeathText);
	SDL_DestroyTexture(_mobHurtText);
	SDL_DestroyTexture(_mobAttackText);
	SDL_DestroyTexture(_mobAttackFrontText);
	SDL_DestroyTexture(_mobAttackBackText);
}

//------------------------assets importation related---------------------

void	Mob::importMobsWalkAssets(int tile_size)
{
	_mobWalkText = loadTexture("assets/sprite/mobs/Orc-Walk.bmp", _walkImgW, _walkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _walkImgH)
	{
		int x = 0;
		while (x * tile_size < _walkImgW)
		{
			SDL_Rect rect =
			{x * tile_size, y * tile_size, tile_size, tile_size};
			_mobWalk.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsIdleAssets(int tile_size)
{
	_mobIdleText = loadTexture("assets/sprite/mobs/Orc-Idle.bmp", _idleImgW, _idleImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _idleImgH)
	{
		int x = 0;
		while (x * tile_size < _idleImgW)
		{
			SDL_Rect rect =
			{x * tile_size, y * tile_size, tile_size, tile_size};
			_mobIdle.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsAttackAssets(int tile_size)
{
	_mobAttackText = loadTexture("assets/sprite/mobs/Orc-Attack01.bmp", _atkImgW, _atkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkImgH)
	{
		int x = 0;
		while (x * tile_size < _atkImgW)
		{
			SDL_Rect rect =
			{x * tile_size, y * tile_size, tile_size, tile_size};
			_mobAttack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsHurtAssets(int tile_size)
{

	_mobHurtText = loadTexture("assets/sprite/mobs/Orc-Hurt.bmp", _hurtImgW, _hurtImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _hurtImgH)
	{
		int x = 0;
		while (x * tile_size < _hurtImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobHurt.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsDeathAssets(int tile_size)
{

	_mobDeathText = loadTexture("assets/sprite/mobs/Orc-Death.bmp", _deathImgW, _deathImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _deathImgH)
	{
		int x = 0;
		while (x * tile_size < _deathImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobDeath.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsFrontAttackAssets(int tile_size)
{
	_mobAttackFrontText = loadTexture("assets/sprite/mobs/Orc-Attack-Front.bmp", _atkFrontImgW, _atkFrontImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkFrontImgH)
	{
		int x = 0;
		while (x * tile_size < _atkFrontImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobAttackFront.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}
void	Mob::importMobsBackAttackAssets(int tile_size)
{
	_mobAttackBackText = loadTexture("assets/sprite/mobs/Orc-Attack-Back.bmp", _atkBackImgW, _atkBackImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkBackImgH)
	{
		int x = 0;
		while (x * tile_size < _atkBackImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobAttackBack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsAssets(int tile_size)
{
	importMobsIdleAssets(tile_size);
	importMobsWalkAssets(tile_size);
	importMobsAttackAssets(tile_size);
	importMobsHurtAssets(tile_size);
	importMobsDeathAssets(tile_size);
	importMobsFrontAttackAssets(tile_size);
	importMobsBackAttackAssets(tile_size);
	return ;
}

//-----------------------------------------------------------------------

//----------------------------setter-------------------------------------

void	Mob::setPos(float x, float y)
{
	_x = x;
	_y = y;
	return ;
}

void	Mob::setAnim(int anim)
{
	this->_anim = anim;
}

void	Mob::setHp(int hp)
{
	_hp = hp;
	return ;
}

void	Mob::updateLastDir(int dir)
{
	this->_last_dir = dir;
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

int		Mob::getLastDir(void) const
{
	return (_last_dir);
}

int		Mob::getAnim(void) const
{
	return this->_anim;
}

float	Mob::getScreenX(void) const
{
	return (_screenX);
}

float	Mob::getScreenY(void) const
{
	return (_screenY);
}

int		Mob::getFrame(void) const
{
	return (_frame);
}

bool	Mob::getInDeathAnim(void) const
{
	return (_inDeathAnimation);
}

//-----------------------------------------------------------------------

void	Mob::updateScreenPos(float camX, float camY, int tile_s)
{
	_screenX = (_x - camX) * tile_s;
	_screenY = (_y - camY) * tile_s;
	return ;
}

//-------------printer and render----------------------------------------

// void	Mob::printMob(float camX, float camY, int tile_size, int flag)
// {
// 	if (!flag && this->_frame >= 24)
// 		this->_frame = 0;
// 	float x = ((this->_x - camX) * tile_size) - (0.5f * tile_size);
// 	float y = ((this->_y - camY) * tile_size) - (0.5f * tile_size);
// 	if (checkInvinsibleFrame())
// 		this->rendMobHurt(x, y, this->_frame / 4, 2, flag);
// 	else
// 		this->rendMobIdle(x, y, this->_frame / 4, 2, flag);
// 	if (!flag)
// 		this->_frame++;
// 	return ;
// }

void	Mob::printMob(float camX, float camY, int tile_size, int flag)
{
	float x = ((this->_x - camX) * tile_size) - (0.5f * tile_size);
	float y = ((this->_y - camY) * tile_size) - (0.5f * tile_size);

	if (this->_anim == MOB_IDLE)
	{
		if (!flag && this->_prev_state != MOB_IDLE)
		{
			this->_frame = 0;
			this->_prev_state = MOB_IDLE;
		}
		if (!flag && this->_frame >= 24)
			this->_frame = 0;
		int frame = (flag) ? ((!this->_frame) ? 23 : this->_frame - 1) : this->_frame;
		this->rendMobIdle(x, y, frame / 4, 2, flag);
	}
	else if (this->_anim == MOB_WALKING)
	{
		if (!flag && this->_prev_state != MOB_WALKING)
		{
			this->_frame = 0;
			this->_prev_state = MOB_WALKING;
		}
		if (!flag && this->_frame >= 32)
			this->_frame = 0;
		int frame = (flag) ? ((!this->_frame) ? 31 : this->_frame - 1) : this->_frame;
		this->rendMobWalk(x, y, frame / 4, 2, flag);
	}
	else if (this->_anim == MOB_ATTACKING)
	{
		if (!flag && this->_prev_state != MOB_ATTACKING)
		{
			this->_frame = 0;
			this->_prev_state = MOB_ATTACKING;
		}
		if (!flag && this->_frame >= 24)
			this->_frame = 0;
		int frame = (flag) ? ((!this->_frame) ? 23 : this->_frame - 1) : this->_frame;
		this->rendMobAttack(x, y, frame / 4, 2, flag);
	}
	else if (this->_anim == MOB_HURT)
	{
		if (!flag && this->_prev_state != MOB_HURT)
		{
			this->_frame = 0;
			this->_prev_state = MOB_HURT;
		}
		if (!flag && this->_frame >= 32)
			this->_frame = 0;
		int frame = (flag) ? ((!this->_frame) ? 31 : this->_frame - 1) : this->_frame;
		this->rendMobHurt(x, y, frame / 8, 2, flag);
	}
	else if (this->_anim == MOB_DEATH)
	{
		if (!flag && this->_prev_state != MOB_DEATH)
		{
			this->_frame = 0;
			this->_prev_state = MOB_DEATH;
		}
		if (!flag && this->_frame >= 32)
		{
			this->_inDeathAnimation = false;
			this->_frame = 0;
		}
		int frame = (flag) ? ((!this->_frame) ? 31 : this->_frame - 1) : this->_frame;
		this->rendMobDeath(x, y, frame / 8, 2, flag);
	}
	if (!flag)
		this->_frame++;
	return ;
}

void	Mob::rendMobWalk(int x, int y, int assetIndex, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobWalkText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobWalkText, 128);
	}
	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _walkImgW, _walkImgH};
	SDL_Rect	*rect = &_mobWalk[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobWalkText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobWalkText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobWalkText, 255);
}

void	Mob::rendMobIdle(int x, int y, int assetIndex, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobIdleText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobIdleText, 128);
	}

	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _idleImgW, _idleImgH};
	SDL_Rect	*rect = &_mobIdle[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobIdleText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobIdleText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobIdleText, 255);
}

void	Mob::rendMobAttack(int x, int y, int assetIndex, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobAttackText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobAttackText, 128);
	}

	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _atkImgW, _atkImgH};
	SDL_Rect	*rect = &_mobAttack[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobAttackText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobAttackText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobAttackText, 255);
}

void	Mob::rendMobHurt(int x, int y, int assetIndex, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobHurtText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobHurtText, 128);
	}

	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _hurtImgW, _hurtImgH};
	SDL_Rect	*rect = &_mobHurt[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobHurtText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobHurtText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobHurtText, 255);
}

void	Mob::rendMobDeath(int x, int y, int assetIndex, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobDeathText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobDeathText, 128);
	}

	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _deathImgW, _deathImgH};
	SDL_Rect	*rect = &_mobDeath[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobDeathText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobDeathText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobDeathText, 255);
}

void	Mob::rendMobAttackFront(int x, int y, int index, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobAttackFrontText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobAttackFrontText, 128);
	}

	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _atkFrontImgW, _atkFrontImgH};
	SDL_Rect	*rect = &_mobAttackFront[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobAttackFrontText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobAttackFrontText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobAttackFrontText, 255);
}

void	Mob::rendMobAttackBack(int x, int y, int index, float scale, int flag)
{
	if (flag)
	{
		SDL_SetTextureBlendMode(_mobAttackBackText, SDL_BLENDMODE_BLEND);
		SDL_SetTextureAlphaMod(_mobAttackBackText, 128);
	}

	if (assetIndex < 0)
	{
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0)
	{
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect =
	{x - 84, y - 84, _atkBackImgW, _atkBackImgH};
	SDL_Rect	*rect = &_mobAttackBack[assetIndex];

	if (rect != NULL)
	{
		renderRect.w = rect->w * scale;
		renderRect.h = rect->h * scale;
	}

	if (!_last_dir)
		SDL_RenderCopy(gSdl.renderer, _mobAttackBackText, rect, &renderRect);
	else
		SDL_RenderCopyEx(gSdl.renderer, _mobAttackBackText, rect, &renderRect, 0, NULL, SDL_FLIP_HORIZONTAL);
	if (flag)
		SDL_SetTextureAlphaMod(_mobAttackBackText, 255);
}

//-----------------------------------------------------------------------

//-------------Mob death  flag----------------

void	Mob::setIsDead(bool value)
{
	this->_isDead = value;
}

void	Mob::setInDeathAnim(bool value)
{
	this->_inDeathAnimation = value;
}

bool	Mob::isDead(void) const
{
	return (this->_isDead);
}

//-----------------------------------------------------------------------