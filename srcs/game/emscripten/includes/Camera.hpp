#ifndef CAMERA_HPP
# define CAMERA_HPP

#include"SDLTimer.hpp"

class Camera
{
private:
	float		*_x;
	float		*_y;

	float		_camX;
	float		_camY;

	int			_rangeX;
	int			_rangeY;

	int			_screenLengthX;
	int			_screenLengthY;

	SDL_Rect	_camera;

	void	cameraX(const int tile_size, const int roomW);
	void	cameraY(const int tile_size, const int roomH);
public:
	Camera(float &x, float &y, int rangeX, int rangeY, int screenLengthX, int screenLengthY);
	~Camera();

	void		updateCamera(int tile_s, int roomW, int roomH);

	float		getCamX(void) const;
	float		getCamY(void) const;
	SDL_Rect	&getCamera(void);
};


#endif