#include<HitBox.hpp>

HitBox::HitBox(float &x, float &y, float &screenX, float &screenY, int &last_dir) : _atkHitBox({0, 0, 0, 0}), _hurtBox({0, 0, 0, 0}), _atkActive(false), _x(x), _y(y), _screenX(screenX), _screenY(screenY), _last_dir(last_dir) {
	(void)x;
	(void)y;
	(void)_screenX;
	(void)_screenY;
	_tile_s = gSdl.getMapTileSize() * 2;
	return ;
}

HitBox::~HitBox(void) {
	return ;
}

SDL_FRect	&HitBox::getAtkHitBox(void) {
	return (_atkHitBox);
}

SDL_FRect	&HitBox::getDmgHitBox(void) {
	return (_hurtBox);
}

void	HitBox::updateHitBox(void) {
	_hurtBox.x = (_x - 0.3f) * _tile_s;
	_hurtBox.y = (_y - 0.4f) * _tile_s;
	_hurtBox.w = 0.6f * _tile_s;
	_hurtBox.h = 0.8f * _tile_s;

	if (_last_dir == 0)
	{
		_atkHitBox.x = (_x + 0.1f) * _tile_s;
		_atkHitBox.y = (_y - 0.5f) * _tile_s;
		_atkHitBox.w = 1.2f * _tile_s;
		_atkHitBox.h = 1.f * _tile_s;
	}
	else
	{
		_atkHitBox.x = (_x - 1.4f) * _tile_s;
		_atkHitBox.y = (_y - 0.5f) * _tile_s;
		_atkHitBox.w = 1.2f * _tile_s;
		_atkHitBox.h = 1.f * _tile_s;
	}
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
	float	hitX = _screenX;
	float	hitY = _screenY;


	SDL_FRect	atk;
	SDL_FRect	hurt;

	hurt.x = hitX - (0.3f * _tile_s);
	hurt.y = hitY - (0.4f * _tile_s);
	hurt.w = 0.6f * _tile_s;
	hurt.h = 0.8f * _tile_s;

	if (_last_dir == 0)
	{
		atk.x = hitX + (0.1f * _tile_s);
		atk.y = hitY - (0.5f * _tile_s);
		atk.w = 1.2f * _tile_s;
		atk.h = 1.f * _tile_s;
	}
	else
	{
		atk.x = hitX - (1.4f * _tile_s);
		atk.y = hitY - (0.5f * _tile_s);
		atk.w = 1.2f * _tile_s;
		atk.h = 1.f * _tile_s;
	}

	SDL_SetRenderDrawColor(gSdl.renderer, 0xFF, 0x00, 0x00, 0xFF);
	SDL_RenderDrawRectF(gSdl.renderer, &hurt);

	SDL_SetRenderDrawColor(gSdl.renderer, 0x00, 0x00, 0xFF, 0xFF);
	SDL_RenderDrawRectF(gSdl.renderer, &atk);
}