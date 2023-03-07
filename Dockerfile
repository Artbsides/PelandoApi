FROM node:19.7.0-alpine As development

WORKDIR /pelando-api

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci
COPY . .

FROM node:19.7.0-alpine As build

WORKDIR /pelando-api

COPY package*.json ./
COPY --from=development /pelando-api/node_modules ./node_modules
COPY . .

RUN npm run build

ENV NODE_ENV ${NODE_ENV}

RUN npm ci --only=production
RUN npm cache clean --force

FROM node:19.7.0-alpine As production

COPY --from=build /pelando-api/node_modules ./node_modules
COPY --from=build /pelando-api/dist ./dist

CMD [ "node", "dist/Api/Main" ]
