import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import DoneAll from "@mui/icons-material/DoneAll";
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { useState, useEffect } from "react";


import Table from "react-bootstrap/Table";
import styles from "./romaneios.module.css";

import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { selectIsAdminUser } from "../../../store/user/user.selector";

const RomaneiosTable = (props) => {
	const {data, handleUpdateCarga, setFilterDataArr, duplicates} = props;

	const theme = useTheme();
    const colors = tokens(theme.palette.mode);

	const isAdmin = useSelector(selectIsAdminUser)

	const [sortBy, setsortBy] = useState(null);
	const [dataFilter, setdataFilter] = useState([]);

	// useEffect(() => {
	// 	setdataFilter(data);
	// 	let newObj = {}
	// 	data.forEach(element => {
	// 		if(newObj[element.fazendaOrigem]){
	// 			newObj[element.fazendaOrigem] += 1
	// 		} else {
	// 			newObj[element.fazendaOrigem] = 1
	// 		}
	// 	});
	// 	const newArr = Object.keys(newObj).map((data) => {
	// 		return ({farm: data, quant: newObj[data]})
	// 	})
	// 	console.log('new Arrr: ', newArr)
	// 	setResumeByFarm(newArr)
	// }, []);

	// useEffect(() => {
	// 	setdataFilter(data);
	// 	let newObj = {}
	// 	data.forEach(element => {
	// 		if(newObj[element.fazendaOrigem]){
	// 			newObj[element.fazendaOrigem] += 1
	// 		} else {
	// 			newObj[element.fazendaOrigem] = 1
	// 		}
	// 	});
	// 	const newArr = Object.keys(newObj).map((data) => {
	// 		return ({farm: data, quant: newObj[data]})
	// 	})
	// 	setResumeByFarm(newArr)
	// }, [data, setResumeByFarm]);

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
			setdataFilter(data)
	}, [sortBy, dataFilter, data]);

	const formatWeight = (peso) => {
		if (peso > 0) {
			return Number(peso).toLocaleString("pt-BR") + " Kg";
		}
		return "-";
	};

	if (data.length === 0) {
		return (
			<Box justifyContent={"center"} alignItems={"center"}>
				<Typography variant="h1" color={"white"} onClick={() => setFilterDataArr(null)} sx={{cursor: 'pointer'}}>
					Sem Romaneios Pendentes
				</Typography>
			</Box>
		);
	}

	const handleOrder = (data) => {
		setsortBy(prev => data);
	};

	const handlerCopyData = (carga) => {
		navigator.clipboard.writeText(carga?.id)
		toast.success(`ID Copiado!!: ${carga.relatorioColheita} - ID: ${carga.id}`,{
			position: 'top-center',
		})
	}

	console.log('Usuário é Admin ?? :, ', isAdmin)

	
	return (
		<Box width={"100%"} height={"100%"}>
			<Table striped bordered hover style={{color: colors.textColor[100], marginBottom: '20px'}} size="">
				<thead style={{backgroundColor: colors.blueOrigin[300]}}>
					<tr>
						<th>Data</th>
						<th
							onClick={() => handleOrder("fazendaOrigem")}
							style={{ cursor: "pointer" }}
						>
							Romaneio
						</th>
						<th>Ticket</th>
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
							const newDate = carga?.pesoBruto > 0 ? carga.entrada.toDate().toLocaleString("pt-BR") : carga.syncDate.toDate().toLocaleString("pt-BR");
							const getTicket = carga?.ticket ? carga.ticket : '-'
							return (
								<tr
									key={i}
									className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${theme.palette.mode === 'light'  && i % 2 !== 0 && styles.oddRowLight}`}
								>
									<td>{newDate}</td>
									<td onClick={() => handlerCopyData(carga)} style={{cursor: 'pointer'}}>{carga.relatorioColheita}</td>
									<td style={{ color: duplicates?.includes(getTicket) &&  'red', fontWeight: duplicates?.includes(getTicket) && 'bold'}}>{getTicket}</td>
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
												onClick={(e) => isAdmin && handleUpdateCarga(e, carga)}
												style={{ padding: "2px" }}
											>
												<DoneAll fontSize="inherit" />
											</IconButton>
										) : (
												<AgricultureIcon fontSize="small" color="warning" />
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
