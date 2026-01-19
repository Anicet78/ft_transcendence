#include<HitBox.hpp>

HitBox::HitBox(float &playerX, float &playerY, float &screenX, float &screenY, int last_dir) : _atkActive(false), _playerX(playerX), _playerY(playerY), _screenX(screenX), _screenY(screenY) {
	_tile_s = gSdl.getMapTileSize() * 2;
	_wallHitBox = {
		_screenX - 0.3f,
		_screenY + 0.1f,
		0.6f,
		0.2f
	};

	float	hitX = 1 - _screenX;
	float	hitY = _screenY;
	float	hitW = 0.6f;
	if (last_dir == 0)
		_atkHitBox = {
			hitX,
			hitY - (_tile_s / 2),
			_tile_s,
			_tile_s
		};
	else if (last_dir == 1)
		_atkHitBox = {
			hitX - _tile_s,
			hitY - (_tile_s / 2),
			_tile_s,
			_tile_s
		};

	_dmgHitBox = {
		hitX,
		hitY - 0.8f * _tile_s,
		hitW,
		1.3f * _tile_s
	};
	return ;
}

// HitBox::HitBox(float posX, float posY, int last_dir) :_atkActive(false) {
// 	_tile_s = gSdl.getMapTileSize() * 2;
// 	_wallHitBox = {
// 		posX - 0.3f
// 		, posY + 0.1f
// 		, 0.6f
// 		, 0.2f
// 	};

// 	if (last_dir == 0)
// 		_atkHitBox = {
// 			_wallHitBox.x + _wallHitBox.w,
// 			_wallHitBox.y - (_tile_s / 2),
// 			_tile_s,
// 			_tile_s
// 		};
// 	else if (last_dir == 1)
// 		_atkHitBox = {
// 			_wallHitBox.x - _tile_s,
// 			_wallHitBox.y - (_tile_s / 2),
// 			_tile_s,
// 			_tile_s
// 		};

// 	_dmgHitBox = {
// 		_wallHitBox.x,
// 		_wallHitBox.y - 0.8f * _tile_s,
// 		_wallHitBox.w,
// 		1.3f * _tile_s
// 	};
// 	return ;
// }

HitBox::~HitBox(void) {
	return ;
}

SDL_FRect	HitBox::getWallHitBox(void) {
	return(_wallHitBox);
}

SDL_FRect	HitBox::getAtkHitBox(void) {
	return (_atkHitBox);
}

SDL_FRect	HitBox::getDmgHitBox(void) {
	return (_dmgHitBox);
}

void	HitBox::updateHitBox(int last_dir) {
	_wallHitBox = {
		_playerX - 0.3f,
		_playerY + 0.1f,
		0.6f,
		0.2f
	};
	float	hitX = _screenX - (0.5 * _tile_s);
	float	hitY = _screenY - (0.5 * _tile_s);
	float	hitW = 0.8f * _tile_s;
	if (last_dir == 0)
		_atkHitBox = {
			hitX + hitW,
			hitY - 0.2f * _tile_s,
			_tile_s,
			1.3f * _tile_s
		};
	else if (last_dir == 1)
		_atkHitBox = {
			hitX - _tile_s,
			hitY - 0.2f * _tile_s,
			_tile_s,
			1.3f * _tile_s
		};

	_dmgHitBox = {
		hitX,
		hitY - 0.2f * _tile_s,
		1.2f * hitW,
		1.3f * _tile_s
	};
	return ;
}

//only SDL_PointInRect exist in sdl lib idk why so im doing my own with float ¯\_(ツ)_/¯
bool	SDL_FPointInFRect(SDL_FPoint *point, SDL_FRect const *rect) {
	return ( (point->x >= rect->x) && (point->x < (rect->x + rect->w)) &&
			(point->y >= rect->y) && (point->y < (rect->y + rect->h)) ) ? true : false;
}

// bool	HitBox::isDmgHit(SDL_FRect &rect) const {

// 	//check if rect top left corner if in _dmgHitBox
// 	SDL_FPoint top_left = {
// 		rect.x,
// 		rect.y
// 	};
// 	if (SDL_FPointInFRect(&top_left, &_dmgHitBox))
// 		return (true);

// 	//check if rect top right corner if in _dmgHitBox
// 	SDL_FPoint top_right = {
// 		rect.x + rect.w,
// 		rect.y
// 	};
// 	if (SDL_FPointInFRect(&top_right, &_dmgHitBox))
// 		return (true);

// 	//check if rect down left corner if in _dmgHitBox
// 	SDL_FPoint down_left = {
// 		rect.x,
// 		rect.y + rect.h
// 	};
// 	if (SDL_FPointInFRect(&down_left, &_dmgHitBox))
// 		return (true);

// 	//check if rect down right corner if in _dmgHitBox
// 	SDL_FPoint down_right = {
// 		rect.x + rect.w,
// 		rect.y + rect.h
// 	};
// 	if (SDL_FPointInFRect(&down_right, &_dmgHitBox))
// 		return (true);

// 	return (false);
// }

bool	HitBox::isDmgHit(SDL_FRect &rect) const {
	SDL_FPoint	rectTopRight = {
		rect.x + rect.w,
		rect.y
	};	//A2
	SDL_FPoint	rectDownLeft = {
		rect.x,
		rect.y + rect.h
	};	//A1

	SDL_FPoint	dmgTopRight {
		_dmgHitBox.x + _dmgHitBox.w,
		_dmgHitBox.y
	};	//B2
	SDL_FPoint	dmgDownLeft {
		_dmgHitBox.x,
		_dmgHitBox.y + _dmgHitBox.h
	};	//B1

	if (!(rectTopRight.x <= dmgDownLeft.x) || !(rectDownLeft.x >= dmgTopRight.x)
		|| !(rectTopRight.y <= dmgDownLeft.y) || !(rectDownLeft.y >= dmgTopRight.y))
		return (true);
	return (false);
}

void	HitBox::printHitBox(void) {
	(void)_atkActive;
	SDL_SetRenderDrawColor(gSdl.renderer, 0x00, 0xFF, 0x00, 0xFF);
	SDL_RenderDrawRectF(gSdl.renderer, &_wallHitBox);

	SDL_SetRenderDrawColor(gSdl.renderer, 0x00, 0x00, 0xFF, 0xFF);
	SDL_RenderDrawRectF(gSdl.renderer, &_atkHitBox);

	SDL_SetRenderDrawColor(gSdl.renderer, 0xFF, 0x00, 0x00, 0xFF);
	SDL_RenderDrawRectF(gSdl.renderer, &_dmgHitBox);
}