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

static void drawRed(int x)
{
	SDL_SetRenderDrawColor(gSdl.renderer, 255, 0, 0, 255);
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
}

static void drawYellow(int x, int lenX)
{
	SDL_SetRenderDrawColor(gSdl.renderer, 255, 255, 0, 255);
	int corr = 0;
	if (x < 13)
		x = 13;
	if (x + lenX > 387)
		corr = x + lenX - 387;
	SDL_Rect rect = {x, 4, lenX - corr, 22};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 11)
		x = 11;
	if (x + lenX > 389)
		corr = x + lenX - 389;
	rect = {x, 5, lenX - corr, 20};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 10)
		x = 10;
	if (x + lenX > 390)
		corr = x + lenX - 390;
	rect = {x, 6, lenX - corr, 18};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 8)
		x = 8;
	if (x + lenX > 392)
		corr = x + lenX - 392;
	rect = {x, 7, lenX - corr, 16};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 7)
		x = 7;
	if (x + lenX > 393)
		corr = x + lenX - 393;
	rect = {x, 8, lenX - corr, 14};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 6)
		x = 6;
	if (x + lenX > 394)
		corr = x + lenX - 394;
	rect = {x, 10, lenX - corr, 10};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 5)
		x = 5;
	if (x + lenX > 395)
		corr = x + lenX - 395;
	rect = {x, 11, lenX - corr, 8};
	SDL_RenderFillRect(gSdl.renderer, &rect);
	if (x < 4)
		x = 4;
	if (x + lenX > 396)
		corr = x + lenX - 396;
	rect = {x, 12, lenX - corr, 4};
	SDL_RenderFillRect(gSdl.renderer, &rect);
}

void	Hud::printHealthBar(Player const &player)
{
	static int hp = 0;
	static int delay = 0;
	static int level = 0;

	if (delay <= level)
	{
		SDL_SetRenderTarget(gSdl.renderer, this->_healthTexture);
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 0);
		SDL_RenderClear(gSdl.renderer);
		if (delay < 395)
			drawYellow(delay, level - delay);
		if (level != 400)
			drawRed(level);
		SDL_SetRenderTarget(gSdl.renderer, gSdl.hud);
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
		delay += 15;
		if (delay > level)
			delay = level;
	}
	if (player.getHp() != hp && player.getHp() >= 0)
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
			delay = 400 - int(400 * ((hp + 1) / float(MAX_PLAYER_HP)));
			level = 400;
			return ;
		}
		int x = 400 - int(400 * (hp / float(MAX_PLAYER_HP)));
		if (hp != MAX_PLAYER_HP)
		{
			delay = 400 - int(400 * ((hp + 1) / float(MAX_PLAYER_HP)));
			level = x;
		}
		drawRed(x);
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

