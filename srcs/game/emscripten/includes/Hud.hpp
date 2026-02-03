#ifndef HUD_HPP

# define HUD_HPP

# include "Player.hpp"

class Hud
{
	private:
		std::vector<int>	_minimap;
		SDL_Texture			*_minimapText;
		float				_x;
		float				_y;
		Camera				_minimapCamera;

	private:
		void	drawBox(int x, int y, int scale, int r, int g, int b, int t);
		void	drawNode(quadList &node, int w, int r, int g, int b, int t);


	public:
		Hud(void);
		~Hud();
	
	public:
		void	printMinimap(std::vector<Map> const &maps, Player const  &player);

};



#endif