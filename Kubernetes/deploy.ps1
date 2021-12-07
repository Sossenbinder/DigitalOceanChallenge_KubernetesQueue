param (
	[string] $configuration = "prod"
)

if ($configuration -ne "prod") {
	kind create cluster --config=./Kind/kindcluster.yaml

	# Switch to the correct kind cluster
	kubectl config use-context kind-digitaloceanchallenge
}

# Install strimzi
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