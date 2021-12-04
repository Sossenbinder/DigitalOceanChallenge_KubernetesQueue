import express from "express";
import { Kafka, logLevel } from "kafkajs";
import { WebSocketServer, WebSocket } from "ws";

// Express
const app = express();
app.use(express.json());
const port = 3000;

// Websocket
const wss = new WebSocketServer({ port: 8080 });
let clientConnection: WebSocket | null = null;
wss.on("connection", (conn) => (clientConnection = conn));
wss.on("close", () => (clientConnection = null));

// Kafka
const kafkaConnection = new Kafka({
	clientId: "example-app",
	brokers: [process.env.KAFKA_CONNECTION]
});
const kafkaTopic = "digitalocean-topic";
const producer = kafkaConnection.producer();

// Routes
app.post("/publishMessage", async (req, res) => {
	console.log("Received");
	const payload = req.query.message as string | null;
	console.log(payload);
	console.log(req);

	if (!payload) {
		res.sendStatus(400);
		return;
	}

	console.log(`Received valid message: ${payload}`);

	try {
		await producer.send({
			topic: kafkaTopic,
			messages: [{ value: payload }]
		});
	} catch (err) {
		console.log(err);
	}
	res.sendStatus(200);
});

(async () => {
	console.log("Connecting");

	try {
		const consumer = kafkaConnection.consumer({ groupId: "digitalocean-group" });

		await Promise.all([producer.connect(), consumer.connect()]);

		await consumer.subscribe({ topic: kafkaTopic, fromBeginning: true });

		await consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				clientConnection?.send(
					JSON.stringify({
						topic,
						partition,
						message: message.value.toString()
					})
				);
			}
		});
	} catch (err) {
		console.log(err);
	}

	app.listen(port, () => console.log("Server running..."));
})();
