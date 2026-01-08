#ifndef ASSETS_HPP
# define ASSETS_HPP

# include <game_sdl.hpp>

class Assets
{
private:
	static std::map<int, SDL_Rect>	_assets;
	static SDL_Texture				*_texture;
	static int						_imgW;
	static int						_imgH;
	Assets(void);
	~Assets(void);
public:

	static void		importAssets(std::string path, int tile_size);

	// static SDL_Rect	*getAssets(int index);

	static void		render(int x, int y, int index, int scale);
	
	enum AssetIndex {
		WALL = 41,
		FLOOR = 19,
		FLOOR_UP_LEFT_CORNER = 0,
		FLOOR_UP_RIGHT_CORNER = 2,
		FLOOR_UP_BORDER = 1
	};
};


#endif