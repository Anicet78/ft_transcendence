#include"Camera.hpp"

Camera::Camera(float &x, float &y) :_x(&x), _y(&y), _camX(0), _camY(0) {
	return ;
}

Camera::~Camera(void) {
	return ;
}

void	Camera::cameraX(const int tile_size, const int roomW) {
	float idealMinX = *_x - 12;
	float idealMaxX = *_x + 13;

	if (idealMinX < 0)
	{
		idealMinX = 0;
		idealMaxX = std::min(25, roomW);
	}
	else if (idealMaxX > roomW)
	{
		idealMaxX = roomW;
		idealMinX = std::max(0, roomW - 25);
	}

	if (idealMinX > idealMaxX)
		idealMinX = idealMaxX;

	if (roomW * tile_size <= SCREEN_WIDTH)
		idealMinX = 0;
	_camX = idealMinX;
}

void	Camera::cameraY(const int tile_size, const int roomH) {
	float idealMinY = *_y - 12;
	float idealMaxY = *_y + 13;

	if (idealMinY < 0)
	{
		idealMinY = 0;
		idealMaxY = std::min(25, roomH);
	}
	else if (idealMaxY > roomH)
	{
		idealMaxY = roomH;
		idealMinY = std::max(0, roomH - 25);
	}

	if (idealMinY > idealMaxY)
		idealMinY = idealMaxY;

	if (roomH * tile_size <= SCREEN_HEIGHT)
		idealMinY = 0;
	_camY = idealMinY;
}

void	Camera::updateCamera(int tile_s, int roomW, int roomH) {
	cameraX(tile_s, roomW);
	cameraY(tile_s, roomH);
	_camera = {
		static_cast<int>(_camX * tile_s),
		static_cast<int>(_camY * tile_s),
		SCREEN_WIDTH,
		SCREEN_HEIGHT
	};
}

float	Camera::getCamX(void) const {
	return(_camX);
}

float	Camera::getCamY(void) const {
	return (_camY);
}

SDL_Rect	&Camera::getCamera(void) {
	return (_camera);
}