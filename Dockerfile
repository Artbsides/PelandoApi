FROM node:19.7.0-alpine As development

WORKDIR /pelando-api

COPY --chown=node:node package*.json ./
COPY prisma ./prisma

RUN npm ci

COPY --chown=node:node . .
USER node

FROM node:19.7.0-alpine As build

WORKDIR /pelando-api

COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /pelando-api/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production
RUN npm cache clean --force

USER node

FROM node:19.7.0-alpine As production

COPY --chown=node:node --from=build /pelando-api/node_modules ./node_modules
COPY --chown=node:node --from=build /pelando-api/dist ./dist

CMD [ "node", "dist/Api/Main" ]
