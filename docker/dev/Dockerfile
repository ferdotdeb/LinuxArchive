FROM node:22-alpine

RUN apk add --no-cache git bash openssh-client python3 make g++ && corepack enable

WORKDIR /app
EXPOSE 3000

# devcontainer lo mantiene vivo y luego ejecuta postStartCommand
CMD ["sleep", "infinity"]
