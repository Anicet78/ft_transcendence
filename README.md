*This project has been created as part of the 42 curriculum by agruet, ndabbous, mprokosc, tpinton and jumichel.*

# FT_TRANSCENDENCE

## Description

**Project Goal**
Create a web app to deploy a game on the web with a RESTful api and a responsive frontend using React.

**Overview**
This web app is made to play games with your friends or with random people

**Key Features**
* A fully integrated dungeon crawler game experience directly within the platform
* Advanced chat system including private and organization chats with roles and permissions
* Profile system with user's game statistics

---

## Instructions

### Prerequisites

* Git
* Linux
* Makefile
* Docker
* Docker Compose v2

### Environment Setup

Fill the provided `.env` file located in `./docker/.env`:

Create and fill the secrets files needed:
```
./docker/google_secret.txt		Google OAUTH secret key
./docker/secret_42.txt		42 OAUTH secret key
./docker/db_password.txt		Postgres user's database password
./docker/pgadmin_password.txt	pgAdmin account password
```

### Install, Build and Run

```
git clone https://github.com/Anicet78/ft_transcendence
cd ft_transcendence
make
```

---

## Resources

<!-- Complete this -->

* Youtube
	* [Fireship Channel](https://www.youtube.com/@Fireship) ⮕ To understand core concepts quickly
	* [Full backend breakdown video](https://www.youtube.com/watch?v=adOkTjIIDnk)

* Tutorials
	* [Beginning Game Programming](https://lazyfoo.net/tutorials/SDL/index.php)
	* [Creating a simple roguelike](https://www.parallelrealities.co.uk/tutorials/rogue/rogue1.php)

* Assets
	* Itch.io
	* [Pixilart](https://www.pixilart.com) ⮕ Create pixel art assets for the game

* AI Usage
	* Provide easy access documentation and explanation about concepts
	* Help explain and solve bugs

---

## Team Information

<!-- Complete this -->

* **agruet**
	* Roles: *Technical Lead, Developer*
	* Responsibilities: Manage the tech stack, manage integration and deployment, backend and frontend developer

* **ndabbous**
	* Roles: *Project Manager, Developer*
	* Responsibilities: Organize meetings, distribute tasks, set objectives and deadlines, track project progress, backend and frontend developer

* **mprokosc**
	* Roles: *Developer*
	* Responsibilities:

* **tpinton**
	* Roles: *Developer*
	* Responsibilities:

* **jumichel**
	* Roles: *Developer*
	* Responsibilities:

---

## Project Management

### Work Organization

**Backend (2 devs)**

>⮕ Create the database schema
>⮕ Write down all the routes needed and splitting them between us
>⮕ 1 dev focused on chat, profile and friendships while the other handles web app authentication, authorization and security
>⮕ Join frontend because 1 dev wasn't enough

**Frontend (1 ⮕ 3 devs)**
>⮕ Create the website sketch to map all pages and their interactions
>⮕ Start creating the basic login, register and home pages
>⮕ Other devs joined and divided the work accross all features
>⮕ Made the app prettier and responsive

**Game (2 devs)**
>⮕ The game engine was coded and an initial v0 game was built in the first weeks
>⮕ Split the game into 2 part, the server and the client
>⮕ Integrate the game into the website

### Project Management Tools

* [GitHub](https://github.com/Anicet78/ft_transcendence)
* [Notion](https://www.notion.so/Transcendence-215512d84c08808c8098dcf170ba7e31?source=copy_link)
* [Miro](https://miro.com/app/board/uXjVGUkRLgU=/?share_link_id=941541403194)

### Communication

* Discord
* [Notion](https://www.notion.so/Transcendence-215512d84c08808c8098dcf170ba7e31?source=copy_link)

---

## Technical Stack

### Frontend

* Language: Typescript (ESNext) & JSX
* Bundler: Vite (Rollup)
* Framework: React
* Styling framework: Bulma
* Data Fetching:
	* TanStack Query
	* Axios
* Websocket: socket.io

### Backend / API

* API type: REST
* Language: Typescript (ESNext)
* Runtime: node.js
* Framework: Fastify
* Type provider: Typebox
* Hashing: Argon2
* Websocket: socket.io
* Documentation: Swagger

### Database

* System used: PostgreSQL
* ORM: Prisma

### Game

* Client
	* Language: C++
	* Library: SDL2
	* Compiler: Emscripten
	* Runtime language: WebASM
	* Websocket: Javascript

* Server
	* Language: C++
	* Websocket: uWebSockets
	* HTTP Client: libcurl

<br>

**Technical Choices Justification**
>**⮕ Backend:** we opted for TypeScript as the language for it's popularity and employability as well as programming efficiency. We choose Fastify because of it's popularity as well and for it's speed.
>**⮕ Frontend:** we opted for TypeScript was chosen as the language as well because JavaScript is by far the most popular and nearly the only way of building modern web apps. React is the most popular out of the modern frontend frameworks.
>**⮕ Game:** we decided to make the game in C++ and compile it in WebAssembly to run natively in the browser. SDL2 was choosen for it's minimalistic approch. However, this approch made us recode the entire game engine which was very time consuming.
>**⮕ Database:** opting for a SQL database ensures robust data integrity and powerful querying capabilities through a standardized, industry-proven language. PostgreSQL stands out as the best choice because it combines advanced open-source features with incredible scalability and support for complex data types.

---

## Database Schema

<!-- Update database schema -->

![Database schema image here](./images/database.png)

### Structure Overview

The database has been designed to maximise unique information sources, with few concessions for optimized query results.

---

## Features List

<!-- Add game features -->

| Feature           | Description                           | Contributor(s)     |
|:-----------------:|:-------------------------------------:|:------------------:|
| **Profile**       | Complete profile system               | ndabbous, jumichel |
| **Friendships**   | Friend request system                 | ndabbous           |
| **Private chat**  | Private conversations with friends    | ndabbous           |
| **Organizations** | Public chats with role management     | ndabbous           |
| **Search Bar**    | Search users with filters and sorting | ndabbous, jumichel |
| **Rooms**         | Play game with your friends           | agruet             |
| **Auth**          | Login, register and use your account  | agruet, jumichel   |

---

## Modules

| Module                            | Type  | Justification                            | Implementation                               | Contributor(s)             |
|:---------------------------------:|:-----:|:----------------------------------------:|:--------------------------------------------:|:--------------------------:|
| **User interactions**             | Major | Essential for our project's scope        | Webapp pages and components                  | ndabbous                   |
| **Real-time features**            | Major | Essential for a good chat                | Chat and rooms                               | ndabbous, agruet           |
| **Frameworks for front and back** | Major | Use modern technologies                  | React and Fastify                            | ndabbous, agruet, jumichel |
| **ORM for the database**          | Minor | Add security and readability to requests | Prisma                                       | ndabbous                   |
| **User management**               | Major | Essential for our project's scope        | Update profile informations                  | jumichel, ndabbous         |
| **Web-based game**                | Major | Essential for our project's scope        | 2D dungeon crawler game                      | tpinton, mprokosch         |
| **Remote players**                | Major | Essential for our game idea              | Server communication through websockets      | tpinton, mprokosch         |
| **Multiplayer game**              | Major | Essential for our game idea              | Server communication through websockets      | tpinton, mprokosch         |
| **Advanced chat**                 | Minor | Better user experience                   | As defined in the subject                    | ndabbous                   |
| **Organizations**                 | Major | Better user experience                   | Enhanced public chat with permissions        | ndabbous                   |
| **Advanced permissions**          | Major | Answer to the organization module        | Organization chats                           | ndabbous                   |
| **User activity analytics**       | Minor | Better user experience                   | Public profile analytics                     | tpinton                    |
| **Remote authentication**         | Minor | Better user experience                   | Register or login with google or 42 accounts | agruet                     |
| **Notifications**                 | Minor | Better user experience                   | Pop up on some actions                       | agruet                     |
| **Search**                        | Minor | Essential for our project's scope        | Search Bar to search users                   | jumichel                   |
| **Custom module**                 | Major | See below                                | See below                                    | tpinton, mprokosch         |
| **Total**                         | 26    |                                          |                                              |                            |

<br>

#### Module of choice

**C++ game compiled in WebAssembly and integrated in the website**

>* **Why we chose this module:**
>We wanted to bridge the gap between high-performance native programming and the web. By choosing C++, we leverage a language known for its manual memory management and execution speed, providing a "gaming" experience with SDL2 that feels fluid and responsive, far beyond what standard DOM manipulation could offer.

>* **What technical challenges it addresses:**
>Integrating C++ into a web environment involves several complex layers:
>* Engine Architecture: We didn't just code a game; we re-implemented a lightweight game engine using SDL2, managing the game state and rendering logic manually.
>* Compilation Pipeline: Setting up Emscripten to compile C++ code into .wasm and .js glue code.
>* Memory Management: Handling the memory bridge between the JavaScript sandbox and the WebAssembly linear memory.
>* Cross-Language Communication: Implementing efficient "bindings" to allow JavaScript to trigger game events and vice versa.
>* Asset Management: Loading textures or game data within the constraints of a browser's asynchronous environment.

>* **How it adds value to your project:**
>It brings native-grade performance to the web. By bypassing the limitations of JavaScript's overhead, we provide a lag-free experience with consistent frame rates. This module proves that the project can handle computationally expensive tasks (like complex collision detection or entity management) by offloading them to a highly optimized WebAssembly binary. It demonstrates a deep understanding of how software interacts with hardware, even through a browser layer.

>* **Why it deserves Major module status:**
>This isn't just a simple script; it requires a completely different development environment and toolchain compared to the rest of the stack. It solves the architectural challenge of embedding a high-performance binary within a modern web frontend without sacrificing load times or UX.

---

## Individual Contributions

<!-- Everyone individually fill this -->

#### agruet

* Implemented:
* Modules handled:
* Challenges faced:
* Solutions:

#### ndabbous

* Implemented:
* Modules handled:
* Challenges faced:
* Solutions:

#### mprokosc

* Implemented:
* Modules handled:
* Challenges faced:
* Solutions:

#### tpinton

* Implemented:
* Modules handled:
* Challenges faced:
* Solutions:

#### jumichel

* Implemented:
* Modules handled:
* Challenges faced:
* Solutions:

---

## Credits

<!-- Complete this -->

Any acknowledgments or external assets used.
