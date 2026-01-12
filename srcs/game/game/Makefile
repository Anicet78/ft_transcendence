CXX      = c++
CXXFLAGS = -Wall -Werror -Wextra -std=c++20 -g
CXXFLAGS2 = -Wall -Werror -Wextra -std=c++20 -g
LDFLAGS  = $(shell sdl2-config --libs)

EMSCRIPTEN	= em++
EMFLAGS		= -O3 -s WASM=1 -s USE_SDL=2 -lembind $(CXXFLAGS)

HEADERS		= ./includes/
SRC_DIR		= ./srcs/
OBJ_DIR		= ./objs/

CXXFLAGS += -I$(HEADERS)

SRCS		=	main.cpp \
				engine/Engine.cpp \
				engine/Texture.cpp \
				engine/Key.cpp \
				engine/Assets.cpp \
				engine/sdl_loop.cpp \
				engine/load_image.cpp \
				engine/init_sdl.cpp \
				engine/key_action.cpp \
				engine/map_printer.cpp \
				player/Player.cpp \
				player/PlayerAssets.cpp \
				mapGen/mapMain.cpp Room.cpp Map.cpp aStar.cpp mapGen/mapGen.cpp

EMSRCS		= $(patsubst %, $(SRC_DIR)%, $(SRCS))

OBJS		= $(patsubst %.cpp, $(OBJ_DIR)%.o, $(SRCS))

NAME		= game
EMNAME		= /build/game.js

all: $(NAME)

$(NAME): $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -o $(NAME) $(LDFLAGS)

$(OBJ_DIR)%.o: $(SRC_DIR)%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

wasm:
	$(EMSCRIPTEN) $(EMSRCS) $(EMFLAGS) -o $(EMNAME)

clean:
	rm -rf $(OBJ_DIR)

fclean: clean
	rm -rf $(NAME)

re: fclean all

.PHONY: all clean fclean re 
