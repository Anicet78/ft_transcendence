NAME = transcendence
COMPOSE_PATH = docker/docker-compose.yml
DOCKER_COMPOSE = docker-compose -f $(COMPOSE_PATH) -p $(NAME)

INFO = @printf '\033[1;35m⮑ %s\033[0m\n'

all: build up

build:
	$(INFO) "Building images..."
	@$(DOCKER_COMPOSE) build

up:
	$(INFO) "Starting containers..."
	@$(DOCKER_COMPOSE) up -d
	$(INFO) "Containers started."

down:
	$(INFO) "Stopping containers..."
	@$(DOCKER_COMPOSE) down
	$(INFO) "Containers stopped."

clean: down
	$(INFO) "Clean done."

fclean:
	$(INFO) "Removing containers, images and volumes..."
	@$(DOCKER_COMPOSE) down --rmi all -v
	$(INFO) "Cleanup complete."

re: fclean all

.PHONY: all build up down clean fclean re
