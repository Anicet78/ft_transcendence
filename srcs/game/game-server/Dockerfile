FROM debian:trixie-slim AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
	clang \
	zlib1g-dev \
	make \
	&& rm -rf /var/lib/apt/lists/*

RUN apt-get update && apt-get install -y --no-install-recommends git ca-certificates \
	&& git clone --recurse-submodules https://github.com/uNetworking/uWebSockets.git /app/uWebSockets \
	&& rm -rf /var/lib/apt/lists/*-

WORKDIR /app
COPY . .

RUN make

FROM debian:trixie-slim

WORKDIR /src/game-server
COPY --from=builder /app/game-server .

CMD ["./game-server"]