import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./retrieve-data.css";

import NoDataShow from "./no-data";
import Chip from "@mui/material/Chip";

const DICT_COLOR = {
	"Semente Arroz 424": ["rgb(255, 208, 80)", "black"],
	"Semente Arroz 704": ["rgb(171,202,221)", "black"],
	"Semente Feijão Mungo": ["rgb(17,115,75)", "whitesmoke"],
	"Semente Feijão Branco": ["rgb(231,234,237)", "black"]
	// "Semente Soja": ["rgb(212,237,188)", "black"],
	// "Semente Soja ANsc 88": ["rgb(212,237,188)", "black"],
	// "Semente Soja ANsc 89": ["rgb(212,237,188)", "black"],
	// "Semente Soja TMG 2383": ["rgb(212,237,188)", "black"],
	// "Semente Soja ANsc 84": ["rgb(212,237,188)", "black"],
	// "Semente Soja CG SPEED": ["rgb(212,237,188)", "black"]
	// "Semente Soja 3282": ["rgb(212,237,188)", "black"]
};

const getProdColor = (data) => {
	if (data.includes("Semente Soja")) {
		return ["rgb(212,237,188)", "black"];
	}
	if (DICT_COLOR[data] === undefined) {
		return ["rgb(11,70,109)", "whitesmoke"];
	}

	return DICT_COLOR[data];
};

const SementeTable = (props) => {
	const { data } = props;
	const newData = data.sort((a, b) => {
		const sitB = b["Situação"];
		const sitA = a["Situação"];
		if (sitB && sitA) {
			return b["Situação"].localeCompare(a["Situação"]);
		}
	});
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
							borderRadius: "4px"
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
						borderRadius: "4px"
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
						<th>Bags</th>
						<th>Peso</th>
						<th>Peso Total</th>
						<th>NF</th>
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
							var envDateFormat = `${ffDate}`;
						} else {
							envDateFormat = " - ";
						}

						const fontColor =
							data["Situação"] === "Pendente" ||
							data["Situação"] === null
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
											backgroundColor: getProdColor(
												data.Produto
											)[0],
											width: "90%",
											color: getProdColor(
												data.Produto
											)[1],
											maxHeight: "17px",
											margin: "2px auto",
											display: "inline-block",
											textAlign: "center"
										}}
									/>
								</th>

								<th>
									{data.Quantidade > 0
										? data.Quantidade
										: " - "}
								</th>

								<th>
									{data.Peso > 0
										? data.Peso.toLocaleString("pt-BR") +
										  " Kg"
										: " - "}
								</th>
								<th>
									{data["Peso Total"] > 0
										? data["Peso Total"].toLocaleString(
												"pt-BR"
										  ) + " Kg"
										: " - "}
								</th>

								<th className="data-format">{data["Nº NF"]}</th>
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
