import axios from "axios";

const baseURL = "https://diamante-quality.up.railway.app/diamante/";
const baseURLdev = "http://localhost:8000/diamante/";

const djangoApi = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURLdev : baseURL,
	headers: {
		"Content-Type": "application/json"
	}
});

export default djangoApi;
