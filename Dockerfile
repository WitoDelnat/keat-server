# # # # # # # # # # # # # # # #
# BUILDER
# # # # # # # # # # # # # # # #
FROM node:14-slim AS builder
WORKDIR /build

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# # # # # # # # # # # # # # # #
# DIST
# # # # # # # # # # # # # # # #
FROM node:14-slim AS dist
WORKDIR /app

ENV YARN_CACHE_FOLDER /app/cache

COPY package.json yarn.lock ./
RUN yarn install --production --frozen-lockfile && yarn cache clean

COPY --from=builder /build/dist ./dist
COPY config ./config

ENV NODE_ENV=production

EXPOSE 8080
CMD ["node", "./dist/main.js"]
