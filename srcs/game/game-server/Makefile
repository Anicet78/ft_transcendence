CXX      = c++
CXXFLAGS = -Wall -Werror -Wextra -std=c++20 -g
LDFLAGS = -lpthread -lz


HEADERS		= ./includes/
SRC_DIR		= ./srcs/
OBJ_DIR		= ./objs/

CXXFLAGS += -I$(HEADERS) -I./uWebSockets/src -I./uSockets/src

SRCS = main.cpp \

USOCKETS_SRC = $(wildcard ./uSockets/src/*.c) \
               $(wildcard ./uSockets/src/eventing/*.c) \
               $(wildcard ./uSockets/src/crypto/*.c)

# Objets uSockets
USOCKETS_OBJ = $(patsubst ./uSockets/src/%.c, $(OBJ_DIR2)usockets_%.o, $(filter ./uSockets/src/*.c, $(USOCKETS_SRC))) \
               $(patsubst ./uSockets/src/eventing/%.c, $(OBJ_DIR2)usockets_eventing_%.o, $(filter ./uSockets/src/eventing/*.c, $(USOCKETS_SRC))) \
               $(patsubst ./uSockets/src/crypto/%.c, $(OBJ_DIR2)usockets_crypto_%.o, $(filter ./uSockets/src/crypto/*.c, $(USOCKETS_SRC)))


OBJS		= $(patsubst %.cpp, $(OBJ_DIR)%.o, $(SRCS))

NAME		= game-server

all: $(NAME)

$(NAME): $(OBJS) $(USOCKETS_OBJ)
	$(CXX) $(CXXFLAGS) $(OBJS) $(USOCKETS_OBJ) -o $(NAME) $(LDFLAGS)


$(OBJ_DIR)%.o: $(SRC_DIR)%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

$(OBJ_DIR)usockets_%.o: ./uSockets/src/%.c
	@mkdir -p $(dir $@)
	$(CC) -c $< -o $@

$(OBJ_DIR)usockets_eventing_%.o: ./uSockets/src/eventing/%.c
	@mkdir -p $(dir $@)
	$(CC) -c $< -o $@

$(OBJ_DIR)usockets_crypto_%.o: ./uSockets/src/crypto/%.c
	@mkdir -p $(dir $@)
	$(CC) -c $< -o $@


clean:
	rm -rf $(OBJ_DIR)

fclean: clean
	rm -rf $(NAME)

re: fclean all

.PHONY: all clean fclean  re 
