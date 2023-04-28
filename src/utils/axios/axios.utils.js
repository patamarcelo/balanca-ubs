import axios from "axios";

// const baseURL = "https://diamante-quality.up.railway.app/diamante/";
const baseURL = "http://localhost:8000/diamante/";

const djangoApi = axios.create({
	baseURL: baseURL,
	headers: {
		"Content-Type": "application/json"
	}
});

export default djangoApi;
