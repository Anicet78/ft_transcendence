# include "Hud.hpp"

//Constructors/Destructors------------------------------------------------


Hud::Hud(): _minimap()
{
	int w = 800, h = 150;
	this->_placeHolderTexture = loadTexture("assets/sprite/hud/hud.bmp", w, h);
}

Hud::~Hud(void)
{
	SDL_DestroyTexture(this->_placeHolderTexture);
}

//Member Functions--------------------------------------------------------


void	Hud::print(std::vector<Map> const &maps, Player const  &player, int launched)
{
	SDL_Rect rect = {0, 0, 800, 150};
	SDL_RenderCopy(gSdl.renderer, this->_placeHolderTexture, NULL, &rect);
	if (launched)
		this->_minimap.printMinimap(maps, player);
}