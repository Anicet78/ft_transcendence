#include<HitBox.hpp>

HitBox::HitBox(float &x, float &y, float &screenX, float &screenY, int &last_dir) : _wallHitBox({0, 0, 0, 0}), _atkHitBox({0, 0, 0, 0}), _hurtBox({0, 0, 0, 0}), _atkActive(false), _x(x), _y(y), _screenX(screenX), _screenY(screenY), _last_dir(last_dir) {
	_tile_s = gSdl.getMapTileSize() * 2;
	return ;
}

HitBox::~HitBox(void) {
	return ;
}

SDL_FRect	&HitBox::getWallHitBox(void) {
	return(_wallHitBox);
}

SDL_FRect	&HitBox::getAtkHitBox(void) {
	return (_atkHitBox);
}

SDL_FRect	&HitBox::getDmgHitBox(void) {
	return (_hurtBox);
}

void	HitBox::updateHitBox() {

	(void)_last_dir;
	//update wallHitBox :

	_wallHitBox.x = _x - 0.3f;
	_wallHitBox.y = _y + 0.1f;
	_wallHitBox.w = 0.6f;
	_wallHitBox.h = 0.2f;

	float	hitX = _screenX - (0.5 * _tile_s);
	float	hitY = (_screenY - (0.5 * _tile_s)) - 0.2f * _tile_s;
	float	hitW = 0.8f * _tile_s;


	// update atkhitbox

	if (_last_dir == 0)
	{
		_atkHitBox.x = hitX + hitW;
		_atkHitBox.y = hitY;
		_atkHitBox.w = _tile_s;
		_atkHitBox.h = 1.3f * _tile_s;

	}
	else
	{
		_atkHitBox.x = hitX - _tile_s;
		_atkHitBox.y = hitY;
		_atkHitBox.w = _tile_s;
		_atkHitBox.h = 1.3f * _tile_s;
	}

	//update hurtbox
	_hurtBox.x = hitX;
	_hurtBox.y = hitY;
	_hurtBox.w = 1.2f * hitW;
	_hurtBox.h = 1.3f * _tile_s;
	return ;
}

//only SDL_PointInRect exist in sdl lib idk why so im doing my own with float ¯\_(ツ)_/¯
bool	SDL_FPointInFRect(SDL_FPoint *point, SDL_FRect const *rect) {
	return ( (point->x >= rect->x) && (point->x < (rect->x + rect->w)) &&
			(point->y >= rect->y) && (point->y < (rect->y + rect->h)) ) ? true : false;
}

bool	HitBox::isDmgHit(SDL_FRect &rect) const {

	//check if rect top left corner if in _hurtBox
	SDL_FPoint top_left = {
		rect.x,
		rect.y
	};
	if (SDL_FPointInFRect(&top_left, &_hurtBox))
		return (true);

	//check if rect top right corner if in _hurtBox
	SDL_FPoint top_right = {
		rect.x + rect.w,
		rect.y
	};
	if (SDL_FPointInFRect(&top_right, &_hurtBox))
		return (true);

	//check if rect down left corner if in _hurtBox
	SDL_FPoint down_left = {
		rect.x,
		rect.y + rect.h
	};
	if (SDL_FPointInFRect(&down_left, &_hurtBox))
		return (true);

	//check if rect down right corner if in _hurtBox
	SDL_FPoint down_right = {
		rect.x + rect.w,
		rect.y + rect.h
	};
	if (SDL_FPointInFRect(&down_right, &_hurtBox))
		return (true);

	return (false);
}

void	HitBox::printHitBox(void) {
	(void)_atkActive;
	// SDL_SetRenderDrawColor(gSdl.renderer, 0x00, 0xFF, 0x00, 0xFF);
	// SDL_FRect wall = {_wallHitBox.x * _tile_s, _wallHitBox.y * _tile_s, _wallHitBox.w * _tile_s, _wallHitBox.h * _tile_s};
	// SDL_RenderDrawRectF(gSdl.renderer, &wall);

	SDL_SetRenderDrawColor(gSdl.renderer, 0xFF, 0x00, 0x00, 0xFF);
	SDL_RenderDrawRectF(gSdl.renderer, &_hurtBox);

	if (_atkHitBox.x && _atkHitBox.y && _atkHitBox.w && _atkHitBox.h)
	{
		SDL_SetRenderDrawColor(gSdl.renderer, 0x00, 0x00, 0xFF, 0xFF);
		SDL_RenderDrawRectF(gSdl.renderer, &_atkHitBox);
	}
}