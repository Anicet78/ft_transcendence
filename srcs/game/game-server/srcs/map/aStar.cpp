#include "Map.hpp"

static inline void getNeighbors(const quadList &node, std::vector<quadList> &out)
{
    out.clear();

    if (!node->north.expired())
        out.push_back(node->north.lock());
    if (!node->east.expired())
        out.push_back(node->east.lock());
    if (!node->south.expired())
        out.push_back(node->south.lock());
    if (!node->west.expired())
        out.push_back(node->west.lock());
}


int Map::heuristic(const quadList &a, const quadList &b) const
{
    // Heuristique Manhattan
    return std::abs(a->getX() - b->getX())
         + std::abs(a->getY() - b->getY());
}

std::vector<quadList> Map::astar(const quadList &start, const quadList &goal)
{
    struct NodeRecord
	{
        quadList node;
        int g;
        int f;
    };

    struct CompareF
	{
        bool operator()(const NodeRecord &a, const NodeRecord &b) const {
            return a.f > b.f;
        }
    };

    std::priority_queue<NodeRecord, std::vector<NodeRecord>, CompareF> open;
    std::unordered_map<quadList, quadList> cameFrom;
    std::unordered_map<quadList, int> gScore;

    gScore[start] = 0;
    open.push({start, 0, heuristic(start, goal)});

    while (!open.empty())
    {
        quadList current = open.top().node;
        open.pop();

        if (current == goal)
        {
            // Reconstruction du chemin
            std::vector<quadList> path;
            quadList cur = current;

            while (cur != start)
            {
                path.push_back(cur);
                cur = cameFrom[cur];
            }
            path.push_back(start);
            std::reverse(path.begin(), path.end());
            return path;
        }

        std::vector<quadList> neighbors;
        getNeighbors(current, neighbors);

        for (auto &n : neighbors)
        {
			if (n->getPath() != 1 && n->getPath() != 3)
				continue ;

            int tentative_g = gScore[current] + 1;

            if (!gScore.count(n) || tentative_g < gScore[n])
            {
                cameFrom[n] = current;
                gScore[n] = tentative_g;

                int f = tentative_g + heuristic(n, goal);
                open.push({n, tentative_g, f});
            }
        }
    }

    return {};
}