#ifndef PLAYER_HPP

# define PLAYER_HPP

# include "Map.hpp"

typedef struct PerSocketData
{
    std::string							playerId;
    std::string							pseudo;
    std::string							room; //room is designing an appartenance at a game room, with all of the other players of the session
	std::string							group; //group is is for the group with you launch the game (before matchmaking)
	int									groupSize;//size of the group
    std::map<std::string, std::string>	jsonMsg;
} PerSocketData;

class Player
{
	private:
		std::string									_uid;
		int											_numPlayer;
		int											_partySize;//size of the group
		std::string									_partyName; //party is for the group with you launch the game with (before matchmaking)
		std::string									_name;
		std::string									_groupName; //party is designing an appartenance at a game room, with all of the other players of the session
		bool										_inQueue;
		bool										_inSession;
		bool										_launched;
		bool										_connected;
		bool										_finished;
		bool										_hasWin;
		int											_finalRanking;
		char										_exit;
		uWS::WebSocket<false, true, PerSocketData>	*_ws;

	//player pos
		float		_x;
		float		_y;

	//pos in map
		quadList	_node;
		quadList	_prev_node;

	//anim
		int			_anim;
		int			_last_dir;

	//player stat
		int			_hp;
		int			_atk;
		int			_def;
	//wall hitbox
		FRect		_wallHitBox;
		HitBox		_box;

	//atk state
		bool		_isAttacking;
		int			_atkFrame;


	public:
		Player(std::string uid, int partySize, std::string partyName, std::string name,
				uWS::WebSocket<false, true, PerSocketData> *ws);
		~Player();

	//getter
		std::string	getUid(void) const;
		std::string	getName(void) const;
		Room		getRoom(void) const;
		quadList	getNode(void) const;
		quadList	getPrevNode(void) const;
		bool		getFinished(void) const;
		bool		HasWin(void) const;
		int			getFinalRanking(void) const;
		char		getExit(void) const;
		int			getGroupSize() const;
		int			getAnim(void) const;
		std::string	getPartyName(void) const;
		bool		isInQueue(void)	const;
		bool		isInSession(void) const;
		bool		isLaunched(void) const;
		bool		isConnected(void) const;
		uWS::WebSocket<false, true, PerSocketData> *getWs(void) const;

		float		getX(void) const;
		float		getY(void) const;

		int			getHp(void) const;
		int			getAtk(void) const;
		int			getDef(void) const;
		int			getLastDir(void) const;
		FRect		&getWallHitBox(void);
		Room		&getRoomRef(void);
		HitBox		&getHitBox(void);

	//setter
		void		setConnexion(bool c);
		void		setLaunched(bool flag);
		void		setFinished(bool flag);
		void		setHasWin(bool flag);
		void		setFinalRanking(int place);
		void		setExit(char c);
		void		setNode(const quadList &node);
		void		setPrevNode(const quadList &node);
		void		setPos(float x, float y);
		void		setHp(int hp);
		void		setAtk(int atk);
		void		setDef(int def);
		void		setWallHitBox(void);
		void		setInQueue(bool flag);
		void		setInSession(bool flag);
		void		setAnim(int anim);
		void		setLastDir(int dir);

	//action
		void		findP(void);
		void		move(void);

		void		attack(void);
		bool		getIsAttacking(void) const;
		void		endAttacking(void);

		void		updateAnim(std::string const &req);
		void		move(std::map<std::string, std::string> &req);
		void		takeDamage(int amount);
		void		heal(int amount);
};

#endif