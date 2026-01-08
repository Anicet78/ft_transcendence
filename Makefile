NAME = transcendence
DOMAIN = localhost

COMPOSE_PATH = docker/docker-compose.yml
DOCKER_COMPOSE = docker compose -f $(COMPOSE_PATH) -p $(NAME)

CERT_PATH = ./docker/certs

INFO = @printf '\033[1;35m⮑ %s\033[0m\n'

all: build cert up

build:
	$(INFO) "Building images..."
	@$(DOCKER_COMPOSE) build

cert:
	$(INFO) "Creating certificate..."
	@mkdir -p $(CERT_PATH)
	@openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout $(CERT_PATH)/nginx.key \
		-out $(CERT_PATH)/nginx.crt \
		-subj "/CN=$(DOMAIN)"
	$(INFO) "Certificate created."

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

r: down up

re: fclean all

.PHONY: all build cert up down clean fclean r re
