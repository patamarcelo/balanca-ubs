import { Box, IconButton, Typography } from "@mui/material";
import DoneAll from "@mui/icons-material/DoneAll";
import WarningIcon from "@mui/icons-material/Warning";
import { useState, useEffect } from "react";

import Table from "react-bootstrap/Table";
import styles from "./romaneios.module.css";

import moment from "moment";

const RomaneiosTable = ({ data, handleUpdateCarga, colors }) => {
	const [sortBy, setsortBy] = useState(null);
	const [dataFilter, setdataFilter] = useState([]);

	useEffect(() => {
		setdataFilter(data);
	}, []);

	useEffect(() => {
		setdataFilter(data);
	}, [data]);

	useEffect(() => {
		if (sortBy === "fazendaOrigem") {
			const sortArr = dataFilter.sort((a, b) =>
				a["fazendaOrigem"].localeCompare(b["fazendaOrigem"])
			);
			setdataFilter(sortArr);
		}
		if (sortBy === "relatorioColheita") {
			const sortArr = dataFilter.sort((a, b) => {
				console.log(a.relatorioColheita);
				return b.relatorioColheita - a.relatorioColheita;
			});
			setdataFilter(sortArr);
		}
	}, [sortBy, dataFilter]);

	const formatWeight = (peso) => {
		if (peso > 0) {
			return Number(peso).toLocaleString("pt-BR") + " Kg";
		}
		return "-";
	};

	if (data.length === 0) {
		return (
			<Box justifyContent={"center"} alignItems={"center"}>
				<Typography variant="h1" color={"white"}>
					Sem Romaneios Pendentes
				</Typography>
			</Box>
		);
	}

	const handleOrder = (data) => {
		console.log(data);
		setsortBy(data);
	};

	return (
		<Box width={"100%"}>
			<Table striped bordered hover style={{color: colors.textColor[100]}}>
				<thead>
					<tr>
						<th>Data</th>
						<th
							onClick={() => handleOrder("fazendaOrigem")}
							style={{ cursor: "pointer" }}
						>
							Romaneio
						</th>
						<th
							onClick={() => handleOrder("relatorioColheita")}
							style={{ cursor: "pointer" }}
						>
							Projeto
						</th>
						<th>Parcelas</th>
						<th>Placa</th>
						<th>Motorista</th>
						<th>Destino</th>
						<th>Bruto</th>
						<th>Tara</th>
						<th>Líquido</th>
						<th>Saída</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{dataFilter &&
						dataFilter.map((carga, i) => {
							const newDate = carga.syncDate.toDate().toLocaleString("pt-BR");
							return (
								<tr
									key={i}
									className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow}`}
								>
									<td>{newDate}</td>
									<td>{carga.relatorioColheita}</td>
									<td>{carga.fazendaOrigem}</td>
									<td>
										{carga.parcelasNovas
											.sort((a, b) => a.localeCompare(b))
											.join(", ")}
									</td>
									<td>
										{carga.placa.slice(0, 3)}-{carga.placa.slice(3, 12)}
									</td>
									<td>{carga.motorista}</td>
									<td>{carga.fazendaDestino}</td>
									<td>
										{carga.pesoBruto
											? formatWeight(carga.pesoBruto)
											: formatWeight(0)}
									</td>
									<td>
										{carga.tara ? formatWeight(carga.tara) : formatWeight(0)}
									</td>
									<td>
										{carga.liquido
											? formatWeight(carga.liquido)
											: formatWeight(0)}
									</td>
									<td>
										{carga?.saida
											? carga?.saida.toDate().toLocaleString("pt-BR")
											: "-"}
									</td>
									<td>
										{carga.saida ? (
											<IconButton
												aria-label="delete"
												size="sm"
												color={carga.saida ? "success" : "warning"}
												onClick={(e) => handleUpdateCarga(e, carga)}
												style={{ padding: "2px" }}
											>
												<DoneAll fontSize="inherit" />
											</IconButton>
										) : (
												<WarningIcon fontSize="small" color="warning" />
										)}
									</td>
								</tr>
							);
						})}
				</tbody>
			</Table>
		</Box>
	);
};

export default RomaneiosTable;
