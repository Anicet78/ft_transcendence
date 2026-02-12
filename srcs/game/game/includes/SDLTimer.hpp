#ifndef SDLTIMER_HPP
# define SDLTIMER_HPP

#include "Key.hpp"

class SDLTimer
{
private:
	Uint32	_startTicks;
	Uint32	_pausedTicks;

	bool	_started;
	bool	_paused;
public:
	SDLTimer(void);
	~SDLTimer();

	void	startTimer();
	void	stopTimer();
	void	pauseTimer();
	void	unpauseTimer();

	bool	getPaused() const;
	bool	getStarted() const;

	Uint32	getTicks() const ;
};


#endif