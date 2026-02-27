NAME = transcendence

COMPOSE_PATH = docker/docker-compose.yml
DOCKER_COMPOSE = docker compose -f $(COMPOSE_PATH) -p $(NAME)

CERT_PATH = ./docker/certs
DOMAIN = localhost

SECRET_PATH = docker/secrets
SECRET_NAMES = db_password.txt google_secret.txt jwt_secret.txt cookie_secret.txt secret_42.txt pgadmin_password.txt smtp_password.txt
SECRETS = $(patsubst %, $(SECRET_PATH)/%, $(SECRET_NAMES))

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

doc:
	@docker exec -it node-c npx --prefix /front openapi-typescript http://node:3000/documentation/json --output /front/src/types/api.ts

$(SECRET_PATH)/secret_42.txt:
	@mkdir -p $(SECRET_PATH)
	@touch $@

$(SECRET_PATH)/google_secret.txt:
	@mkdir -p $(SECRET_PATH)
	@touch $@

$(SECRET_PATH)/%_secret.txt:
	@mkdir -p $(SECRET_PATH)
	@node -e "console.log(require('crypto').randomBytes(32).toString('hex'))" | cat > $@

$(SECRET_PATH)/%.txt:
	@mkdir -p $(SECRET_PATH)
	@echo -n "passwd" > $@

up: $(SECRETS)
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

b: build up

r: down build up

re: fclean all

.PHONY: all build cert up down clean fclean b r re
