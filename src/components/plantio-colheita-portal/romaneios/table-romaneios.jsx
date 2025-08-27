import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import DoneAll from "@mui/icons-material/DoneAll";
import PublishedWithChanges from '@mui/icons-material/PublishedWithChanges'
import CircularProgress from "@mui/material/CircularProgress";
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

import { nodeServerSrd } from "../../../utils/axios/axios.utils";

import Tooltip from '@mui/material/Tooltip';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const RomaneiosTable = (props) => {
	const { data, handleUpdateCarga, setFilterDataArr, duplicates, duplicatesPlates, selected } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const isAdmin = useSelector(selectIsAdminUser)

	const [sortBy, setsortBy] = useState(null);
	const [dataFilter, setdataFilter] = useState([]);

	const [isLoadingTicket, setIsLoadingTicket] = useState({});


	const [sortDirection, setSortDirection] = useState("asc"); // or 'desc'

	useEffect(() => {
		console.log('direccc', sortDirection)
	}, [sortDirection]);

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
		{ cultura: "FEIJAO MUNGO", icon: beans, alt: "feijao" },
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
			// const sortArr = dataFilter.sort((a, b) =>
			// 	a["fazendaOrigem"].localeCompare(b["fazendaOrigem"])
			// );
			const sortArr = dataFilter.sort((a, b) => {
				const fazendaCompare = a["fazendaOrigem"].localeCompare(b["fazendaOrigem"]);
				if (fazendaCompare !== 0) {
					return fazendaCompare;
				}
				return Number(a["ticket"]) - Number(b["ticket"]); // ordena por ticket se fazendaOrigem for igual
			});
			setdataFilter(sortArr);
		}
		if (sortBy === "relatorioColheita") {
			const sortArr = dataFilter.sort((a, b) => {
				return b.relatorioColheita - a.relatorioColheita;
			});
			setdataFilter(sortArr);
		}
		if (sortBy === "parcelas") {
			const sortArr = [...dataFilter].sort((a, b) => {
				const parcelaA = a.parcelasObjFiltered?.[0]?.parcela || "";
				const parcelaB = b.parcelasObjFiltered?.[0]?.parcela || "";

				// If either parcela is missing, push it to the end
				if (!parcelaA && !parcelaB) return 0;
				if (!parcelaA) return 1;
				if (!parcelaB) return -1;

				// Match prefix and number
				const matchA = parcelaA.match(/^([A-Za-z]+)(\d+)$/);
				const matchB = parcelaB.match(/^([A-Za-z]+)(\d+)$/);

				if (!matchA || !matchB) return parcelaA.localeCompare(parcelaB);

				const [, prefixA, numberA] = matchA;
				const [, prefixB, numberB] = matchB;

				if (prefixA !== prefixB) {
					return prefixA.localeCompare(prefixB);
				}
				return parseInt(numberA) - parseInt(numberB);
			});

			setdataFilter(sortArr);
		}
		setdataFilter(data)
	}, [sortBy, dataFilter, data]);


	useEffect(() => {
		if (selected.length === 0) {
			setSortDirection(null)
			setsortBy(null)
		}
	}, [selected]);

	const formatWeight = (peso) => {
		if (peso > 0) {
			return Number(peso).toLocaleString("pt-BR") + " Kg";
		}
		return "-";
	};
	const formatPercent = (data) => {
		if (data > Number(0)) {
			return Number(data).toLocaleString("pt-br", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2
			}) + " %"
		}
		return "-";
	}



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
		setsortBy(data); // No need for a function here

		setSortDirection((prev) => {
			return prev === 'asc' ? 'desc' : 'asc';
		});
	};
	const handlerCopyData = (carga) => {
		navigator.clipboard.writeText(carga?.id)
		toast.success(`ID Copiado!!: ${carga.relatorioColheita} - ID: ${carga.id}`, {
			position: 'top-center',
		})
	}

	const handleRefreshTicket = async (e, carga) => {
		console.log('data id ', carga?.id)
		setIsLoadingTicket((prev) => ({ ...prev, [carga?.id]: true }));
		toast.success(`ID Reenviado!!: ${carga.relatorioColheita} - ID: ${carga.id}`, {
			position: 'top-center',
		})
		try {
			const response = await nodeServerSrd
				.post("resend-to-protheus/", {
					id: carga?.id,
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					},
				})
				.catch((err) => console.log(err));
			console.log('response', response)
			const { status, data } = response
			if (status === 200) {
				toast.success(`Ticket Atualizado com sucesso!!: ${carga.relatorioColheita} - ID: ${data.ticket}`, {
					position: 'top-center',
				})
			}
			return response;
		} catch (error) {
			toast.error(`Problema ao enviar para o protheus!!: ${carga.relatorioColheita} - ID: ${carga.id}`, {
				position: 'top-center',
			})
		} finally {
			setIsLoadingTicket((prev) => ({ ...prev, [carga?.id]: false }));
		}
	}

	return (
		<Box width={"100%"} height={"100%"}>
			<Table striped bordered hover style={{ color: colors.textColor[100], marginBottom: '20px' }} size="" className={styles.romaneioTable}>
				<thead style={{ backgroundColor: colors.blueOrigin[400] }}>
					<tr>
						<th>Data</th>
						<th
							onClick={() => handleOrder("relatorioColheita")}
							style={{ cursor: "pointer" }}
						>
							Romaneio {sortBy === "relatorioColheita" && (sortDirection !== "asc" ? "🔼" : "🔽")}
						</th>
						<th>Ticket</th>
						<th
							onClick={() => handleOrder("fazendaOrigem")}
							style={{ cursor: "pointer" }}
						>
							Projeto {sortBy === "fazendaOrigem" && (sortDirection !== "asc" ? "🔼" : "🔽")}
						</th>
						<th onClick={() => handleOrder("parcelas")} style={{ cursor: "pointer" }}>
							Parcelas {sortBy === "parcelas" && (sortDirection !== "asc" ? "🔼" : "🔽")}
						</th>
						<th>Cultura</th>
						<th>Variedade</th>
						<th>Obs</th>
						<th>Placa</th>
						<th>Motorista</th>
						<th>Destino</th>
						<th>Bruto</th>
						<th>Tara</th>
						<th>Líquido</th>
						<th>Umidade</th>
						<th>Impureza</th>
						<th>Saída</th>
						<th>Status</th>
					</tr>
				</thead>
				<tbody>
					{dataFilter &&
						dataFilter.map((carga, i) => {
							const newDate = carga?.pesoBruto > 0 ? carga.entrada.toDate().toLocaleString("pt-BR") : carga.syncDate.toDate().toLocaleString("pt-BR");
							const getTicket = carga?.ticket ? carga.ticket : '-'
							const getCultura = carga?.parcelasObjFiltered ? carga?.parcelasObjFiltered?.map((data) => data.cultura) : undefined
							const getVariedade = carga?.parcelasObjFiltered ? carga?.parcelasObjFiltered?.map((data) => data.variedade) : []
							const filtVariedade = [...new Set(getVariedade)]?.join(' - ')
							const getParcelas = carga?.parcelasObjFiltered ? carga?.parcelasObjFiltered?.map((data) => data.parcela) : []
							// console.log("carga", carga)
							return (
								<tr
									key={i}
									className={`${i % 2 !== 0 ? styles.oddRow : styles.evenRow} ${theme.palette.mode === 'light' && i % 2 !== 0 && styles.oddRowLight}`}
									style={{ borderTop: carga?.firstOne && `0.5px solid ${colors.textColor[100]}` }}
								>
									<td>{newDate}</td>
									<td onClick={() => handlerCopyData(carga)} style={{ cursor: 'pointer' }}>{carga.relatorioColheita}</td>
									{
										(!carga?.ticket && carga?.filialPro && carga?.codTicketPro) ?
											<td>
												<IconButton
													aria-label="delete"
													size="sm"
													color={"success"}
													onClick={(e) => handleRefreshTicket(e, carga)}
													style={{ padding: "2px", justifyContent: 'center' }}
													disabled={isLoadingTicket[carga.id] || false}
												>
													{isLoadingTicket[carga.id] ? (
														<CircularProgress size={16} color="inherit" />
													) : (
														<PublishedWithChanges fontSize="inherit" />
													)}
												</IconButton>
											</td>
											:
											<td style={{ color: duplicates?.includes(getTicket) && 'red', fontWeight: duplicates?.includes(getTicket) && 'bold' }}>{getTicket}</td>
									}
									<td>{carga.fazendaOrigem.replace('Projeto ', '')}</td>
									<td>
										{getParcelas
											.sort((a, b) => a.localeCompare(b))
											.join(", ")}
									</td>
									<td>
										{
											getCultura &&
											<img
												src={filteredIcon(
													getCultura[0]
												)}
												alt={filteredAlt(
													getCultura
												)}
												style={{
													filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
													width: '20px',
													height: '20px'
												}}
											/>
										}
									</td>
									<td>{filtVariedade}</td>
									<td>
										{carga.observacoes ? (
											<Tooltip title={carga.observacoes} arrow
												slotProps={{
													tooltip: {
														sx: {
															fontSize: '1.25rem', // Tamanho de fonte menor
														},
													},
												}}
											>
												<Box>
													<LightbulbOutlinedIcon color={'success'} />
												</Box>
											</Tooltip>
										) : (
											<Box>

											</Box>
										)}
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
										{carga?.umidade
											? formatPercent(carga?.umidade)
											: formatPercent(0)}
									</td>
									<td>
										{carga?.impureza
											? formatPercent(carga?.impureza)
											: formatPercent(0)}
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
											<IconButton
												aria-label="delete"
												size="sm"
												color={"success"}
												onClick={(e) => handleRefreshTicket(e, carga)}
												style={{ padding: "2px", justifyContent: 'center' }}
												disabled={isLoadingTicket[carga.id] || false}
											>
												<AgricultureIcon fontSize="small" color="warning" />
											</IconButton>
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
