FROM node:latest

WORKDIR /corvo

RUN apt-get update

# meteor installer doesn't work with the default tar binary
RUN apt-get install -y bsdtar \
    && cp $(which tar) $(which tar)~ \
    && ln -sf $(which bsdtar) $(which tar)

# install Meteor forcing its progress
RUN curl "https://install.meteor.com/" \
    | sed 's/VERBOSITY="--silent"/VERBOSITY="--progress-bar"/' \
    | sh

# put back the original tar
RUN mv $(which tar)~ $(which tar)

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 3001

CMD [ "meteor", "--allow-superuser"]
