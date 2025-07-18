import classes from "./farmbox.module.css";
import djangoApi, { nodeServer } from "../../../utils/axios/axios.utils";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, CircularProgress, Typography, useTheme, Paper } from "@mui/material";
import { tokens } from "../../../theme";

import {
	selectApp,
	createDict,
	createDictFarmBox,
	onlyFarm,
	onlyFarmSelector
} from "../../../store/plantio/plantio.selector";
import {
	setApp,
	setAppFarmBox,
	setPluvi
} from "../../../store/plantio/plantio.actions";

import { useDispatch, useSelector } from "react-redux";

import LinearProgress from "@mui/material/LinearProgress";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Divider from "@mui/material/Divider";
import TableDataPage from "./table-data-app";
import HeaderApp from "./header-app";
import ResumoDataPage from "./resumo-data-page";
import ResumoFazendasPage from "./resumos-fazendas-page";

import { geralAppDetail } from "../../../store/plantio/plantio.selector";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";

import { selectCurrentUser } from "../../../store/user/user.selector";
import ModalDataFarmbox from "./grid-data/farm-box-modal";

import IndexModalDataFarmbox from "./index-modal";
import Fade from "@mui/material/Fade";

import Switch from "@mui/material/Switch";
import {
	getNextDays,
	getNextWeekDays
} from "../../../utils/format-suport/data-format";
import PluviDataComp from "./pluvi-data";

import { selectSafraCiclo, } from "../../../store/plantio/plantio.selector";

import useMediaQuery from "@mui/material/useMediaQuery";
import ColheitaModalPage from "./colheita-modal";
import ColheitaPage from "./colheita-section/colheita-index-data";
import ProdutosConsolidados from "./produtos-consolidados";
import PreStPage from "./pre-st";

import toast from "react-hot-toast";
import Swal from "sweetalert2";

import { startTaskMonitor } from "../../../store/tasks/tasks-monitor.actions";

