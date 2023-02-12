import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useEffect, useState } from "react";

import SementeTable from "./semente";
import DefensivoTable from "./defensivo";

const RetrieveData = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const url = "https://docs.google.com/spreadsheets/d/";
	const ssid = "1sZIIxALlkeQtZ11j7ZDRh6Z46LpcMHfiEHY5AVam6Ok";
	const query1 = `/gviz/tq?`;
	const query2 = "tqx=out:json";
	const query3 = "sheet=Extrato";
	const url1 = `${url}${ssid}${query1}&${query2}&${query3}`;

	const [dataArr, setDataArr] = useState([]);

	const getData = () => {
		fetch(url1)
			.then((data) => data.text())
			.then((data) => {
				const temp = data.substring(47).slice(0, -2);
				const json = JSON.parse(temp);
				// console.log(json.table);
				const columnsHeader = json.table.cols;
				// console.log(columnsHeader);
				let newDict = [];
				json.table.rows.forEach((row, index) => {
					let newObj = {};
					if (index < 15) {
						row.c.forEach((cell, index) => {
							// console.log("Cell: ", cell, "INdex: ", index);
							let cellValue = cell === null ? "-" : cell.v;
							if (index === 0) {
								cellValue = cell.f;
							}
							if (index === 11 && cellValue.length > 1) {
								cellValue = cell.f;
							}
							newObj[columnsHeader[index]?.label] = cellValue;
						});
					}
					newDict.push(newObj);
				});
				const filteredData = newDict.filter((data) => {
					const diaNovo = new Date();
					const hoje = diaNovo.toLocaleString("PT-br").split(" ")[0];

					return (
						data["Situação"] === "Pendente" ||
						data["Data Envio"].split(" ")[0] === hoje
					);
				});
				// const filteredArr = filteredData;
				// newDict.map((data) => {
				// 	const diaNovo = new Date();
				// 	const hoje = diaNovo.toLocaleString("PT-br").split(" ")[0];
				// 	console.log(hoje);
				// 	console.log(
				// 		hoje === data["Data Solicitação"].split(" ")[0]
				// 	);
				// 	return console.log(data["Data Solicitação"]);
				// });
				console.log(newDict);
				setDataArr(filteredData);
			});
	};

	useEffect(() => {
		getData();
	}, []);
	return (
		<Box
			width="100%"
			height="100%"
			p={3}
			sx={{
				backgroundColor: colors.blueAccent[700],
				margin: "0 10px 10px 0px ",
				borderRadius: "8px"
			}}
		>
			<Box
				display="flex"
				flexDirection="column"
				gap="80px"
				sx={{
					justifyContent: "space-evenly",
					alignItems: "center"
				}}
			>
				<SementeTable
					data={dataArr.filter(
						(data) =>
							data["Solicitação"].toLowerCase() === "semente"
					)}
				/>

				<DefensivoTable
					data={dataArr.filter(
						(data) =>
							data["Solicitação"].toLowerCase() !== "semente"
					)}
				/>
			</Box>
		</Box>
	);
};

export default RetrieveData;
