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

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import cotton from '../../../utils/assets/icons/cotton.png'
import question from '../../../utils/assets/icons/question.png'

const RomaneiosTable = (props) => {
	const { data, handleUpdateCarga, setFilterDataArr, duplicates, duplicatesPlates } = props;

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

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" },
		{ cultura: "Algodão", icon: cotton, alt: "algodao" },
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data
		);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return question;
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data
		);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return question;
	};

	useEffect(() => {
		if (sortBy === "fazendaOrigem") {
			const sortArr = dataFilter.sort((a, b) =>
				a["fazendaOrigem"].localeCompare(b["fazendaOrigem"])
			);
			setdataFilter(sortArr);
		}
		if (sortBy === "relatorioColheita") {
			const sortArr = dataFilter.sort((a, b) => {
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
				<Typography variant="h1" color={"white"} onClick={() => setFilterDataArr(null)} sx={{ cursor: 'pointer' }}>
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
		toast.success(`ID Copiado!!: ${carga.relatorioColheita} - ID: ${carga.id}`, {
			position: 'top-center',
		})
	}

	return (
		<Box width={"100%"} height={"100%"}>
			<Table striped bordered hover style={{ color: colors.textColor[100], marginBottom: '20px' }} size="" className={styles.romaneioTable}>
				<thead style={{ backgroundColor: colors.blueOrigin[400] }}>
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
						<th>Cultura</th>
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
							console.log('Carga detail:::', carga)
							const newDate = carga?.pesoBruto > 0 ? carga.entrada.toDate().toLocaleString("pt-BR") : carga.syncDate.toDate().toLocaleString("pt-BR");
							const getTicket = carga?.ticket ? carga.ticket : '-'
							return (
								<tr
									key={i}
									className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${theme.palette.mode === 'light' && i % 2 !== 0 && styles.oddRowLight}`}
									style={{ borderTop: carga?.firstOne && `0.5px solid ${colors.textColor[100]}` }}
								>
									<td>{newDate}</td>
									<td onClick={() => handlerCopyData(carga)} style={{ cursor: 'pointer' }}>{carga.relatorioColheita}</td>
									<td style={{ color: duplicates?.includes(getTicket) && 'red', fontWeight: duplicates?.includes(getTicket) && 'bold' }}>{getTicket}</td>
									<td>{carga.fazendaOrigem}</td>
									<td>
										{carga.parcelasNovas
											.sort((a, b) => a.localeCompare(b))
											.join(", ")}
									</td>
									<td>
										<img
											src={filteredIcon(
												carga.cultura
											)}
											alt={filteredAlt(
												carga.cultura
											)}
											style={{
												filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
												width: '20px',
												height: '20px'
											}}
										/>
									</td>
									<td style={{ color: duplicatesPlates?.includes(carga.placa) && 'red', fontWeight: duplicatesPlates?.includes(carga.placa) && 'bold' }}>
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
