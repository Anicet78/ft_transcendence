# include "Hud.hpp"

//Constructors/Destructors------------------------------------------------


Hud::Hud(): _x(0), _y(0), _minimapCamera(_x, _y, 2, 2, 150, SCREEN_HEIGHT - GAME_HEIGHT)
{}

Hud::~Hud(void)
{}

//Member Functions--------------------------------------------------------

void Hud::drawBox(int x, int y, int scale, int r, int g, int b, int t)
{
	SDL_Rect rect = {x + scale / 4, y + scale / 4, scale / 2, scale / 2};
	SDL_SetRenderDrawColor(gSdl.renderer, r, g, b, t);
	SDL_RenderFillRect(gSdl.renderer, &rect);

	SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
	SDL_RenderDrawRect(gSdl.renderer, &rect);
}

void drawStart(int x, int y, int scale, int r, int g, int b, int t)
{
	float rat = scale / 32.0f;
	Assets::rendMap(x + scale / 4, y + scale / 4, 97, rat, 0);
	SDL_Rect rect = {x + scale / 4, y + scale / 4, scale / 2, scale / 2};
	SDL_SetRenderDrawColor(gSdl.renderer, r, g, b, t);
	SDL_RenderFillRect(gSdl.renderer, &rect);
}

void drawStairs(int x, int y, int scale)
{
	float rat = scale / 32.0f;
	Assets::rendMap(x + scale / 4, y + scale / 4, 69, rat, 0);
}

void drawLinks(int x, int y, const std::array<bool, 4>& exits, int scale)
{
	int cx = x + (scale / 2) - 2;
	int cy = y + (scale / 2) - 2;

	SDL_SetRenderDrawColor(gSdl.renderer, 0, 255, 0, 255);
	// Nord
	if (exits[0])
	{
		for (int i = cx; i < cx + 4; i++)
			SDL_RenderDrawLine(gSdl.renderer, i, y + (scale / 4), i, y + (scale / 4) - 15);
	}

	// Est
	if (exits[1])
	{
		for (int i = cy; i < cy + 4; i++)
			SDL_RenderDrawLine(gSdl.renderer, x + scale * 0.75, i, x + scale * 0.75 + 15, i);
	}

	// Sud
	if (exits[2])
	{
		for (int i = cx; i < cx + 4; i++)
			SDL_RenderDrawLine(gSdl.renderer, i, y + scale * 0.75, i, y + scale * 0.75 + 15);
	}

	// Ouest
	if (exits[3])
	{
		for (int i = cy; i < cy + 4; i++)
			SDL_RenderDrawLine(gSdl.renderer, x + (scale / 4), i, x + (scale / 4) - 15, i);
	}
}


void	Hud::drawNode(quadList &node, int w, int r, int g, int b, int t)
{
	int scale = 30;
	int x = node->getX();
	int y = node->getY();
	int value = (node->getRoom()->getName() == "start") ? 2 : (node->getRoom()->getName() == "stairs") ? 3 : 1;
	int index = x * w + y;
	this->_minimap[index] = value;

	if (this->_minimap[index] == 1)
		drawBox(x * scale, y * scale, scale, r, g, b, t);
	else if (this->_minimap[index] == 2)
		drawStart(x * scale, y * scale, scale, r, g, b, 100);
	else if (this->_minimap[index] == 3)
		drawStairs(x * scale, y * scale, scale);
	drawLinks(x * scale, y * scale, node->getRoom()->getExits(), scale);
}

void Hud::printMinimap(std::vector<Map> const &maps, Player const &player)
{
	static int lastFloor = -1;
	static int w = 0;
	static int h = 0;
	static quadList lastNode;

	if (this->_minimapText == NULL)
	{
		this->_minimapText = SDL_CreateTexture(gSdl.renderer, SDL_PIXELFORMAT_RGBA8888, SDL_TEXTUREACCESS_TARGET, 150 * 16, 150 * 16);
		SDL_SetTextureBlendMode(this->_minimapText, SDL_BLENDMODE_BLEND);
	}

	if (lastNode != player.getNode())
	{

		SDL_SetRenderTarget(gSdl.renderer, this->_minimapText);
		SDL_SetRenderDrawBlendMode(gSdl.renderer, SDL_BLENDMODE_BLEND);
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

		if (lastNode)
			this->drawNode(lastNode, w, 100, 100, 100, 150);
		lastNode = player.getNode();
		this->_x = lastNode->getX();
		this->_y = lastNode->getY();
		this->drawNode(lastNode, w, 255, 255, 0, 200);

		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
		SDL_SetRenderTarget(gSdl.renderer, NULL);
		this->_minimapCamera.updateCamera(30, w, h);
	}

	SDL_Rect dst = {0, 0, 150, 150};
	
	SDL_RenderCopy(gSdl.renderer, this->_minimapText, &this->_minimapCamera.getCamera(), &dst);
}
