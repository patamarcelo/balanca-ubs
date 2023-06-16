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
	// url: "https://data.mongodb-api.com/app/data-ngbze/endpoint/data/v1/action/find",
	url: "https://sa-east-1.aws.data.mongodb-api.com/app/data-acjyg/endpoint/data/v1",
	headers: {
		// Authorization: `Bearer ${process.env.REACT_APP_MONGODB_TOKEN}`,
		"Content-Type": "application/json",
		"Access-Control-Request-Headers": "*",
		"api-key": process.env.REACT_APP_MONGODB_TOKEN_DEFENSIVOS
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
