import axios from "axios";

const baseURL = "https://pitaya-server.herokuapp.com/";
const baseURLdev = "http://localhost:5500/";

export const createClient = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURLdev : baseURL,
	headers: {
		"Content-Type": "application/json"
	}
});
