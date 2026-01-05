NAME = game

CC = c++
CFLAGS = -Wall -Wextra -Werror -std=c++20 -Iincludes -g

SRC_DIR = srcs
OBJ_DIR = obj

SRC_FILES = main.cpp Room.cpp Map.cpp

OBJ_FILES = $(addprefix $(OBJ_DIR)/,$(SRC_FILES:.cpp=.o))

all: $(NAME)

$(NAME): $(OBJ_FILES)
	$(CC) $(CFLAGS) $^ -o $@

$(OBJ_DIR)/%.o: $(SRC_DIR)/%.cpp
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

clean:
	rm -rf $(OBJ_DIR)

fclean: clean
	rm -f $(NAME)

re: fclean all

.PHONY: all clean fclean re
