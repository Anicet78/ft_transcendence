#ifndef PARTY_HPP

# define PARTY_HPP

# include "Player.hpp"

class Party
{
	private:
		std::vector<Player>	_party;
		int					_partyNumber;
	public:
		Party(void);
		~Party();
};

#endif