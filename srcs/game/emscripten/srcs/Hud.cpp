# include "Hud.hpp"

//Constructors/Destructors------------------------------------------------


Hud::Hud()
{}

Hud::~Hud(void)
{}

//Member Functions--------------------------------------------------------

void Hud::drawBox(int x, int y)
{
	SDL_Rect rect = {x, y, 15, 15};
	SDL_SetRenderDrawColor(gSdl.renderer, 255, 255, 255, 255);
	SDL_RenderFillRect(gSdl.renderer, &rect);

	SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
	SDL_RenderDrawRect(gSdl.renderer, &rect);
}

void drawStart(int x, int y)
{
	SDL_Rect rect = {x, y, 15, 15};
	Assets::rendMap(x, y, 97, 0.9375, 0);
	SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
	SDL_RenderDrawRect(gSdl.renderer, &rect);
}

void drawStairs(int x, int y)
{
	SDL_Rect rect = {x, y, 15, 15};
	Assets::rendMap(x, y, 69, 0.9375, 0);
	SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
	SDL_RenderDrawRect(gSdl.renderer, &rect);
}

void drawLinks(int x, int y, const std::array<bool, 4>& exits)
{
	int cx = x + 7;
	int cy = y + 7;

	// Nord
	if (exits[0])
		SDL_RenderDrawLine(gSdl.renderer, cx, y, cx, y + 4);

	// Est
	if (exits[1])
		SDL_RenderDrawLine(gSdl.renderer, x + 15, cy, x + 11, cy);

	// Sud
	if (exits[2])
		SDL_RenderDrawLine(gSdl.renderer, cx, y + 15, cx, y + 11);

	// Ouest
	if (exits[3])
		SDL_RenderDrawLine(gSdl.renderer, x, cy, x + 4, cy);
}


void Hud::printMinimap(std::vector<Map> const &maps, Player const &player)
{
	static int lastFloor = -1;
	static int w = 0;
	static int h = 0;
	static quadList lastNode;

	if (this->_minimapText == NULL)
	{
		this->_minimapText = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 150, 150);
		SDL_SetTextureBlendMode(this->_minimapText, SDL_BLENDMODE_BLEND);
	}

	if (lastNode != player.getNode())
	{
		lastNode = player.getNode();

		SDL_SetRenderTarget(gSdl.renderer, this->_minimapText);
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);

		if (player.getFloor() != lastFloor)
		{
			SDL_RenderClear(gSdl.renderer);
			lastFloor = player.getFloor();
			Map const &map = maps[lastFloor + 1];
			w = map.getWidth();
			h = map.getHeight();
			this->_minimap.assign(h * w, 0);
		}
		int value = (lastNode->getRoom()->getName() == "start") ? 2 : (lastNode->getRoom()->getName() == "stairs") ? 3 : 1;
		int x = lastNode->getX();
		int y = lastNode->getY();
		int index = x * w + y;
		this->_minimap[index] = value;

		if (this->_minimap[index] == 1)
			drawBox(x * 15, y * 15);
		else if (this->_minimap[index] == 2)
			drawStart(x * 15, y * 15);
		else if (this->_minimap[index] == 3)
			drawStairs(x * 15, y * 15);
		drawLinks(x * 15, y * 15, lastNode->getRoom()->getExits());
		
		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
		SDL_SetRenderTarget(gSdl.renderer, NULL);
	}

	SDL_Rect dst = {0, 0, 150, 150};
	SDL_RenderCopy(gSdl.renderer, this->_minimapText, NULL, &dst);
}
