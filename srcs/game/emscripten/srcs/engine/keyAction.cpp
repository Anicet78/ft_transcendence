#include"Game.hpp"


//swicth the key value to 1 on event
void	key_down(void)
{
	switch(gSdl.event.key.keysym.sym)
	{
		case SDLK_w:
			gSdl.key.w_key = 1;
			break;
		case SDLK_a:
			gSdl.key.a_key = 1;
			break;
		case SDLK_s:
			gSdl.key.s_key = 1;
			break;
		case SDLK_d:
			gSdl.key.d_key = 1;
			break;
		case SDLK_SPACE:
			gSdl.key.space = 1;
			break;
	}
}

//swicth the key value to 0 on event
void	key_up(void)
{
	switch(gSdl.event.key.keysym.sym)
	{
		case SDLK_w:
			gSdl.key.w_key = 0;
			break;
		case SDLK_a:
			gSdl.key.a_key = 0;
			break;
		case SDLK_s:
			gSdl.key.s_key = 0;
			break;
		case SDLK_d:
			gSdl.key.d_key = 0;
			break;
		case SDLK_SPACE:
			gSdl.key.space = 0;
			break;
	}
}

void	reset_key(void)
{
	gSdl.key.w_key = 0;
	gSdl.key.a_key = 0;
	gSdl.key.s_key = 0;
	gSdl.key.d_key = 0;
	gSdl.key.space = 0;
	return ;
}