import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useEffect, useState } from "react";

import SementeTable from "./semente";
import DefensivoTable from "./defensivo";
import BiologicoTable from "./biologico";

import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import ptBR from "dayjs/locale/pt-br";

const RetrieveData = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const url = "https://docs.google.com/spreadsheets/d/";
	const ssid = "1sZIIxALlkeQtZ11j7ZDRh6Z46LpcMHfiEHY5AVam6Ok";
	const query1 = `/gviz/tq?`;
	const query2 = "tqx=out:json";
	const query3 = "sheet=Extrato";
	const url1 = `${url}${ssid}${query1}&${query2}&${query3}`;

	const url_bio = "https://docs.google.com/spreadsheets/d/";
	const ssid_bio = "1xeRBIY_c7qdP1R5Bg2AjvSNmrNDJ-pSPuNEznenFxMI";
	const query1_bio = `/gviz/tq?`;
	const query2_bio = "tqx=out:json";
	const query3_bio = "sheet=Biologico";
	const url1_bio = `${url_bio}${ssid_bio}${query1_bio}&${query2_bio}&${query3_bio}`;

	const [dataArr, setDataArr] = useState([]);
	const [filteredArr, setFilteredArr] = useState([]);

	const [dataBioArr, setDataBioArr] = useState([]);
	const [filteredBioArr, setFilteredBioArr] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	const [isdone, setIsDone] = useState(true);

	const [value, setValue] = useState("");

	const handleChange = (newValue) => {
		console.log(newValue);
		const date = new Date(newValue);
		let formatFfDateHoje = "";
		let formatEnvioDate = "";
		const formDate = date?.toLocaleDateString("en-US", {
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		});
		const [formmonth, formday, formyear] = formDate.split("/");
		const formatFormDateHoje = [formyear, formmonth, formday].join("-");

		const filteredData = dataArr.filter((data) => {
			if (data["Data Solicitação"]?.length > 4) {
				if (data["Data Envio"]?.length > 4) {
					var sendData = data["Data Envio"]
						.split("(")[1]
						.split(")")[0];

					const mapData = sendData
						.split(",")
						.map((data) => Number(data));
					formatEnvioDate = new Date(...mapData);
				}

				formatFfDateHoje = new Date(
					data["Data Solicitação"].split("/").reverse().join("-")
				);
			} else {
				formatFfDateHoje = "2222/01/01";
			}
			return (
				data["Situação"] === "Pendente" ||
				new Date(formatFfDateHoje) >= new Date(formatFormDateHoje) ||
				new Date(formatEnvioDate) >= new Date(formatFormDateHoje)
			);
		});
		setFilteredArr(filteredData);
		setValue(newValue);
	};

	// useEffect(() => {
	// 	console.log("New Data: ", value.toLocaleString("pt-BR"));
	// }, [value]);

	useEffect(() => {
		if (dataArr) {
			const diaNovo = new Date();
			handleChange(diaNovo);
		}
	}, [dataArr]);

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
						row.c.forEach((cell, index) => {
							let cellValue = cell === null ? "-" : cell.v;
							if (index === 0) {
								cellValue = cell?.f;
							}
							// if (index === 16 && cellValue.length > 1) {
							// 	cellValue = cell.f;
							// }
							newObj[columnsHeader[index]?.label] = cellValue;
						});
						newDict.push(newObj);
					});
					const filteredData = newDict.filter((data) => {
						const diaNovo = new Date();
						// const ontem = "12/02/2023";
						const hoje = diaNovo
							.toLocaleString("PT-br")
							.split(" ")[0];
						if (
							data["Data Solicitação"] !== undefined &&
							data["Data Envio"] !== undefined &&
							data["Data Envio"].length > 4
						) {
							var sendData = data["Data Envio"]
								.split("(")[1]
								.split(")")[0];
							const mapData = sendData
								.split(",")
								.map((data) => Number(data));
							let fDate = new Date(...mapData);
							var ffDate = fDate.toLocaleDateString("pt-BR", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit"
							});
						} else {
							ffDate = "01/01/2222";
						}

						const [day, month, year] = hoje.split("/");
						const formatDateHoje = [year, month, day].join("-");

						const [ffday, ffmonth, ffyear] = ffDate.split("/");
						const formatDateffDate = [ffyear, ffmonth, ffday].join(
							"-"
						);

						return (
							data["Situação"] === "Pendente" ||
							new Date(formatDateffDate) >=
								new Date(formatDateHoje)
						);
					});
					setFilteredArr(filteredData);
					setDataArr(newDict);
				});
		} catch (err) {
			console.log("Erro ao pegar os dados ", err);
		} finally {
			setIsLoading(false);
		}
	};
	const getDataBio = async () => {
		try {
			await fetch(url1_bio)
				.then((data) => data.text())
				.then((data) => {
					const temp = data.substring(47).slice(0, -2);
					const json = JSON.parse(temp);
					const columnsHeader = json.table.cols;
					let newDict = [];
					json.table.rows.forEach((row, index) => {
						let newObj = {};
						row.c.forEach((cell, index) => {
							let cellValue = cell === null ? "-" : cell.v;
							if (index === 0) {
								cellValue = cell?.f;
							}
							if (index === 18 && cellValue.length > 1) {
								cellValue = cell.f;
							}
							newObj[columnsHeader[index]?.label] = cellValue;
						});
						newDict.push(newObj);
					});
					const filteredData = newDict.filter((data) => {
						console.log(data);
						const diaNovo = new Date();
						// const ontem = "12/02/2023";
						const hoje = diaNovo
							.toLocaleString("PT-br")
							.split(" ")[0];
						if (
							data["Data Solicitação"] !== undefined &&
							data["Data Envio"] !== undefined &&
							data["Data Envio"].length > 4
						) {
							var sendData = data["Data Envio"]
								.split("(")[1]
								.split(")")[0];
							const mapData = sendData
								.split(",")
								.map((data) => Number(data));
							let fDate = new Date(...mapData);
							var ffDate = fDate.toLocaleDateString("pt-BR", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit"
							});
						} else {
							ffDate = "01/01/2222";
						}

						const [day, month, year] = hoje.split("/");
						const formatDateHoje = [year, month, day].join("-");

						const [ffday, ffmonth, ffyear] = ffDate.split("/");
						const formatDateffDate = [ffyear, ffmonth, ffday].join(
							"-"
						);

						return (
							data["Situação"] === "Pendente" ||
							new Date(formatDateffDate) >=
								new Date(formatDateHoje)
						);
					});
					setFilteredBioArr(filteredData);
					setDataBioArr(newDict);
				});
		} catch (err) {
			console.log("Erro ao pegar os dados ", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		getData();
	}, []);

	useEffect(() => {
		getDataBio();
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
				borderRadius: "8px",
				"& .MuiOutlinedInput-notchedOutline ": {
					borderColor: "gray !important"
				},
				"& .MuiInputLabel-outlined": {
					// color: "white !important"
					color: `whitesmoke !important`
				},
				maxHeight: "100%",
				minHeight: "92%",
				overflow: "auto"
			}}
		>
			{isdone && (
				<LocalizationProvider
					dateAdapter={AdapterDayjs}
					// adapterLocale="en"
					adapterLocale={ptBR}
				>
					<DesktopDatePicker
						label="Data de Início"
						inputFormat="DD/MM/YYYY"
						value={value}
						onChange={handleChange}
						renderInput={(params) => (
							<TextField
								style={{
									backgroundColor: colors.blueOrigin[800]
								}}
								size="small"
								{...params}
								placeholder="Data de início"
							/>
						)}
					/>
				</LocalizationProvider>
			)}
			<Box
				display="flex"
				flexDirection="column"
				gap="80px"
				mt={3}
				// height="100%"
				sx={{
					justifyContent: "space-evenly",
					alignItems: "center",
					marginBottom: "10px"
				}}
			>
				<SementeTable
					data={filteredArr.filter(
						(data) =>
							data["Solicitação"].toLowerCase() === "semente"
					)}
				/>

				<DefensivoTable
					data={filteredArr.filter(
						(data) =>
							data["Solicitação"].toLowerCase() !== "semente"
					)}
				/>

				{dataBioArr && dataBioArr.length > 0 && (
					<BiologicoTable data={dataBioArr} dateFilt={value} />
				)}
			</Box>
		</Box>
	);
};

export default RetrieveData;
