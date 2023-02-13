import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./retrieve-data.css";

import NoDataShow from "./no-data";

const SementeTable = (props) => {
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
							backgroundColor: colors.blueOrigin[800],
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
						width: "100%"
					}}
				>
					Semente
				</Typography>
			</Box>
			<table className={classes.table}>
				<thead>
					<tr>
						<th>Data Solicitação</th>
						<th>Produto</th>
						<th>Fazenda</th>
						<th>Peso</th>
						<th>Bags</th>
						<th>Data Envio</th>
						<th>Obs.</th>
						<th>Situação</th>
					</tr>
				</thead>
				<tbody>
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

								<th>{data.Produto}</th>

								<th>{data.Destino}</th>

								<th>{data.Peso.toLocaleString("pt-BR")} Kg</th>

								<th>
									{data.Quantidade}{" "}
									{data.Quantidade > 1 ? "Bags" : "Bag"}
								</th>

								<th className="data-format">
									{data["Data Envio"]}
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

export default SementeTable;
