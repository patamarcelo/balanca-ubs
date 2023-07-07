import axios from "axios";

var data = JSON.stringify({
	collection: "aplicacoes",
	database: "farmbox",
	dataSource: "Cluster0",
	projection: {
		_id: 1
	}
});

var config = {
	method: "post",
	url: "https://sa-east-1.aws.data.mongodb-api.com/app/data-ksegl/endpoint/data/v1/action/find",
	headers: {
		"Content-Type": "application/json",
		"Access-Control-Request-Headers": "*",
		apiKey: process.env.REACT_APP_MONGODB_TOKEN_DEFENSIVOS
	},
	data: data
};
export const getDataMongoDb = async () => {
	axios(config)
		.then(function (response) {
			console.log(JSON.stringify(response.data));
		})
		.catch(function (error) {
			console.log(error);
		});
};
