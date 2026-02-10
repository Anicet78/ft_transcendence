#ifndef SERVER_HPP

# define SERVER_HPP

# include "Session.hpp"

class Server
{
	private:
		std::vector<Session>					_sessions;
		std::list<Party>						_matchMakingQueue;
		std::vector<std::shared_ptr<Player>>	_players;
		const std::chrono::_V2::steady_clock::time_point _startTime;
	private:
		void	parseJson(std::map<std::string, std::string> &res, std::string msg);
		int		executeJson(PerSocketData *data, uWS::WebSocket<false, true, PerSocketData> *ws, uWS::App &app);
		void	addPlayerOnQueue(std::shared_ptr<Player> player);
		void	manageQueue(void);
		void	removePlayer(std::string &uid, uWS::App &app);
		Player	&getPlayer(std::string &uid);


	public:
		Server(void);
		~Server();
		double getActualTime(void) const;
	
	public:
		void	run();

};

void	updatePlayer(Player &player, std::map<std::string, std::string> &req);
void	updateRoom(Player &player, uWS::App &app);
void	updateWorld(Player &player);

#endif