DOCKER_IMAGE_NAME=notifications-node-client

docker run \
  --rm \
  -v "`pwd`:/var/project" \
  --env-file docker.env \
  -it \
  ${DOCKER_IMAGE_NAME} \
  ${@}
