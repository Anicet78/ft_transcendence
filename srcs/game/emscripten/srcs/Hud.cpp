# include "Hud.hpp"

//Constructors/Destructors------------------------------------------------


Hud::Hud(): _minimap()
{
	int w = 800, h = 150;
	this->_placeHolderTexture = loadTexture("assets/sprite/hud/hud.bmp", w, h);
	this->_healthTexture = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 400, 30);
	SDL_SetTextureBlendMode(this->_healthTexture, SDL_BLENDMODE_BLEND);

}

Hud::~Hud(void)
{
	SDL_DestroyTexture(this->_placeHolderTexture);
	SDL_DestroyTexture(this->_healthTexture);
}

//Member Functions--------------------------------------------------------

void	Hud::printTimer(float t)
{
	std::string secM, minM, milM;
	int min = static_cast<int>(t / 60);
	float sec = std::fmod(t, 60);
	float mil = sec - (int)sec;
	milM = std::to_string(mil).substr(2, 2);
	secM = (sec < 10) ? '0' + std::to_string(sec).substr(0, 1) : std::to_string(sec).substr(0, 2);
	minM = (min < 10) ? '0' + std::to_string(min) : std::to_string(min);

	std::string timer = minM + ':' + secM + ':' + milM;
	SDL_Surface* surf = TTF_RenderText_Blended(gSdl.font, timer.c_str(), (SDL_Color){0, 255, 0, 255});
	if (!surf)
	{
		SDL_Log("RenderText error: %s", TTF_GetError());
		return ;
	}

	SDL_Texture *time = SDL_CreateTextureFromSurface(gSdl.renderer, surf);

	int w, h;
	SDL_QueryTexture(time, nullptr, nullptr, &w, &h);
	SDL_Rect dst = {static_cast<int>(250 - (w / 6)), static_cast<int>(75 - (h / 6)), w / 3, h / 3};
	SDL_RenderCopy(gSdl.renderer, time, nullptr, &dst);

	SDL_FreeSurface(surf);
	SDL_DestroyTexture(time);
}

void	Hud::printHealthBar(Player const &player)
{
	static int hp = 0;

	if (player.getHp() != hp && hp >= 0)
	{
		hp = player.getHp();
		SDL_SetRenderTarget(gSdl.renderer, this->_healthTexture);
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 0);
		SDL_RenderClear(gSdl.renderer);
		if (!hp)
		{
			SDL_SetRenderTarget(gSdl.renderer, gSdl.hud);
			SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
			SDL_Rect rect = {370, 30, 400, 30};
			SDL_RenderCopy(gSdl.renderer, this->_healthTexture, NULL, &rect);
			return ;
		}
		SDL_SetRenderDrawColor(gSdl.renderer, 255, 0, 0, 255);
		int x = 400 - int(400 * (hp / float(MAX_PLAYER_HP)));
		if (x <= 13)
		{
			SDL_Rect rect = {13, 4, 374, 22};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {11, 5, 378, 20};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {10, 6, 380, 18};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {8, 7, 384, 16};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {7, 8, 386, 14};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {6, 10, 388, 10};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {5, 11, 390, 8};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {4, 12, 392, 4};
			SDL_RenderFillRect(gSdl.renderer, &rect);
		}
		else
		{
			SDL_Rect rect = {x, 4, 387 - x, 22};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 5, 389 - x, 20};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 6, 390 - x, 18};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 7, 392 - x, 16};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 8, 393 - x, 14};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 10, 394 - x, 10};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 11, 395 - x, 8};
			SDL_RenderFillRect(gSdl.renderer, &rect);
			rect = {x, 12, 396 - x, 4};
			SDL_RenderFillRect(gSdl.renderer, &rect);
		}
		SDL_SetRenderTarget(gSdl.renderer, gSdl.hud);
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
	}
	SDL_Rect rect = {370, 30, 400, 30};
	SDL_RenderCopy(gSdl.renderer, this->_healthTexture, NULL, &rect);
}

void	Hud::print(std::vector<Map> const &maps, Player const &player, int launched, float time)
{
	SDL_Rect rect = {0, 0, 800, 150};
	SDL_RenderCopy(gSdl.renderer, this->_placeHolderTexture, NULL, &rect);
	this->printHealthBar(player);
	if (launched)
		this->_minimap.printMinimap(maps, player);
	this->printTimer(time);
}

