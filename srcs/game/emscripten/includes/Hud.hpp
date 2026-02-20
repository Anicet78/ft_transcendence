#ifndef HUD_HPP

# define HUD_HPP

# include "Player.hpp"

class Minimap
{
	private:
		std::vector<int>	_minimap;
		SDL_Texture			*_minimapText;
		float				_x;
		float				_y;
		Camera				_minimapCamera;
	private:
		void	drawBox(int x, int y, int scale, SDL_Color &color);
		void	drawNode(quadList &node, int w, SDL_Color color);
	
	
	public:
		Minimap(void);
		~Minimap();
	
	public:
		void	printMinimap(std::vector<Map> const &maps, Player const  &player);
		
};

class Hud
{
	private:
		Minimap		_minimap;
		SDL_Texture	*_placeHolderTexture;
		SDL_Texture	*_healthTexture;

	private:
		void	printTimer(float time);
		void	printHealthBar(Player const &player);

	public:
		Hud(void);
		~Hud();
	
	public:
		void	print(std::vector<Map> const &maps, Player const  &player, int launched, float time);
		

};



#endif