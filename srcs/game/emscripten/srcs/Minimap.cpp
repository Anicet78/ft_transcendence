# include "Hud.hpp"

//Constructors/Destructors------------------------------------------------

Minimap::Minimap(): _x(0), _y(0), _minimapCamera(_x, _y, 2, 2, 150, SCREEN_HEIGHT - GAME_HEIGHT)
{}

Minimap::~Minimap(void)
{
	SDL_DestroyTexture(_minimapText);
}

//Member Functions--------------------------------------------------------

void	Minimap::drawBox(int x, int y, int scale, SDL_Color &color)
{
	SDL_Rect rect = {x + scale / 4, y + scale / 4, scale / 2, scale / 2};
	SDL_SetRenderDrawColor(gSdl.renderer, color.r, color.g, color.b, color.a);
	SDL_RenderFillRect(gSdl.renderer, &rect);
	SDL_SetRenderDrawColor(gSdl.renderer, 95, 168, 255, 255);
	rect = {x + (scale / 4) - 1, y + (scale / 4) - 1, (scale / 2) + 1, (scale / 2) + 1};
	SDL_RenderDrawRect(gSdl.renderer, &rect);
}

void	drawStart(int x, int y, int scale, SDL_Color &color)
{
	float rat = scale / 32.0f;
	Assets::rendMap(x + scale / 4, y + scale / 4, 82, rat, 0);
	SDL_Rect rect = {x + scale / 4, y + scale / 4, scale / 2, scale / 2};
	SDL_SetRenderDrawColor(gSdl.renderer, color.r, color.g, color.b, 100);
	SDL_RenderFillRect(gSdl.renderer, &rect);
}

void	drawStairs(int x, int y, int scale)
{
	float rat = scale / 32.0f;
	Assets::rendMap(x + scale / 4, y + scale / 4, 69, rat, 0);
}

void	drawLineDegressive(int x, int y, int x2, int y2, SDL_Color color)
{
	int dx = x2 - x;
	int dy = y2 - y;
	int steps = std::max(std::abs(dx), std::abs(dy));
	float incX = dx / static_cast<float>(steps);
	float incY = dy / static_cast<float>(steps);
	float fx = x, fy = y;
	for (int i = 0; i <= steps; i++)
	{
		float t = i / static_cast<float>(steps);
		uint8_t alpha = static_cast<uint8_t>(color.a + t * (0.f - color.a));
		SDL_SetRenderDrawColor(gSdl.renderer, color.r, color.g, color.b, alpha);
		SDL_RenderDrawPoint(gSdl.renderer, static_cast<int>(fx), static_cast<int>(fy));
		fx += incX;
		fy += incY;
	}
}

void	drawLinks(int x, int y, const std::array<bool, 4>& exits, int scale)
{
	int cx = x + (scale / 2) - 2;
	int cy = y + (scale / 2) - 2;

	SDL_Color color = {127, 227, 255, 255};
	// Nord
	if (exits[0])
	{
		for (int i = cx; i < cx + 4; i++)
			drawLineDegressive(i, y + (scale / 4), i, y + (scale / 4) - 15, color);
	}

	// Est
	if (exits[1])
	{
		for (int i = cy; i < cy + 4; i++)
			drawLineDegressive(x + scale * 0.75, i, x + scale * 0.75 + 15, i, color);
	}

	// Sud
	if (exits[2])
	{
		for (int i = cx; i < cx + 4; i++)
			drawLineDegressive(i, y + scale * 0.75, i, y + scale * 0.75 + 15, color);
	}

	// Ouest
	if (exits[3])
	{
		for (int i = cy; i < cy + 4; i++)
			drawLineDegressive(x + (scale / 4), i, x + (scale / 4) - 15, i, color);
	}
}


void	Minimap::drawNode(quadList &node, int w, SDL_Color color)
{
	int scale = 30;
	int x = node->getX();
	int y = node->getY();
	int value = (node->getRoom()->getName() == "start") ? 2 : (node->getRoom()->getName() == "stairs") ? 3 : 1;
	int index = x * w + y;
	this->_minimap[index] = value;

	if (this->_minimap[index] == 1)
		drawBox(x * scale, y * scale, scale, color);
	else if (this->_minimap[index] == 2)
		drawStart(x * scale, y * scale, scale, color);
	else if (this->_minimap[index] == 3)
		drawStairs(x * scale, y * scale, scale);
	drawLinks(x * scale, y * scale, node->getRoom()->getExits(), scale);
}

void	Minimap::printMinimap(std::vector<Map> const &maps, Player const &player)
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

		if (player.getFloor() != lastFloor)
		{
			SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 0);
			SDL_RenderClear(gSdl.renderer);
			lastFloor = player.getFloor();
			Map const &map = maps[lastFloor + 1];
			w = map.getWidth();
			h = map.getHeight();
			this->_minimap.assign(h * w, 0);
			lastNode.reset();
		}
	
		if (lastNode)
			this->drawNode(lastNode, w, (SDL_Color){168, 180, 200, 255});
		lastNode = player.getNode();
		this->_x = lastNode->getX();
		this->_y = lastNode->getY();
		this->drawNode(lastNode, w, (SDL_Color){255, 255, 0, 255});

		SDL_SetRenderDrawColor(gSdl.renderer, 0, 0, 0, 255);
		SDL_SetRenderTarget(gSdl.renderer, NULL);
		this->_minimapCamera.updateCamera(30, w, h);
	}

	SDL_Rect dst = {3, 3, 144, 144};
	
	SDL_RenderCopy(gSdl.renderer, this->_minimapText, &this->_minimapCamera.getCamera(), &dst);
}