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
	else if (_last_dir == 1)
	{
		_atkHitBox.x = (_x - 1.4f) * _tile_s;
		_atkHitBox.y = (_y - 0.5f) * _tile_s;
		_atkHitBox.w = 1.2f * _tile_s;
		_atkHitBox.h = 1.f * _tile_s;
	}
	else if (_last_dir == 2)
	{
		_atkHitBox.x = (_x - 0.7f) * _tile_s;
		_atkHitBox.y = (_y - 1.0f) * _tile_s;
		_atkHitBox.w = 1.4f * _tile_s;
		_atkHitBox.h = 1.0f * _tile_s;
	}
	else if (_last_dir == 3)
	{
		_atkHitBox.x = (_x - 0.7f) * _tile_s;
		_atkHitBox.y = _y * _tile_s;
		_atkHitBox.w = 1.4f * _tile_s;
		_atkHitBox.h = 1.0f * _tile_s;
	}
}

void	HitBox::updateHurtBox(void) {
	_hurtBox.x = (_x - 0.3f) * _tile_s;
	_hurtBox.y = (_y - 0.4f) * _tile_s;
	_hurtBox.w = 0.6f * _tile_s;
	_hurtBox.h = 0.8f * _tile_s;
}

bool	HitBox::isDmgHit(FRect &rect) const {
	if (_hurtBox.x < rect.x + rect.w && _hurtBox.x + _hurtBox.w > rect.x
		&& _hurtBox.y < rect.y + rect.h && _hurtBox.y + _hurtBox.h > rect.y)
		return (true);
	return (false);
} 