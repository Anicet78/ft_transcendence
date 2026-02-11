#ifndef SESSION_HPP

# define SESSION_HPP

# include "Party.hpp"

class Session
{
	private:
		int											_maxNumPlayer;
		std::vector<std::string>					_spectators;//maybe spectator class later
		std::vector<std::shared_ptr<Player>>		_players;
		std::vector<Map>							_maps;
		std::string									_sessionId;
		Map											_watingRoom;
		bool										_running;
		bool										_ended;
		std::string									_mapInfos;
		std::chrono::_V2::steady_clock::time_point	_startTime;
		int											_numPlayersFinished;

	private:
		void									linkMaps(Map &down, Map &up);
		std::string								sendMaps(void);


	public:
		Session(void);
		Session(int numPlayer);
		~Session();
	
	public:
		void									launch();
		void									addParty(Party &newParty);
		void									checkFinishedPlayers(uWS::App &app);
		bool									removePlayer(std::shared_ptr<Player> rmPlayer);
		bool									isPlayerInSession(std::string &uid) const;
		void									sendToAll(Player &sender);
		std::shared_ptr<Player>					&getPlayer(std::string &uid);
		std::vector<std::shared_ptr<Player>>	getPlayers(void) const;
		int										getMaxNumPlayer(void) const;
		int										getPlaceLeft(void) const;
		double									getActualTime(void) const;
		int										getNumPlayers(void) const;
		bool									isRunning(void) const;
		bool									doesAllPlayersConnected() const;
		bool									hasEnded(void) const;
};

void	sendPlayerState(Player &player, Session &session, std::string uid_leave);
void	sendLeaveUpdate(Player &player, uWS::App &app, std::string &topic);

# endif