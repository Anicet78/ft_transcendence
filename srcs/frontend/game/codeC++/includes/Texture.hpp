#ifndef TEXTURE_HPP
# define TEXTURE_HPP

# include "game_sdl.hpp"

class Texture
{
private:
	SDL_Texture	*_texture;
	int			_imageWidth;
	int			_imageHeight;
public:
	Texture(std::string path);
	~Texture();

	void		render(int x, int y, SDL_Rect *rect);	//render the texture on screen
	bool		loadImage(std::string &path);			//create the texture based on an image
	int			getWidth(void);
	int			getHeight(void);
	SDL_Texture	*getTexture(void);
};


#endif