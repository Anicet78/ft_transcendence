#ifndef TEXTURE_HPP
# define TEXTURE_HPP

# include "game_sdl.hpp"

class Texture
{
private:

	static std::map<int, SDL_Rect> _assets;

	SDL_Texture	*_texture;
	int			_imageWidth;
	int			_imageHeight;
public:
	Texture(std::string path);
	~Texture();
	Texture(Texture const &src);
	Texture	&operator=(Texture const &src);

	void		render(void);
	void		renderRect(int x, int y, SDL_Rect *rect);	//render the texture on screen
	bool		loadImage(std::string &path);				//create the texture based on an image

	int			getW(void);
	int			getH(void);
	SDL_Texture	*getTexture(void);
	static SDL_Rect	*getRect(int index);

	static void	importAssets(std::string path);

};

#endif