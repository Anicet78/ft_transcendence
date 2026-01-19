#ifndef SESSION_HPP

# define SESSION_HPP

# include "Party.hpp"

class Session
{
	private:
		int										_maxNumPlayer;
		std::vector<std::string>				_spectators;//maybe spectator class later
		std::vector<std::shared_ptr<Player>>	_players;
		std::vector<Map>						_maps;
		Map										_watingRoom;
		bool									_running;
		bool									_ended;


	public:
		Session(void);
		Session(int numPlayer);
		~Session();
	
	public:
		void	addParty(Party &newParty);
		bool	removePlayer(std::shared_ptr<Player> rmPlayer);
		bool	isPlayerInSession(std::string &uid) const;
		int		getMaxNumPlayer() const;
		int		getPlaceLeft() const;
		int		getNumPlayers() const;
		bool	isRunning() const;
		bool	hasEnded() const;
};


# endif