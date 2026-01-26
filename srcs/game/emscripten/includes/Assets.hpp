#ifndef ASSETS_HPP
# define ASSETS_HPP

#include"Engine.hpp"

class Assets
{
private:
//map param
	static std::map<int, SDL_Rect>	_mapAssets;
	static SDL_Texture				*_MapTexture;
	static int						_MapImgW;
	static int						_MapImgH;

	Assets(void);
	~Assets(void);
public:

	static void		importAssets(std::string path, int tile_size);

	// static SDL_Rect	*getAssets(int index);

	static void		rendMap(int x, int y, int index, float scale);
	
	enum AssetIndex {

		WALL = 41,
		WALL_UP_LEFT_CORNER = 32,
		WALL_UP_RIGHT_CORNER = 47,
		WALL_DOWN_RIGHT_CORNER = 26,
		WALL_DOWN_LEFT_CORNER = 27,
		WALL_LEFT = 50,
		WALL_RIGHT = 29,
		WALL_DOWN = 5,

		FLOOR = 19,
		FLOOR_UP_LEFT_CORNER = 0,
		FLOOR_UP_RIGHT_CORNER = 2,
		FLOOR_UP_BORDER = 1,

		DOOR_FRONT = 82,
	};
};


#endif