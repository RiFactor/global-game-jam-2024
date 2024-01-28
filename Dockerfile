FROM node:current-alpine AS builder

RUN apk update && apk upgrade
RUN apk add yarn

COPY . /auto_correet
WORKDIR /auto_correet/client

# install dependencies
RUN yarn
# build the production website
RUN yarn build

FROM python:3.11-alpine
# copy over the production website
COPY . /auto_correet
COPY --from=builder /auto_correet/client/build /auto_correet/client/build
WORKDIR /auto_correet

# update
RUN apk update && apk upgrade
RUN pip3 install --upgrade pip

RUN pip3 install -r ./requirements.txt

EXPOSE 8080
ENTRYPOINT ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8080"]
