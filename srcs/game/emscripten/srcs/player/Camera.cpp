#include"Camera.hpp"

Camera::Camera(float &x, float &y, int rangeX, int rangeY, int screenLengthX, int screenLengthY)
	:_x(&x), _y(&y), _camX(0), _camY(0), _rangeX(rangeX), _rangeY(rangeY), _screenLengthX(screenLengthX), _screenLengthY(screenLengthY)
{
	return ;
}

Camera::~Camera(void)
{
	return ;
}

void	Camera::cameraX(const int tile_size, const int roomW)
{
	float idealMinX = *_x - _rangeX;
	float idealMaxX = *_x + _rangeX + 1;
	int large = _screenLengthX / tile_size;

	if (idealMinX < 0)
	{
		idealMinX = 0;
		idealMaxX = std::min(large, roomW);
	}
	else if (idealMaxX > roomW)
	{
		idealMaxX = roomW;
		idealMinX = std::max(0, roomW - large);
	}

	if (idealMinX > idealMaxX)
		idealMinX = idealMaxX;

	if (roomW * tile_size <= _screenLengthX)
		idealMinX = 0;
	_camX = idealMinX;
}

void	Camera::cameraY(const int tile_size, const int roomH)
{
	float idealMinY = *_y - _rangeY;
	float idealMaxY = *_y + _rangeY + 1;
	int large = _screenLengthY / tile_size;

	if (idealMinY < 0)
	{
		idealMinY = 0;
		idealMaxY = std::min(large, roomH);
	}
	else if (idealMaxY > roomH)
	{
		idealMaxY = roomH;
		idealMinY = std::max(0, roomH - large);
	}

	if (idealMinY > idealMaxY)
		idealMinY = idealMaxY;

	if (roomH * tile_size <= _screenLengthY)
		idealMinY = 0;
	_camY = idealMinY;
}

void	Camera::updateCamera(int tile_s, int roomW, int roomH)
{
	cameraX(tile_s, roomW);
	cameraY(tile_s, roomH);
	_camera =
	{
		static_cast<int>(_camX * tile_s),
		static_cast<int>(_camY * tile_s),
		_screenLengthX,
		_screenLengthY
	};
}

float	Camera::getCamX(void) const
{
	return(_camX);
}

float	Camera::getCamY(void) const
{
	return (_camY);
}

SDL_Rect	&Camera::getCamera(void)
{
	return (_camera);
}