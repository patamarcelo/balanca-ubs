import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./retrieve-data.css";

import NoDataShow from "./no-data";
import Chip from "@mui/material/Chip";

const DICT_COLOR = {
	"Semente Arroz 424": "rgb(255, 208, 80)",
	"Semente Arroz 704": "rgb(171,202,221)"
};
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
						width: "100%",
						border: "0.5px solid",
						borderColor: "whitesmoke",
						borderRadius: "8px"
					}}
				>
					Semente
				</Typography>
			</Box>
			<table className={classes.table}>
				<thead>
					<tr>
						<th>Data Solicitação</th>
						<th>Origem</th>
						<th>Destino</th>
						<th>Produto</th>
						<th>Peso</th>
						<th>Bags</th>
						<th>Data Envio</th>
						<th>Obs.</th>
						<th>Situação</th>
					</tr>
				</thead>
				<tbody>
					{data.map((data, i) => {
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
								<th>{data.Origem}</th>
								<th>{data.Destino}</th>

								<th>
									<Chip
										label={data.Produto}
										style={{
											backgroundColor:
												DICT_COLOR[data.Produto],
											width: "90%",
											color: "black",
											maxHeight: "17px",
											margin: "2px auto",
											display: "inline-block",
											textAlign: "center"
										}}
									/>
								</th>

								<th>{data.Peso.toLocaleString("pt-BR")} Kg</th>

								<th>
									{data.Quantidade}{" "}
									{data.Quantidade > 1 ? "Bags" : "Bag"}
								</th>

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

export default SementeTable;
