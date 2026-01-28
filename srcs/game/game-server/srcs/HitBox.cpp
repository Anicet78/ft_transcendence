#include"HitBox.hpp"

HitBox::HitBox(float &x, float &y, int &last_dir) : _atkHitBox({0, 0, 0, 0}), _hurtBox({0, 0, 0, 0}), _atkActive(false), _tile_s(32), _x(x), _y(y), _last_dir(last_dir) {
	(void)_atkActive;
	return ;
}

HitBox::~HitBox(void) {
	return ;
}

FRect	&HitBox::getAtkHitBox(void) {
	return (_atkHitBox);
}

FRect	&HitBox::getDmgHitBox(void) {
	return (_hurtBox);
}

void	HitBox::updateAtkHitBox(void) {
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

void	HitBox::updateHurtBox(void) {
	_hurtBox.x = (_x - 0.3f) * _tile_s;
	_hurtBox.y = (_y - 0.4f) * _tile_s;
	_hurtBox.w = 0.6f * _tile_s;
	_hurtBox.h = 0.8f * _tile_s;
}


// //only SDL_PointInRect exist in sdl lib idk why so im doing my own with float ¯\_(ツ)_/¯
// bool	FPointInFRect(FPoint *point, FRect const *rect) {
// 	return ( (point->x >= rect->x) && (point->x < (rect->x + rect->w)) &&
// 			(point->y >= rect->y) && (point->y < (rect->y + rect->h)) ) ? true : false;
// }

// bool	HitBox::isDmgHit(FRect &rect) const {

// 	//check if rect top left corner if in _hurtBox
// 	FPoint top_left = {
// 		rect.x,
// 		rect.y
// 	};
// 	if (FPointInFRect(&top_left, &_hurtBox))
// 		return (true);

// 	FPoint mid_top = {
// 		rect.x + (rect.w / 2),
// 		rect.y
// 	};
// 	if (FPointInFRect(&mid_top, &_hurtBox))
// 		return (true);
// 	//check if rect top right corner if in _hurtBox
// 	FPoint top_right = {
// 		rect.x + rect.w,
// 		rect.y
// 	};
// 	if (FPointInFRect(&top_right, &_hurtBox))
// 		return (true);
	
// 	FPoint mid_right = {
// 		rect.x + rect.w,
// 		rect.y + (rect.h / 2)
// 	};
// 	if (FPointInFRect(&mid_right, &_hurtBox))
// 		return (true);

// 	//check if rect down left corner if in _hurtBox
// 	FPoint down_left = {
// 		rect.x,
// 		rect.y + rect.h
// 	};
// 	if (FPointInFRect(&down_left, &_hurtBox))
// 		return (true);

// 	FPoint mid_down = {
// 		rect.x + (rect.w / 2),
// 		rect.y + rect.h
// 	};
// 	if (FPointInFRect(&mid_down, &_hurtBox))
// 		return (true);

// 	//check if rect down right corner if in _hurtBox
// 	FPoint down_right = {
// 		rect.x + rect.w,
// 		rect.y + rect.h
// 	};
// 	if (FPointInFRect(&down_right, &_hurtBox))
// 		return (true);

// 	FPoint mid_left = {
// 		rect.x,
// 		rect.y + (rect.h / 2)
// 	};
// 	if (FPointInFRect(&mid_left, &_hurtBox))
// 		return (true);

// 	FPoint center = {
// 		rect.x + (rect.w / 2),
// 		rect.y + (rect.h / 2)
// 	};
// 	if (FPointInFRect(&center, &_hurtBox))
// 		return (true);
// 	return (false);
// }

bool	HitBox::isDmgHit(FRect &rect) const {
	if (_hurtBox.x < rect.x + rect.w && _hurtBox.x + _hurtBox.w > rect.x
		&& _hurtBox.y < rect.y + rect.h && _hurtBox.y + _hurtBox.h > rect.y)
		return (true);
	return (false);
} 