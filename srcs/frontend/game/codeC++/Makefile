CXX			= c++
CXXFLAGS	= -Wall -Werror -Wextra -w -lSDL2 -Iincludes -std=c++20 -g

HEADERS		= ./includes/
SRC_DIR		= ./srcs/
OBJ_DIR		= ./objs/

CXXFLAGS += -I$(HEADERS)

SRCS		=	main.cpp \
				engine/sdl_loop.cpp \
				engine/load_image.cpp \
				engine/Engine.cpp \
				engine/Texture.cpp \
				engine/Key.cpp \
				mapMain.cpp Room.cpp Map.cpp \
				engine/Assets.cpp

OBJS		= $(patsubst %.cpp, $(OBJ_DIR)%.o, $(SRCS))
DEPS		= $(OBJS:.o=.d)

NAME		= feur

all: $(NAME)

$(NAME): $(OBJS)
	$(CXX) $(CXXFLAGS) $(OBJS) -o $(NAME)

$(OBJ_DIR)%.o: $(SRC_DIR)%.cpp
	@mkdir -p $(dir $@)
	$(CXX) $(CXXFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJ_DIR)

fclean: clean
	rm -rf $(NAME)

re: fclean all

-include $(DEPS)

.PHONY: all clean fclean re

