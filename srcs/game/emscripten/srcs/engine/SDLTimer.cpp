#include"SDLTimer.hpp"

SDLTimer::SDLTimer(void) : _startTicks(0), _pausedTicks(0), _started(false), _paused(false) {
	return ;
}

SDLTimer::~SDLTimer(void) {
	return ;
}

bool	SDLTimer::getStarted(void) const {
	return (_started);
}

bool	SDLTimer::getPaused(void) const {
	return (_paused);
}

void	SDLTimer::startTimer(void) {

	_started = true;
	_startTicks = SDL_GetTicks();
	
	_paused = false;
	_pausedTicks = 0;
	return ;
}

void	SDLTimer::stopTimer(void) {
	_started = false;
	_paused = false;
	_startTicks = 0;
	_pausedTicks = 0;
	return ;
}

void	SDLTimer::pauseTimer(void) {
	if (_started && !_paused) {
		_paused = true;
		_pausedTicks = SDL_GetTicks() - _startTicks;
		_startTicks = 0;
	}
	return ;
}

void	SDLTimer::unpauseTimer(void) {
	if (_started && _paused) {
		_paused = false;
		_startTicks = SDL_GetTicks() - _pausedTicks;
		_pausedTicks = 0;
	}
	return ;
}

Uint32	SDLTimer::getTicks(void) const {
	Uint32	time = 0;

	if (_started)
	{
		if (_paused)
			time = _pausedTicks;
		else
			time = SDL_GetTicks() - _startTicks;
	}
	return (time);
}