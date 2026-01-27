#ifndef SERVER_HPP

# define SERVER_HPP

# include "Session.hpp"

class Server
{
	private:
		std::vector<Session>					_sessions;
		std::list<Party>						_matchMakingQueue;
		std::vector<std::shared_ptr<Player>>	_players;

	private:
		void	parseJson(std::map<std::string, std::string> &res, std::string msg);
		int		executeJson(PerSocketData *data, uWS::WebSocket<false, true, PerSocketData> *ws);
		void	addPlayerOnQueue(std::shared_ptr<Player> player);
		void	manageQueue(void);
		void	removePlayer(std::string &uid);
		Player	&getPlayer(std::string &uid);


	public:
		Server(void);
		~Server();
	
	public:
		void	run();

};

void	updatePlayer(Player &player, std::map<std::string, std::string> &req);
void	updateRoom(Player &player);
void	updateWorld(Player &player);

#endif