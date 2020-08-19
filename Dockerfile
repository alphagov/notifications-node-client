FROM node:12.16.1-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN \
	echo "Install base packages" \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		make \
		gnupg \
	&& echo "Clean up" \
	&& rm -rf /var/lib/apt/lists/* /tmp/*

# npm commands can't be run as root, so add an npm user to run them
# RUN useradd -m npmuser

RUN mkdir -p /var/project

RUN touch /var/project/environment.sh

RUN chown -R node:node /var/project

# WORKDIR /home/node/app
WORKDIR /var/project

# COPY --chown=node:node . .

# RUN chmod -R 755 /var/project

USER node
# RUN ["chmod", "755", "environment.sh"]



# RUN chown node:node /var/project
