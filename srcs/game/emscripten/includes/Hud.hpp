#ifndef HUD_HPP

# define HUD_HPP

# include "Player.hpp"

class Hud
{
	private:
		std::vector<int>	_minimap;
		SDL_Texture		*_minimapText;

	private:
		void	drawBox(int x, int y);


	public:
		Hud(void);
		~Hud();
	
	public:
		void	printMinimap(std::vector<Map> const &maps, Player const  &player);

};



#endif