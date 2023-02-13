import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./retrieve-data.css";
import NoDataShow from "./no-data";

const DefensivoTable = (props) => {
	const { data } = props;
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
							backgroundColor: colors.blueAccent[800],
							width: "100%"
						}}
					>
						Semente
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
						backgroundColor: colors.blueAccent[800],
						width: "100%"
					}}
				>
					ST
				</Typography>
			</Box>
			<table className={classes.table} cellSpacing="1">
				<thead>
					<tr>
						<th>Data Solicitação</th>
						<th>Fazenda</th>
						<th>Projeto</th>
						<th>ST</th>
						<th>Data Envio</th>
						<th>Obs.</th>
						<th>Situação</th>
					</tr>
				</thead>
				{data.map((data, i) => {
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
							<th className="data-format">
								{data["Data Envio"]}
							</th>
							<th>{data.OBS}</th>
							<th>{data["Situação"]}</th>
						</tr>
					);
				})}
			</table>
		</Box>
	);
};

export default DefensivoTable;
