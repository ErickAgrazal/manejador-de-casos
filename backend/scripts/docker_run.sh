#!/bin/bash
##############################
# SCRIPT VARIABLES ###########
##############################
BASEDIR=$(dirname $( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd ))
DOCKER_IMAGE=peqalive/manejador-de-casos/backend

##############################
# SCRIPT LOGIC ###############
##############################
docker run --rm --env-file ${BASEDIR}/.env \
    -v "${BASEDIR}:/usr/src/app" \
    $DOCKER_IMAGE $@