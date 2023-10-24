import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./retrieve-data.css";
import NoDataShow from "./no-data";

import Switch from "@mui/material/Switch";
import { useState, useEffect } from "react";

const BiologicoTable = (props) => {
	const [checked, setChecked] = useState(false);
	const { data, dateFilt } = props;
	const newData = data.sort((a, b) =>
		b["Situação"]?.localeCompare(a["Situação"])
	);

	const [filteredData, setFilteredData] = useState([]);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const handlerCheked = () => {
		setChecked(!checked);
	};

	useEffect(() => {
		setFilteredData(newData);
	}, []);

	useEffect(() => {
		if (checked) {
			const newFiltData = filteredData.filter(
				(data) => data["Situação"] === "Pendente"
			);
			setFilteredData(newFiltData);
		} else {
			setFilteredData(newData);
		}
	}, [checked]);

	useEffect(() => {
		setTimeout(() => {
			setChecked(true);
		}, 300);
	}, []);

	if (data.length === 0) {
		return (
			<Box
				display="flex"
				flexDirection="column"
				justifyContent="center"
				alignItems="center"
				width="100%"
				sx={{
					marginTop: "10px"
				}}
			>
				<Box width="100%" sx={{ textAlign: "center" }}>
					<Typography
						variant="h2"
						// color={colors.primary[100]}
						color="whitesmoke"
						style={{
							marginBottom: "5px",
							backgroundColor: colors.blueOrigin[800],
							width: "100%",
							border: "0.5px solid",
							borderColor: "whitesmoke",
							borderRadius: "4px"
						}}
					>
						Biológicos
					</Typography>
					<NoDataShow />
				</Box>
			</Box>
		);
	}

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="center"
			alignItems="center"
			width="100%"
			sx={{
				marginTop: "30px",
				marginBottom: "30px"
			}}
		>
			<Box
				sx={{
					display: "flex",
					alignSelf: "end"
				}}
			>
				<Switch
					checked={checked}
					onChange={handlerCheked}
					inputProps={{ "aria-label": "controlled" }}
					color="warning"
				/>
			</Box>
			<Box width="100%" sx={{ textAlign: "center" }}>
				<Typography
					variant="h2"
					color="whitesmoke"
					style={{
						marginBottom: "5px",
						backgroundColor: colors.blueOrigin[800],
						width: "100%",
						border: "0.5px solid",
						borderColor: "whitesmoke",
						borderRadius: "4px"
					}}
				>
					Biológicos
				</Typography>
			</Box>
			<table className={classes.table} cellSpacing="1">
				<thead>
					<tr>
						<th>Data Solicitação</th>
						<th>Solicitação</th>
						<th>Estágio</th>
						<th>Produto</th>
						<th>Quantidade</th>
						<th>Cultura</th>
						<th>Destino</th>
						<th>Projeto</th>
						<th>Data Envio</th>
						<th>Obs.</th>
						<th>Situação</th>
					</tr>
				</thead>
				<tbody>
					{filteredData
						.filter((data) => {
							const newDateF = new Date(
								data["BIOLÓGICOS Data Solicitação"]
									.split("/")
									.reverse()
									.join("-")
							);
							if (dateFilt) {
								return newDateF > dateFilt;
							} else {
								return data;
							}
						})
						.map((data, i) => {
							if (data["Data Envio"].length > 4) {
								var sendData = data["Data Envio"]
									.split("(")[1]
									.split(")")[0];
								const mapData = sendData
									.split(",")
									.map((data) => Number(data));
								let fDate = new Date(...mapData);
								const ffDate = fDate.toLocaleDateString(
									"pt-BR",
									{
										year: "numeric",
										month: "2-digit",
										day: "2-digit"
									}
								);
								// var envDateFormat = `${ffDate} - ${fDate.toLocaleTimeString()}`;
								var envDateFormat = ffDate;
							} else {
								envDateFormat = " - ";
							}
							const fontColor =
								data["Situação"] === "Pendente"
									? "solicitacao-pendente"
									: "solicitacao-atendida";
							return (
								<tr key={i} className={fontColor}>
									<th className="data-format">
										{data["BIOLÓGICOS Data Solicitação"]}
									</th>
									<th>{data["Solicitação"]}</th>
									<th>{data["Estágio"]}</th>
									<th>{data.Produto}</th>
									<th>
										{data.Quantidade.toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 2,
												maximumFractionDigits: 2
											}
										)}
									</th>
									<th>{data.Cultura}</th>
									<th>{data.Destino}</th>
									<th>{data.Projeto}</th>
									<th className="data-format">
										{envDateFormat}
									</th>
									<th>{data.OBS}</th>
									<th>{data["Situação"]}</th>
								</tr>
							);
						})}
				</tbody>
			</table>
		</Box>
	);
};

export default BiologicoTable;
