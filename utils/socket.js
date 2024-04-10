import { io } from "socket.io-client";
const socket = io("http://192.168.225.85:3007", { transports: ['websocket'] });
//const socket = io("https://connect-q46w.onrender.com", { transports: ['websocket'] });
console.log(socket)
export default socket;