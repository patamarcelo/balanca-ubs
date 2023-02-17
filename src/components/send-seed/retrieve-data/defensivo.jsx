import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./retrieve-data.css";
import NoDataShow from "./no-data";

const DefensivoTable = (props) => {
	const { data } = props;
	const newData = data.sort((a, b) =>
		a["Situação"].localeCompare(b["Situação"])
	);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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
							borderRadius: "8px"
						}}
					>
						ST
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
				marginTop: "30px"
			}}
		>
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
						borderRadius: "8px"
					}}
				>
					ST
				</Typography>
			</Box>
			<table className={classes.table} cellSpacing="1">
				<thead>
					<tr>
						<th>Data Solicitação</th>
						<th>Destino</th>
						<th>Projeto</th>
						<th>ST</th>
						<th>Data Envio</th>
						<th>Obs.</th>
						<th>Situação</th>
					</tr>
				</thead>
				<tbody>
					{newData.map((data, i) => {
						if (data["Data Envio"].length > 4) {
							var sendData = data["Data Envio"]
								.split("(")[1]
								.split(")")[0];
							const mapData = sendData
								.split(",")
								.map((data) => Number(data));
							let fDate = new Date(...mapData);
							const ffDate = fDate.toLocaleDateString("pt-BR", {
								year: "numeric",
								month: "2-digit",
								day: "2-digit"
							});
							var envDateFormat = `${ffDate} - ${fDate.toLocaleTimeString()}`;
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
									{data["Data Solicitação"]}
								</th>
								<th>{data.Destino}</th>
								<th>{data.Projeto}</th>
								<th>{data["Nº Solicitação"]}</th>
								<th className="data-format">{envDateFormat}</th>
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

export default DefensivoTable;
