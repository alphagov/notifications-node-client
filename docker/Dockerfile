FROM node:6.5.0-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN \
	echo "Install base packages" \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		make \
	&& echo "Clean up" \
	&& rm -rf /var/lib/apt/lists/* /tmp/*

WORKDIR /var/project
