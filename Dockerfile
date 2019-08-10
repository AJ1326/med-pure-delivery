### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:10-alpine as builder

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

ARG GIT_HASH
ENV GIT_HASH=${GIT_HASH}

COPY . .

RUN node getVersion.js ${GIT_HASH}


ARG BUILD_COMMAND
ENV BUILD_COMMAND=${BUILD_COMMAND}

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build:prod


### STAGE 2: Setup ###

FROM nginx:1.13.3

## Copy our default nginx config
EXPOSE 80

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
#COPY ./nginx/server.crt /etc/nginx/server.crt
#COPY ./nginx/server.key /etc/nginx/server.key


## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /ng-app/dist /usr/share/nginx/html

#RUN sed -i 's/\r//' /usr/share/nginx/html
RUN chmod +x /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
