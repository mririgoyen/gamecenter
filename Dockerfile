# Start a container to build GameCenter
FROM node:14-alpine AS base

# Copy needed files
COPY ./build/healthcheck.js package.json package-lock.json ecosystem.config.js /gamecenter/
COPY ./client /gamecenter/client
COPY ./modules /gamecenter/modules
COPY ./server /gamecenter/server

# Install dependencies
RUN apk add --no-cache make gcc g++ python git
RUN cd /gamecenter; npm ci

# Build client resources
ARG GAME_VERSION
ARG GOOGLE_CLIENT_ID
ARG EXTRA_LIFE_GAME_DAY
RUN \
  cd /gamecenter/client && \
  NODE_ENV=production GAME_VERSION=$GAME_VERSION GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID EXTRA_LIFE_GAME_DAY=$EXTRA_LIFE_GAME_DAY ../node_modules/.bin/webpack --config ./webpack/prod.webpack.config.js && \
  cd /gamecenter/ && \
  rm -rf /client

# Start new Docker build for production
FROM node:14.14-alpine AS production

# Copy files for production container
COPY --from=base /var/www /var/www
COPY --from=base /gamecenter /gamecenter

# Prune out devDependencies
RUN cd /gamecenter; npm prune --production

# Add executable node packages to PATH
ENV PATH /gamecenter/node_modules/.bin:$PATH

HEALTHCHECK --interval=15s --timeout=15s --start-period=60s CMD node /gamecenter/healthcheck.js

ENTRYPOINT [ "/gamecenter/node_modules/.bin/pm2-runtime", "/gamecenter/ecosystem.config.js" ]