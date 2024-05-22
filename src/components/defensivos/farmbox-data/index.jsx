import classes from "./farmbox.module.css";
import { nodeServer } from "../../../utils/axios/axios.utils";
import { useEffect, useState, useCallback } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import {
	selectApp,
	createDict,
	createDictFarmBox,
	onlyFarm
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

import { selectSafraCiclo } from "../../../store/plantio/plantio.selector";

import useMediaQuery from "@mui/material/useMediaQuery";
import ColheitaModalPage from "./colheita-modal";
import ColheitaPage from "./colheita-section/colheita-index-data";

const daysFilter = 12;
const FarmBoxPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [loadingData, setLoadinData] = useState(false);
	const dispatch = useDispatch();
	const openApp = useSelector(selectApp);
	const dictSelect = useSelector(createDict);
	// const dictSelectFarm = useSelector(createDictFarmBox);
	const onlyFarms = useSelector(onlyFarm);
	const [filtFarm, setFiltFarm] = useState([]);
	const [filteredApps, setFilteredApps] = useState([]);
	const [saldoAplicar, setSaldoAplicar] = useState(0);
	const [allFarmsSet, setAllFarmsSet] = useState(false);
	const [openAppOnly, setOpenAppOnly] = useState(false);
	const [showFutureApps, setShowFutureApps] = useState(false);
	const dataGeral = useSelector(geralAppDetail(showFutureApps, daysFilter));

	const [isOpenedAll, setIsOpenedAll] = useState(false);

	const safraCiclo = useSelector(selectSafraCiclo);

	const [filterPreaproSolo, setFilterPreaproSolo] = useState(false);

	const [openColheitaModal, setOpenColheitaModal] = useState(false);

	const user = useSelector(selectCurrentUser);

	const isNonMobile = useMediaQuery("(min-width: 1200px)");

	const ITEM_HEIGHT = 48;
	const ITEM_PADDING_TOP = 8;
	const MenuProps = {
		PaperProps: {
			style: {
				maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
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
		"Grade Preparo"
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


	return (
		<Box
			className={classes.mainDiv}
			sx={{ scrollBehavior: "smooth !important" }}
		>
			{!loadingData && (
				<Box
					p={1}
					sx={{
						backgroundColor: colors.blueOrigin[800],
						borderRadius: "8px",
						paddingTop: "4px",
						paddingBottom: "4px"
					}}
				>
					<Button onClick={() => refreshData()} color="success">
						Atualizar
					</Button>

					<Button onClick={() => handleOpen()} color="success">
						Gerar Tabela
					</Button>
					<Button onClick={() => handleOpenFarm()} color="success">
						Farm Reunião
					</Button>
					<Button onClick={() => handleOpenColheitaPage()} color="success">
						Colheita de Grãos
					</Button>
					<ModalDataFarmbox open={open} handleClose={handleClose} />
				</Box>
			)}
			{loadingData && (
				<Box sx={{ width: "100%" }}>
					<LinearProgress color="success" />
				</Box>
			)}

			<IndexModalDataFarmbox
				open={openFarm}
				handleCloseFarm={handleCloseFarm}
			>
				<Typography variant="h6" sx={{ marginTop: '5px', color: colors.grey[100] }}>
					{safraCiclo.safra}
				</Typography>
				{!loadingData && onlyFarms.length > 0 && (
					<Box className={classes.formDiv}>
						<Switch
							checked={allFarmsSet}
							onChange={handleAllFarms}
							inputProps={{ "aria-label": "controlled" }}
							color="secondary"
						/>
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
									.map((farm, i) => (
										<MenuItem
											key={i}
											value={farm}
										//   style={getStyles(name, personName, theme)}
										>
											{farm}
										</MenuItem>
									))}
							</Select>
						</FormControl>
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
				<div className={classes.dashboardDiv}>

					<div className={classes.dashLeft}>
						{filtFarm?.map((data, i) => {
							const hasApp = (obj) => obj.fazenda === data;
							return (
								<>
									{filteredApps.some(hasApp) && (
										<>
											<div
												key={i}
												id={data}
												style={{
													margin: "29px",
													cursor: 'pointer',

												}}
												className={classes.headerNameFarmTitle}
												onClick={handleOpenAllDetail}
											>
												<Divider>{data}</Divider>
											</div>

											<HeaderApp />
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
															colors={colors}
															key={i}
															dataF={app}
															openAll={isOpenedAll}
														/>
													);
												}
												return <></>;
											})}
									</div>
								</>
							);
						})}
					</div>
					<div
						className={classes.dashRight}
						style={{ display: !isNonMobile && "none" }}
					>
						{filteredApps.length > 0 && (
							<div className={classes.resumoAppPage}>
								<div className={classes.headerDivApp}>
									<Divider>
										<h3>Resumo Geral</h3>
									</Divider>
								</div>
								<div
									className={classes.bodyDivApp}
									style={{
										backgroundColor: colors.blueOrigin[700]
									}}
								>
									<ResumoDataPage daysFilter={daysFilter} />
								</div>
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
				</div>
				{!loadingData && filteredApps.length === 0 && (
					<Box className={classes.emptyFarm}>
						<span>Selecione uma fazenda</span>
						{/* <PluviDataComp /> */}
					</Box>
				)}
			</IndexModalDataFarmbox>
			{
				openColheitaModal &&
				<ColheitaPage />
			}
		</Box>
	);
};

export default FarmBoxPage;
