docker run -d --restart=always -p 5000:5000 --name kindRegistry registry:2
docker network connect kind kindRegistry
kubectl apply -f ./Kind/kindRegistryConfigMap.yaml