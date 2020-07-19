#!/bin/bash
##############################
# SCRIPT VARIABLES ###########
##############################
BASEDIR=$(dirname $( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd ))
DOCKER_IMAGE=peqalive/manejador-de-casos/backend

##############################
# SCRIPT LOGIC ###############
##############################
docker build -t $DOCKER_IMAGE .