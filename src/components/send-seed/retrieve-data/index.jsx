import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useEffect, useState } from "react";

import SementeTable from "./semente";
import DefensivoTable from "./defensivo";

import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

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
	const [isLoading, setIsLoading] = useState(true);
	const [isdone, setIsDone] = useState(false);

	const [value, setValue] = useState("");

	const handleChange = (newValue) => {
		const date = new Date(newValue);
		const formDate = date?.toLocaleDateString("pt-BR", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		});
		setValue(formDate);
	};

	useEffect(() => {
		console.log("New Data: ", value.toLocaleString("pt-BR"));
	}, [value]);

	useEffect(() => {
		const diaNovo = new Date();
		const hoje = diaNovo.toLocaleString("pt-BR").split(" ")[0];
		setValue(hoje);
	}, []);

	const getData = async () => {
		try {
			await fetch(url1)
				.then((data) => data.text())
				.then((data) => {
					const temp = data.substring(47).slice(0, -2);
					const json = JSON.parse(temp);
					const columnsHeader = json.table.cols;
					let newDict = [];
					json.table.rows.forEach((row, index) => {
						let newObj = {};
						if (index < 15) {
							row.c.forEach((cell, index) => {
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
						// const ontem = "12/02/2023";
						const hoje = diaNovo
							.toLocaleString("PT-br")
							.split(" ")[0];

						return (
							data["Situação"] === "Pendente" ||
							data["Data Envio"].split(" ")[0] >= hoje
						);
					});
					setDataArr(filteredData);
				});
		} catch (err) {
			console.log("Erro ao pegar os dados ");
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100%"
				sx={{
					backgroundColor: colors.blueOrigin[700]
				}}
			>
				<Typography
					variant="h2"
					color={colors.yellow[700]}
					sx={{ fontWeight: "bold" }}
				>
					<CircularProgress sx={{ color: colors.primary[100] }} />
				</Typography>
			</Box>
		);
	}

	return (
		<Box
			width="100%"
			height="100%"
			p={3}
			sx={{
				backgroundColor: colors.blueOrigin[700],
				margin: "0 10px 10px 0px ",
				borderRadius: "8px"
			}}
		>
			{isdone && (
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DesktopDatePicker
						label="Data de Início"
						inputFormat="DD/MM/YYYY"
						value={value}
						onChange={handleChange}
						renderInput={(params) => <TextField {...params} />}
					/>
				</LocalizationProvider>
			)}
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