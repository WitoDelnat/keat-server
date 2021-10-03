# # # # # # # # # # # # # # # #
# BUILDER - UI
# # # # # # # # # # # # # # # #
FROM node:14-slim AS builder-ui
WORKDIR /build

COPY ui/package.json ui/yarn.lock ui/
RUN cd ui && yarn install --frozen-lockfile

COPY server/package.json server/yarn.lock server/
RUN cd server && yarn install --frozen-lockfile

COPY . .
RUN cd ui && yarn build

# # # # # # # # # # # # # # # #
# BUILDER - SERVER
# # # # # # # # # # # # # # # #
FROM node:14-slim AS builder-server
WORKDIR /build

COPY server/package.json server/yarn.lock ./
RUN yarn install --frozen-lockfile

COPY server .
RUN yarn build

# # # # # # # # # # # # # # # #
# DIST
# # # # # # # # # # # # # # # #
FROM node:14-slim AS dist
WORKDIR /app

ENV YARN_CACHE_FOLDER /app/cache

COPY server/package.json server/yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY --from=builder-server /build/dist ./dist
COPY --from=builder-ui /build/ui/dist ./public
COPY server/config ./config

ENV NODE_ENV=production

EXPOSE 8080
CMD ["node", "./dist/main.js"]
