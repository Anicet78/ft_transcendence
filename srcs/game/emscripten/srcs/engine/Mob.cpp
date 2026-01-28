#include "Mob.hpp"

std::map<int, SDL_Rect>	Mob::_mobWalk;
std::map<int, SDL_Rect>	Mob::_mobAttack;
std::map<int, SDL_Rect>	Mob::_mobIdle;
std::map<int, SDL_Rect>	Mob::_mobHurt;

SDL_Texture	*Mob::_mobWalkText;
SDL_Texture	*Mob::_mobAttackText;
SDL_Texture	*Mob::_mobIdleText;
SDL_Texture	*Mob::_mobHurtText;

int						Mob::_walkImgW;
int						Mob::_walkImgH;

int						Mob::_atkImgW;
int						Mob::_atkImgH;

int						Mob::_idleImgW;
int						Mob::_idleImgH;

int						Mob::_hurtImgW;
int						Mob::_hurtImgH;

Mob::Mob(int id, float x, float y, int hp) : _id(id), _x(x), _y(y), _screenX(0), _screenY(0), _hp(hp), _last_dir(0), _frame(0), _isInvinsible(false), _isDead(false), _tookDamage(false) {
	return ;
}

Mob::~Mob(void) {

}

//------------------------assets importation related---------------------

void	Mob::importMobsWalkAssets(int tile_size) {

	_mobWalkText = loadTexture("assets/sprite/Orc-Walk.bmp", _walkImgW, _walkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _walkImgH)
	{
		int x = 0;
		while (x * tile_size < _walkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobWalk.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsIdleAssets(int tile_size) {

	_mobIdleText = loadTexture("assets/sprite/Orc-Idle.bmp", _idleImgW, _idleImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _idleImgH)
	{
		int x = 0;
		while (x * tile_size < _idleImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobIdle.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsAttackAssets(int tile_size) {

	_mobAttackText = loadTexture("assets/sprite/Orc-Attack01.bmp", _atkImgW, _atkImgH);

	//define every tile asset position and stock it in _mapAssets
	int y = 0;
	int i = 0;
	while (y * tile_size < _atkImgH)
	{
		int x = 0;
		while (x * tile_size < _atkImgW)
		{
			SDL_Rect rect = {x * tile_size, y * tile_size, tile_size, tile_size};
			_mobAttack.emplace(i, rect);
			i++;
			x++;
		}
		y++;
	}
}

void	Mob::importMobsHurtAssets(int tile_size) {

	_mobHurtText = loadTexture("assets/sprite/Orc-Hurt.bmp", _hurtImgW, _hurtImgH);

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

void	Mob::importMobsAssets(int tile_size)
{
	importMobsIdleAssets(tile_size);
	importMobsWalkAssets(tile_size);
	importMobsAttackAssets(tile_size);
	importMobsHurtAssets(tile_size);
	return ;
}

//-----------------------------------------------------------------------

//----------------------------setter-------------------------------------

void	Mob::setPos(float x, float y) {
	_x = x;
	_y = y;
	return ;
}

void	Mob::setHp(int hp) {
	_hp = hp;
	return ;
}

float	Mob::getX(void) const {
	return (_x);
}

float	Mob::getY(void) const {
	return (_y);
}

int		Mob::getHp(void) const {
	return (_hp);
}

int		Mob::getLastDir(void) const {
	return (_last_dir);
}

float	Mob::getScreenX(void) const {
	return (_screenX);
}

float	Mob::getScreenY(void) const {
	return (_screenY);
}

int		Mob::getFrame(void) const {
	return (_frame);
}

//-----------------------------------------------------------------------

void	Mob::updateScreenPos(float camX, float camY, int tile_s) {
	_screenX = (_x - camX) * tile_s;
	_screenY = (_y - camY) * tile_s;
	return ;
}

void	Mob::startInvinsibleFrame(void) {
	this->_isInvinsible = true;
	this->_frame = -1;
}

void	Mob::endInvinsibleFrame(void) {
	this->_isInvinsible = false;
	this->_frame = 0;
}

bool	Mob::checkInvinsibleFrame(void) {
	return (this->_isInvinsible);
}

//-------------printer and render----------------------------------------

void	Mob::printMob(float camX, float camY, int tile_size) {

	if (this->_frame >= 24)
		this->_frame = 0;

	float x = ((this->_x - camX) * tile_size) - (0.5f * tile_size);
	float y = ((this->_y - camY) * tile_size) - (0.5f * tile_size);
	if (checkInvinsibleFrame())
		this->rendMobHurt(x, y, this->_frame / 4, 2);
	else
		this->rendMobIdle(x, y, this->_frame / 4, 2);
	this->_frame++;
	return ;
}

void	Mob::rendMobWalk(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _walkImgW, _walkImgH};
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
}

void	Mob::rendMobIdle(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _idleImgW, _idleImgH};
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
}

void	Mob::rendMobAttack(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _atkImgW, _atkImgH};
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
}

void	Mob::rendMobHurt(int x, int y, int assetIndex, float scale) {
	if (assetIndex < 0) {
		std::cerr << "Invalid index" << std::endl;
		return ;
	}
	if (scale <= 0) {
		std::cerr << "Invalid scale" << std::endl;
		return ;
	}

	SDL_Rect	renderRect = {x - 84, y - 84, _hurtImgW, _hurtImgH};
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
}

//-----------------------------------------------------------------------

//-------------Mob death  flag----------------

void	Mob::setIsDead(bool value) {
	this->_isDead = value;
}

bool	Mob::isDead(void) const {
	return (this->_isDead);
}

//-----------------------------------------------------------------------

//-------------Mob take damage flag----------------

void	Mob::damaged(bool value) {
	this->_tookDamage = value;
}

bool	Mob::isDamaged(void) const {
	return (this->_tookDamage);
}

//-----------------------------------------------------------------------