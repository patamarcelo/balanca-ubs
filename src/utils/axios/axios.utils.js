import axios from "axios";

// DAJNGO SERVER
const baseURL = "https://diamante-quality.up.railway.app/diamante/";
const baseURLdev = "http://localhost:8000/diamante/";

// NODE JS SERVER
const baseURLNode = "https://ubs-nodeserver.up.railway.app/defensivos/";
const baseURLdevNode = "http://localhost:5050/defensivos/";

const baseURLNodeUsers = "https://ubs-nodeserver.up.railway.app/users/";
const baseURLdevNodeUsers = "http://localhost:5050/users/";

const baseURLNodeSRD = "https://ubs-nodeserver.up.railway.app/romaneios/";
const baseURLdevNodeSRD = "http://localhost:5050/romaneios/";

const djangoApi = axios.create({
	baseURL: process.env.NODE_ENV !== "production" ? baseURLdev : baseURL,
	headers: {
		"Content-Type": "application/json"
	}
});

export const nodeServer = axios.create({
	baseURL:
		process.env.NODE_ENV !== "production" ? baseURLdevNode : baseURLNode,
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
	}
});


export const nodeServerSrd = axios.create({
	baseURL:
		process.env.NODE_ENV !== "production" ? baseURLdevNodeSRD : baseURLNodeSRD,
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
	}
});

export const nodeServerUsers = axios.create({
	baseURL:
		process.env.NODE_ENV !== "production" ? baseURLdevNodeUsers : baseURLNodeUsers,
	headers: {
		"Content-Type": "application/json",
		"Authorization": `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
	}
});


export default djangoApi;
