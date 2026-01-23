#include"heads.hpp"


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
		case SDLK_e:
			gSdl.key.e_key = 1;
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
		case SDLK_e:
			gSdl.key.e_key = 1;
			break;
	}
}

//action occur in case of value pointed equal 1 
void	key_action(void) {
	Key	*key = &gSdl.key;

	if (key->w_key)
		;
	if (key->a_key)
		;
	if (key->s_key)
		;
	if (key->d_key)
		;
	// Assets::FLOOR;
}