FROM node:6.5.0-slim

ARG APT_HTTP_PROXY

ENV DEBIAN_FRONTEND=noninteractive

COPY etc/apt/sources.list /etc/apt/sources.list

RUN \
	echo "Install base packages" \
	&& ([ -z "$APT_HTTP_PROXY" ] || echo "Acquire::http::Proxy \"${APT_HTTP_PROXY}\";\n" > /etc/apt/apt.conf.d/99HttpProxy) \
	&& apt-get update \
	&& apt-get install -y --no-install-recommends \
		make \
	&& echo "Clean up" \
	&& rm -rf /var/lib/apt/lists/* /tmp/*

WORKDIR /var/project
