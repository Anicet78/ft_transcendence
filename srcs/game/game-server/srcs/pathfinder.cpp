#include"Server.hpp"

typedef struct Point {
	int x;
	int y;
	int gCost;
	int hCost;
	int	fCost;
} Point;

static int	heuristic_euclidian_dist(int const playerX, int const playerY, int const x, int const y)
{
	int	dx;
	int	dy;

	dx = playerX - x;
	dy = playerY - y;
	return ((dx * dx + dy * dy) * 10);
}

static int	total_move_cost(Point const &parent, int x, int y)
{
	if (parent.y == y || parent.x == x)
		return (10 + parent.gCost);
	else
		return (14 + parent.gCost);
}

static bool	check_over(Point const &point, int const playerX, int const playerY)
{
	if (point.x == playerX && point.y == playerY)
		return (true);
	return (false);
}

static void	check_case(int x, int y, Point &current, std::vector<std::string> &map)
{
	if (map[y][x] != '1' && check_in_list(closeList, x, y) == 0)
	{
		Point &point = find_in_list(finder.o_list, x, y);
		if (point
			&& (total_move_cost(current, point.x, point.y) <= point.g_cost))
		{
			point.gCost = total_move_cost(current, point.x, point.y);
			point.fCost = point.g_cost + point.h_cost;
			point.parent = current;
		}
		else if (point == NULL)
		{
			point = init_point(x, y, total_move_cost(current, x, y),
					heuristic_euclidian_dist(finder.player, x, y));
			if (!point)
				quit_prog(data);
			point.parent = current;
			add_in_list(data, &finder.o_list, point);
		}
	}
}

static void	check_next(Point &current, std::vector<std::string> &map)
{
	int	x;
	int	y;

	x = current.x;
	y = current.y;
	if (map[y][x - 1] != '1' && map[y + 1][x] != '1')
		check_case(x - 1, y + 1, current, finder);

	check_case(x, y + 1, current, finder);
	if (map[y][x + 1] != '1' && map[y + 1][x] != '1')
		check_case(x + 1, y + 1, current, finder);

	check_case(x - 1, y, current, finder);

	check_case(x + 1, y, current, finder);

	if (map[y][x - 1] != '1' && map[y - 1][x] != '1')
		check_case(x - 1, y - 1, current, finder);

	check_case(x, y - 1, current, finder);

	if (map[y][x + 1] != '1' && map[y - 1][x] != '1')
		check_case(x + 1, y - 1, current, finder);

}

int	pathfinder(Player const &player, Mob &mob, std::vector<std::string> &map)
{
	std::list<Point> openList;
	std::list<Point> closeList;

	std::find

	int const mobX = static_cast<int>(mob.getX());
	int const mobY = static_cast<int>(mob.getY());
	
	int const playerX = static_cast<int>(player.getX());
	int const playerY = static_cast<int>(player.getY());

	Point current = {
		mobX,
		mobY,
		0,
		heuristic_euclidian_dist(playerX, playerY, mobX, mobY),
		current.gCost + current.hCost
	};
	openList.emplace_back(current);
	while (check_over(current, playerX, playerY) == false)
	{
		
	}
}