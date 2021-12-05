import React from "react";

import styles from "./App.module.scss";

const websocketUrl = "ws://digitaloceanchallengeserver.default.svc.cluster.local:8080"; // Locally: "ws://localhost:30013"
const nodeUrl = "http://digitaloceanchallengeserver.default.svc.cluster.local:3000"; // Locally: "http://localhost:30012"

const App = () => {
	const [inputMsg, setInputMsg] = React.useState("");
	const [kafkaMessages, setKafkaMessages] = React.useState<Array<string>>([]);
	const logListRef = React.useRef<HTMLDivElement>(null);

	React.useEffect(() => {
		const connection = new WebSocket(websocketUrl);
		connection.onmessage = (msg: MessageEvent<string>) => setKafkaMessages((current) => [...current, msg.data]);
		return () => connection.close();
	}, []);

	React.useEffect(() => {
		if (!logListRef.current) {
			return;
		}

		logListRef.current.scrollTop = logListRef.current.scrollHeight;
	}, [kafkaMessages]);

	const onPublish = async () => {
		if (!inputMsg) {
			return;
		}

		await fetch(`${nodeUrl}/publishMessage?message=${inputMsg}`, { method: "POST", mode: "no-cors" });
	};

	return (
		<div className={styles.App}>
			<div className={styles.ButtonContainer}>
				<div className={styles.PublishContainer}>
					<div className={styles.Publish}>
						<div className={styles.Input}>
							<label htmlFor="message">Message:</label>
							<input type="text" name="message" value={inputMsg} onChange={(event) => setInputMsg(event.target.value)} />
						</div>
						<div className={styles.PublishButton} onClick={onPublish}>
							Publish
						</div>
					</div>
				</div>
				<div className={styles.LogStream}>
					<span className={styles.Label}>Logstream</span>
					<div className={styles.LogList} ref={logListRef}>
						{kafkaMessages.map((msg, index) => (
							<p key={index}>{msg}</p>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default App;