const daysFilter = 12;
const FarmBoxPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const isDark = theme.palette.mode === 'dark'

	const [loadingData, setLoadinData] = useState(false);
	const dispatch = useDispatch();
	const openApp = useSelector(selectApp);
	const dictSelect = useSelector(createDict);
	const dictSelectFarm = useSelector(createDictFarmBox);
	// const onlyFarms = useSelector(onlyFarm);
	const onlyFarms = useSelector(onlyFarmSelector);
	const [filtFarm, setFiltFarm] = useState([]);
	const [filteredApps, setFilteredApps] = useState([]);
	const [saldoAplicar, setSaldoAplicar] = useState(0);
	const [allFarmsSet, setAllFarmsSet] = useState(false);
	const [openAppOnly, setOpenAppOnly] = useState(false);
	const [showFutureApps, setShowFutureApps] = useState(false);
	const dataGeral = useSelector(geralAppDetail(showFutureApps, daysFilter));

	const [IsloadingDbFarm, setIsloadingDbFarm] = useState(false);

	const [isOpenedAll, setIsOpenedAll] = useState(false);


	const safraCiclo = useSelector(selectSafraCiclo);

	const [filterPreaproSolo, setFilterPreaproSolo] = useState(false);

	const [openColheitaModal, setOpenColheitaModal] = useState(false);

	const [openPreStPage, setOpenPreStPage] = useState(false);

	const [showResumoGeral, setShowResumoGeral] = useState(false);

	const user = useSelector(selectCurrentUser);

	const isNonMobile = useMediaQuery("(min-width: 1200px)");
	const isMobile = useMediaQuery("(max-width: 760px)"); // Adjust breakpoint as needed

	const [totalCountSelected, setTotalCountSelected] = useState({});

	const [totalCountSelectedArea, setTotalCountSelectedArea] = useState(0);
	const [totalCountSelectedAplicado, setTotalCountSelectedAplicado] = useState(0);
	const [totalCountSelectedAberto, setTotalCountSelectedAberto] = useState(0);


	useEffect(() => {
		const mergeAllArrays = (data) => {
			if (!data || Object.keys(data).length === 0) return [];

			return Object.values(data) // Get all values from the main object
				.flatMap(obj => Object.values(obj)) // Flatten nested objects
				.flat() // Merge all arrays into one
				.filter((item, index, self) =>
					index === self.findIndex(t => t.app === item.app) // Remove duplicates based on `app`
				);
		};
		const mergedArray = mergeAllArrays(totalCountSelected);
		if (mergedArray.length > 0) {

			const totalAberto = mergedArray.reduce((acc, curr) => acc += curr.saldoAplicar, 0)
			const totalArea = mergedArray.reduce((acc, curr) => acc += curr.area, 0)
			const totalAplicado = mergedArray.reduce((acc, curr) => acc += curr.areaAplicada, 0)

			setTotalCountSelectedAberto(totalAberto)
			setTotalCountSelectedAplicado(totalAplicado)
			setTotalCountSelectedArea(totalArea)
		} else {
			setTotalCountSelectedAberto(0)
			setTotalCountSelectedAplicado(0)
			setTotalCountSelectedArea(0)
		}

	}, [totalCountSelected]);

	// const ITEM_HEIGHT = 48;
	// const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: 490,
				width: 250
			}
		}
	};

	const operationFilter = [
		"Grade Niveladora 1",
		"Rolo Compactador",
		"Colheita de Grãos",
		"Grade Incorporação",
		"Grade Intermediária 1",
		"Grade Preparo",
		'GERAR MAPA',
		'Semeadura'
	];

	const handlePreaproSolo = (e) => {
		setFilterPreaproSolo(e.target.checked);
	};

	const handleCheckOpenApp = () => {
		setOpenAppOnly(!openAppOnly);
	};

	const handleFutureAp = () => {
		setShowFutureApps(!showFutureApps);
	};

	const handleAllFarms = () => {
		if (filtFarm.length > 0) {
			setAllFarmsSet(false);
			setFiltFarm([]);
		} else {
			setAllFarmsSet(true);
			setFiltFarm(onlyFarms);
		}
	};

	const handleChange = (event) => {
		const {
			target: { value }
		} = event;
		setFiltFarm(typeof value === "string" ? value.split(",") : value);
	};

	useEffect(() => {
		const filterFarm = dictSelect.filter((data) =>
			filtFarm.includes(data.fazenda)
		);
		setFilteredApps(filterFarm);
	}, [filtFarm, dictSelect, openApp]);

	const getTrueApi = async () => {
		try {
			setLoadinData(true);
			await nodeServer
				.get("/", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
						"X-Firebase-AppCheck": user.accessToken
					},
					params: {
						safraCiclo
					}
				})
				.then((res) => {
					dispatch(setApp(res.data));
					toast.success(
						`Tudo Certo, Aplicações Atualizadas com sucesso!!`,
						{
							position: "top-right",
							duration: 5000
						}
					)
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("Erro ao consumir a API", err);
		} finally {
			setLoadinData(false);
		}
	};

	const refreshData = () => {
		console.log("refreshing");
		handleCloseColheitaPage()
		dispatch(setApp([]));
		dispatch(setAppFarmBox([]));
		getTrueApi();
	};

	const [open, setOpen] = useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		console.log("handle Close");
		setOpen(false);
	};

	const [openFarm, setOpenFarm] = useState(false);
	const handleOpenFarm = () => setOpenFarm(true);

	const handleCloseFarm = () => {
		setOpenFarm(false);
	};


	const handleOpenColheitaPage = () => {
		setOpenColheitaModal(true)
		console.log('Abrindo modal da Colheita')
	}
	const handleCloseColheitaPage = () => {
		setOpenColheitaModal(false)
	}

	const handleOpenPreStPage = () => {
		console.log('Abrindo pre st page')
		setOpenPreStPage(true)
	}

	useEffect(() => {
		let saldoAplicar = 0;
		filtFarm.forEach((data, index) => {
			if (data in dataGeral.fazendas) {
				saldoAplicar += dataGeral?.fazendas[data]?.saldo;
			}
		});
		setSaldoAplicar(saldoAplicar);
	}, [filtFarm, showFutureApps]);

	// handle data grom nodeServer ----- pluviometria

	const getPluviData = useCallback(async () => {
		try {
			// setLoadinData(true);
			await nodeServer
				.get("/pluviometria", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
						"X-Firebase-AppCheck": user.accessToken
					}
				})
				.then((res) => {
					dispatch(setPluvi(res.data.result));
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("Erro ao consumir a API", err);
		} finally {
			// setLoadinData(false);
			console.log("Finally statement");
		}
	}, [dispatch]);

	useEffect(() => {
		getPluviData();
	}, []);

	const handleOpenAllDetail = () => {
		setIsOpenedAll(!isOpenedAll)
	}
	const hojeH = (new Date()).toLocaleString('pt-BR')

	const handleUpdateFarmDb = async () => {
		setIsloadingDbFarm(true);
		try {
			const res = await djangoApi.get("/defensivo/update_farmbox_mongodb_data/", {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
				},
			});

			if (res.data.status === "locked") {
				Swal.fire({
					title: "Processo em andamento!",
					html: `<b>Já existe uma tarefa 'update_farmbox' rodando.`,
					icon: "warning",
				});
				return;
			}

			const taskId = res.data.task_id;
			dispatch(startTaskMonitor(taskId, refreshData));
			toast.success("Banco sendo atualizado em segundo plano!", {
				position: "top-right",
			});
			// refreshData();
		} catch (error) {
			console.error("Erro ao iniciar atualização:", error);
			Swal.fire({
				title: "Erro!",
				html: `<b>Erro ao iniciar a atualização do banco</b><br>${error.message}`,
				icon: "error",
			});
		} finally {
			setIsloadingDbFarm(false);
		}
	};

	const handleShowResumoGeral = () => {
		setShowResumoGeral(!showResumoGeral)
	}

	const formatNumber = number => {
		return number?.toLocaleString("pt-br", {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		})
	}


	return (
		<Box
			className={classes.mainDiv}
			sx={{
				scrollBehavior: "smooth !important", height: (loadingData || IsloadingDbFarm) && '100%',
				display: 'flex', flexDirection: 'row',
			}}
		>
			{(!loadingData || !IsloadingDbFarm) && (
				<Box
					p={1}
					sx={{
						backgroundColor: colors.blueOrigin[800],
						borderRadius: "8px",
						paddingTop: "4px",
						paddingBottom: "4px",
						boxShadow: !isDark && `rgba(0, 0, 0, 0.35) 0px 5px 15px`
					}}
				>
					<Button onClick={() => refreshData()} color="success" disabled={IsloadingDbFarm || loadingData}>
						Atualizar
					</Button>

					<Button onClick={() => handleOpen()} color="success" disabled={IsloadingDbFarm || loadingData}>
						Gerar Tabela
					</Button>
					<Button onClick={() => handleOpenFarm()} color="success" disabled={dictSelect.length === 0 || IsloadingDbFarm || loadingData} >
						Farm Reunião
					</Button>
					<Button onClick={() => handleOpenColheitaPage()} color="success" disabled={IsloadingDbFarm || loadingData}>
						Colheita de Grãos
					</Button>
					<Button onClick={() => handleOpenPreStPage()} color="success" disabled={IsloadingDbFarm || loadingData}>
						Pré ST
					</Button>
					<Button onClick={() => handleUpdateFarmDb()} color="success" disabled={IsloadingDbFarm || loadingData}>
						Atualizar DB
					</Button>
					<ModalDataFarmbox open={open} handleClose={handleClose} />
				</Box>
			)}
			{(loadingData || IsloadingDbFarm) && (
				<Box sx={{ width: "100%", justifyContent: 'center', alignItems: 'center', height: '100%', display: 'flex' }}>
					<CircularProgress color="success" />
				</Box>
			)}
			{
				openColheitaModal &&
				<ColheitaPage />
			}
			{
				openPreStPage &&
				<PreStPage
					closePage={setOpenPreStPage}
				/>
			}
			{
				dictSelect.length > 0 &&
				<>

					<Box
						component={Paper}
						elevation={8}
						sx={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
							width: '100%',
							backgroundColor: colors.blueOrigin[800],
							borderRadius: '12px'
						}}
						p={2}
						mt={4}
					>
						<Typography variant="h2" color={colors.textColor[100]} fontWeight='600' >Insumos Consolidados</Typography>
					</Box>
					<Box
						sx={{
							marginTop: '10px',
							marginBottom: '10px',
							width: "100%",
							minWidth: "1400px",
							minHeight: 'calc(100% - 10px)',
							padding: '10px',
							paddingLeft: '0px',
							display: "flex",
							borderRadius: '8px',
							// border: `1px solid ${colors.primary[200]}`
							backgroundColor: !isDark && 'whitesmoke',
							boxShadow: !isDark ? `rgba(0, 0, 0, 0.35) 0px 5px 15px` : `rgba(245,245,245,0.1) 0px 5px 15px`
						}}
					>
						<ProdutosConsolidados />
					</Box>
				</>
			}

			<IndexModalDataFarmbox
				open={openFarm}
				handleCloseFarm={handleCloseFarm}
			>
				<Typography variant="h6" sx={{ marginTop: '5px', color: colors.grey[100] }}>
					{safraCiclo.safra}
				</Typography>
				{!loadingData && onlyFarms.length > 0 && (
					<Box className={classes.formDiv}>
						{
							!isMobile &&
							<Switch
								checked={allFarmsSet}
								onChange={handleAllFarms}
								inputProps={{ "aria-label": "controlled" }}
								color="secondary"
							/>
						}
						<FormControl
							sx={{
								m: 1,
								width: 900,
								backgroundColor: colors.blueOrigin[800]
							}}
						>
							<InputLabel id="demo-multiple-name-label">
								Farm
							</InputLabel>
							<Select
								labelId="demo-multiple-name-label"
								id="demo-multiple-name"
								multiple
								value={filtFarm}
								onChange={handleChange}
								input={<OutlinedInput label="Farm" />}
								MenuProps={MenuProps}
							>
								{onlyFarms
									?.sort((a, b) => a.localeCompare(b))
									.map((farm, index) => (
										<MenuItem
											key={index}
											value={farm}
										//   style={getStyles(name, personName, theme)}
										>
											{farm.replace('Fazenda ', '')}
										</MenuItem>
									))}
							</Select>
						</FormControl>
						{
							!isMobile &&
							<Box display="flex" flexDirection="row">
								<Switch
									checked={openAppOnly}
									onChange={handleCheckOpenApp}
									inputProps={{ "aria-label": "controlled" }}
									color="secondary"
								/>
								{/* <Switch
								checked={filterPreaproSolo}
								onChange={handlePreaproSolo}
								inputProps={{ "aria-label": "controlled" }}
								color="warning"
								/> */}
								<Switch
									checked={showFutureApps}
									onChange={handleFutureAp}
									inputProps={{ "aria-label": "controlled" }}
									color="warning"
								/>
							</Box>
						}
					</Box>
				)}
				{

					filtFarm.length > 0 &&
					<Box
						sx={{
							width: "100%",
							justifyContent: "center",
							alignItems: "center",
							display: "flex",
						}}
					>
						{hojeH}
					</Box>

				}
				{
					JSON.stringify(totalCountSelected) !== "{}" &&
					(totalCountSelectedArea > 0 || totalCountSelectedAplicado > 0 || totalCountSelectedAberto > 0)
					&&
					<Box sx={{ display: 'flex', flexDirection: 'row', gap: '50px', fontSize: '1.2em' }}>
						<p>Área: {formatNumber(totalCountSelectedArea)}</p>
						<p>Aplicado: {formatNumber(totalCountSelectedAplicado)}</p>
						<p>Saldo: {formatNumber(totalCountSelectedAberto)}</p>

					</Box>
				}
				<Box className={classes.dashboardDiv}
					sx={{
						justifyContent: !isNonMobile ? 'flex-start' : 'space-around'
					}}
				>

					<div className={classes.dashLeft}>
						{filtFarm?.map((data, i) => {
							const hasApp = (obj) => obj.fazenda === data;
							const totalAberto = totalCountSelected[data] && totalCountSelected[data].reduce((acc, curr) => acc += curr.saldoAplicar, 0)
							const totalArea = totalCountSelected[data] && totalCountSelected[data].reduce((acc, curr) => acc += curr.area, 0)
							const totalAplicado = totalCountSelected[data] && totalCountSelected[data].reduce((acc, curr) => acc += curr.areaAplicada, 0)
							return (
								<div style={{ position: 'relative' }} >
									{filteredApps.some(hasApp) && (
										<>
											<div
												key={i}
												id={data}
												style={{
													width: '100%',
													margin: "29px",
													cursor: 'pointer',
													fontSize: '22px',
													position: 'sticky', // Make it sticky
													top: '-30px',          // Adjust as needed (e.g., "10px" if you need an offset)
													zIndex: 1000,
													// backgroundColor: colors.blueOrigin[900]  

												}}
												className={classes.headerNameFarmTitle}
												onClick={handleOpenAllDetail}
											>
												<Divider>{data.replace('Fazenda', '')}</Divider>

											</div>

											{
												totalCountSelected[data] &&
												<Box sx={{ display: 'flex', flexDirection: 'row', gap: '50px', fontSize: '1.2em' }}>
													<p>Área: {formatNumber(totalArea)}</p>
													<p>Aplicado: {formatNumber(totalAplicado)}</p>
													<p>Saldo: {formatNumber(totalAberto)}</p>
												</Box>
											}

											{/* <div className={classes.headerAppSticky} style={{ backgroundColor: colors.blueOrigin[900] }}> */}
											<HeaderApp />
											{/* </div> */}

										</>
									)}
									<div className={classes.mainDivLeft}>
										{filteredApps
											.filter((data) =>
												!openAppOnly
													? data.status === "sought"
													: data.status ===
													"sought" ||
													"finalized"
											)
											.filter((data) =>
												filterPreaproSolo
													? operationFilter.includes(
														data.operacao.trim()
													)
													: data.app.length > 0
											)
											.filter((data) =>
												!showFutureApps
													? new Date(data.date) <
													getNextWeekDays()
													: new Date(data.date) <
													new Date("2031-10-17")
											)
											.sort((b, a) =>
												a.status.localeCompare(b.status)
											)
											.sort((a, b) => {
												return (
													new Date(a.date) -
													new Date(b.date)
												);
											})
											.map((app, i) => {
												if (app.fazenda === data) {
													return (
														<TableDataPage
															totalCountSelected={totalCountSelected[data] || []}
															colors={colors}
															key={i}
															dataF={app}
															openAll={isOpenedAll}
															setTotalCountSelected={setTotalCountSelected}
														/>
													);
												}
												return <></>;
											})}
									</div>
								</div>
							);
						})}
					</div>
					<div
						className={classes.dashRight}
						style={{ display: !isNonMobile && "none" }}
					>
						{filteredApps.length > 0 && (
							<div className={classes.resumoAppPage}>
								<div className={classes.headerDivApp} onClick={() => handleShowResumoGeral()}>
									<Divider>
										<h3>Resumo Geral</h3>
									</Divider>
								</div>
								{
									showResumoGeral &&
									<div
										className={classes.bodyDivApp}
										style={{
											opacity: showResumoGeral ? 1 : 0,
											overflow: 'hidden',
											backgroundColor: colors.blueOrigin[700],
											transition: 'opacity 0.3s ease, max-height 0.3s ease',
										}}
									>
										<ResumoDataPage daysFilter={daysFilter} />
									</div>
								}
								{filtFarm && (
									<>
										<Box sx={{ width: "100%" }} mt={3}>
											<Divider>
												<h3>
													Resumo Fazendas -{" "}
													{saldoAplicar.toLocaleString(
														"pt-br",
														{
															minimumFractionDigits: 2,
															maximumFractionDigits: 2
														}
													)}
												</h3>
											</Divider>
										</Box>
										<div
											className={
												classes.resumoFazendasPage
											}
											style={{
												backgroundColor:
													colors.blueOrigin[700]
											}}
										>
											{filtFarm
												?.sort((a, b) =>
													a.localeCompare(b)
												)
												.map((farm, i) => {
													const hasDivider =
														filtFarm.length - 1 ===
														i;
													return (
														<ResumoFazendasPage
															colors={colors}
															fazenda={farm}
															key={i}
															operationFilter={
																operationFilter
															}
															filterPreaproSolo={
																filterPreaproSolo
															}
															divider={
																!hasDivider
															}
															showFutureApps={
																showFutureApps
															}
															daysFilter={
																daysFilter
															}
														/>
													);
												})}
										</div>
									</>
								)}
							</div>
						)}
					</div>
				</Box>
				{!loadingData && filteredApps.length === 0 && (
					<Box className={classes.emptyFarm}>
						<Typography variant="h4" color={colors.grey[300]}>Selecione uma fazenda</Typography>
						{filtFarm.length === 0 && !isMobile &&
							<PluviDataComp />
						}
					</Box>
				)}
			</IndexModalDataFarmbox>

		</Box>
	);
};

export default FarmBoxPage;
