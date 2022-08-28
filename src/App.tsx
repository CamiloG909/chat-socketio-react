import { useEffect, useState } from "react";
import logo from "./assets/logo.png";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

interface Message {
	body: string;
	from: string;
}

function App() {
	const [message, setMessage] = useState<string>("");
	const [messages, setMessages] = useState<Message[]>([]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		socket.emit("message", message);
		//@ts-ignore
		e.target.reset();
		setMessages([
			...messages,
			{
				body: message,
				from: "Me",
			},
		]);
		setMessage("");
	};

	const classMessage = 'p-2 rounded-lg mb-3 inline-block';

	useEffect(() => {
		const receiveMessage = (message: Message) =>
			setMessages([...messages, message]);

		socket.on("message", receiveMessage);

		return () => {
			socket.off("message", receiveMessage);
		};
	}, [messages]);

	return (
		<main>
			<header className="flex items-center justify-center my-1 mx-auto h-32 w-[95%] max-w-2xl select-none cursor-pointer" onClick={() => window.location.reload()}>
				<img src={logo} className="max-h-28" alt="Logo header"></img>
				<h1 className="font-bold text-green text-5xl">CHAT SOCKETS</h1>
			</header>
			<section className="relative mx-auto mb-12 p-5 w-[95%] max-w-lg rounded-md normal-shadow bg-gray">
				{messages.map((message, index) => (
					<article key={index} className={message.from === 'Me' ? 'text-end' : 'text-start'}>
						<p className={message.from === 'Me' ? `${classMessage} bg-[#337c4d]` : `${classMessage} bg-green`}>
							{message.from}: {message.body}
						</p>
					</article>
				))}
				<form
					onSubmit={handleSubmit}
					className="mt-6 w-full bottom-0 left-0 flex justify-between"
				>
					<input
						className="input w-[80%] px-1 font-medium"
						type="text"
						name="message"
						onChange={(e) => setMessage(e.target.value)}
					/>
					<button className="button-green w-[18%] py-1">
						Send <i className="bi bi-send"></i>
					</button>
				</form>
			</section>
		</main>
	);
}

export default App;
