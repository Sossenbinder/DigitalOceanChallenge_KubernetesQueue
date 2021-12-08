This repo tackles the "Deploy a scalable message queue" challenge mentioned in https://www.digitalocean.com/community/pages/kubernetes-challenge#anchor--challenges.

# Setup

As suggested, https://strimzi.io was used to deploy the kafka cluster. Besides that, this repo contains of a client application which allows submitting messages and viewing the logstream.

The client is connected to a node server, which publishes the message to kafka.

On top, the node server is connected to the client through a WebSocket server, which will publish any kafka updates the consumer on the node server receives.

![Example app](https://i.imgur.com/jrKzodh.png)

# Deployment

Steps required to publish:

```
	kubectl create namespace kafka
	kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

	# Create a kafka node through strimzi
	kubectl apply -f ./Resources/kafka/kafkaCluster.yaml -n kafka

	# Create a kafka topic through strimzi
	kubectl apply -f ./Resources/kafka/kafkaTopic.yaml -n kafka

	kubectl apply -k ./Resources/server/overlays/$($configuration)
	kubectl apply -f ./Resources/client/client.yaml

	if ($configuration -eq "prod") {
		kubectl apply -f ./Resources/client/overlays/prod/ingress.yaml
		kubectl apply -f ./Resources/server/overlays/prod/ingress.yaml
	}
```

## Local deployment:

For local deployment, kind is used (see https://kind.sigs.k8s.io/).

In order to deploy, run deploy.ps1 with -configuration dev.

This will setup the respective kind cluster, either through regular kubectl apply -f or kubectly apply -k with kustomize in order to deploy the respective environment setup.

## Prod deployment.

For prod deployment, deploy.ps1 will skip kind and setup for the respective current kubectl context.

In addition, instead of using a nodeport, we make use of a Loadbalancer + several ingress rules here which map the respective paths to the correct service.

The final example app is available at http://188.166.135.128

Things like https etc. were omitted, because this is not necessarily part of the POC
