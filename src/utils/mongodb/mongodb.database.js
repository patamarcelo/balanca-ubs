import axios from "axios";
var data = JSON.stringify({
	collection: "cantinaUbs",
	database: "test",
	dataSource: "Cluster0"
});

var config = {
	method: "post",
	url: "https://data.mongodb-api.com/app/data-ngbze/endpoint/data/v1/action/find",
	headers: {
		Authorization: `Bearer ${process.env.REACT_APP_MONGODB_TOKEN}`,
		"Content-Type": "application/json"
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
