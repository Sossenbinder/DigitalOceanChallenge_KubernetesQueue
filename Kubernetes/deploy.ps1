kind create cluster --config=./Kind/kindcluster.yaml

& "./Kind/kindRegistry.ps1"

# Switch to the correct kind cluster
kubectl config use-context kind-digitaloceanchallenge

# Install strimzi
kubectl create namespace kafka
kubectl create -f 'https://strimzi.io/install/latest?namespace=kafka' -n kafka

# Create a kafka node through strimzi
kubectl apply -f ./Resources/kafka/kafkaCluster.yaml -n kafka

# Create a kafka topic through strimzi
kubectl apply -f ./Resources/kafka/kafkaTopic.yaml -n kafka 

kubectl apply -f ./Resources/app/api.yaml