#ifndef PLAYER_HPP

# define PLAYER_HPP

# include "Map.hpp"

class Player
{
	private:
		int			_uid;
		int			_numPlayer;
		int			_groupSize;//size of the group
		std::string _group; //group is is for the group with you launch the game (before matchmaking)
		std::string	_name;
		std::string _room; //room is designing an appartenance at a game room, with all of the other players of the session

	//player pos
		float		_x;
		float		_y;

	//pos in map
		quadList	&_node;

	//player stat
		int			_hp;
		int			_atk;
		int			_def;

	public:
		Player(int uid, std::string name, quadList &node);
		~Player();

	//getter
		int			getUid(void) const;
		std::string	getName(void) const;
		Room		getRoom() const;
		quadList	getNode() const;

		float		getX(void) const;
		float		getY(void) const;

		int			getHp(void) const;
		int			getAtk(void) const;
		int			getDef(void) const;

	//setter
		void	setNode(const quadList &node);
		void	setPos(float x, float y);
		void	setHp(int hp);
		void	setAtk(int atk);
		void	setDef(int def);

	//action
		void		move(void);
		void		attack(void);
		void		takeDamage(int amount);
		void		heal(int amount);
};

#endif