This repo tackles the "Deploy a scalable message queue" challenge mentioned in https://www.digitalocean.com/community/pages/kubernetes-challenge#anchor--challenges.

As suggested, strimzi was used to deploy the kafka cluster. Besides that, this repo contains of a client application which allows submitting messages and viewing the logstream.

The client is connected to a node server, which publishes the message to kafka.

On top, the node server is connected to the client through a WebSocket server, which will publish any kafka updates the consumer on the node server receives.

# Deployment

## Local deployment:

For local deployment, kind is used (see https://kind.sigs.k8s.io/).

In order to deploy, run deploy.ps1 with -configuration dev.

This will setup the respective kind cluster, and through regular kubectl apply -f and kubectly apply -k with kustomize the respective mappings.

## Prod deployment.

For prod deployment, deploy.ps1 will skip kind and setup for the respective current kubectl context.
