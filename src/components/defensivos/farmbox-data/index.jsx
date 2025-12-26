import classes from "./farmbox.module.css";
import djangoApi, { nodeServer } from "../../../utils/axios/axios.utils";
import { useEffect, useState, useCallback, useContext, useMemo } from "react";
import { Box, Button, CircularProgress, Typography, useTheme, Paper } from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";

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

import {
	ListItemText,
	Chip,
	IconButton,
	Tooltip,
} from "@mui/material";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import DoneAllIcon from "@mui/icons-material/DoneAll";

const daysFilter = 12;
const FarmBoxPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const colorMode = useContext(ColorModeContext);

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
	const [filteredOperations, setFilteredOperations] = useState([]);

	const [operationFilter, setOperationFilter] = useState([]);
	const [cultureFilter, setCultureFilter] = useState([]); // << NOVO

	const selector = useMemo(
		() => geralAppDetail(showFutureApps, daysFilter, operationFilter),
		[showFutureApps, daysFilter, operationFilter]
	);

	const dataGeral = useSelector(selector);

	const TIPOS_APLICACAO = ["Operacao", "Solido", "Liquido"];
	const [tipoAplicacaoFilter, setTipoAplicacaoFilter] = useState(TIPOS_APLICACAO);

	const toggleTipoAplicacao = (tipo) => {
		setTipoAplicacaoFilter((prev) =>
			prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
		);
	};

	const toggleAllTiposAplicacao = () => {
		setTipoAplicacaoFilter((prev) =>
			prev.length === TIPOS_APLICACAO.length ? [] : TIPOS_APLICACAO
		);
	};


	const normalizeTxt = (v) =>
		(v ?? "")
			.toString()
			.normalize("NFD")
			.replace(/\p{Diacritic}/gu, "")
			.toLowerCase()
			.trim();

	const isTipoOperacao = (tipo) => normalizeTxt(tipo) === "operacao";

	const getTipoAplicacao = (app) => {
		const insumos = Array.isArray(app?.insumos) ? app.insumos : [];

		// 1 único insumo => Operacao
		if (insumos.length === 1) return "Operacao";

		// 2+ insumos:
		// filtra tipo !== "Operação"
		const nonOp = insumos.filter((i) => !isTipoOperacao(i?.tipo));

		// se depois de tirar Operação ficar só 1 => Sólido
		if (nonOp.length === 1) return "Solido";

		// se ficar mais de 1 => Líquido
		if (nonOp.length > 1) return "Liquido";

		// fallback (caso estranho: todos eram Operação)
		return "Operacao";
	};

	const toNumber = (v) => {
		if (v == null) return 0;
		if (typeof v === "number") return Number.isFinite(v) ? v : 0;
		const s = String(v).replace(",", ".").replace(/[^\d.-]/g, "");
		const n = Number(s);
		return Number.isFinite(n) ? n : 0;
	};

	const formatHa = (value) =>
		toNumber(value).toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

	const getSaldoAplicarHa = (app) => {
		// prioridade: campo direto "saldoAplicar"; fallback: area - areaAplicada
		const saldo = toNumber(app?.saldoAplicar);
		if (saldo > 0) return saldo;

		const area = toNumber(app?.area);
		const aplicada = toNumber(app?.areaAplicada);
		const calc = area - aplicada;
		return calc > 0 ? calc : 0;
	};

	const [openFarmMap, setOpenFarmMap] = useState({}); // { [farmName]: boolean }

	const toggleOpenFarm = (farmName) => {
		setOpenFarmMap((prev) => ({
			...prev,
			[farmName]: !prev[farmName],
		}));
	};

	// opcional: abrir/fechar todas as fazendas de uma vez
	const setAllFarmsOpen = (isOpen) => {
		setOpenFarmMap(() => {
			const next = {};
			(filtFarm || []).forEach((f) => (next[f] = isOpen));
			return next;
		});
	};



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

	useEffect(() => {
		if (dictSelect) {
			const onlyOperations = dictSelect.map((data) => data.operacao)
			const removedDupliOperations = [...new Set(onlyOperations)]
			setFilteredOperations(removedDupliOperations)
		}
	}, [dictSelect]);

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

	const handleOpenFarm = () => {
		setOpenFarm(true);
		if (theme.palette.mode !== 'dark') {
			colorMode.toggleColorMode()
		}
	}

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
	}, [filtFarm, showFutureApps, dataGeral]);

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

	// opções para operações (já existia)
	const options = useMemo(
		() =>
			(filteredOperations ?? [])
				.map((op) => (op ?? "").toString().trim())
				.filter(Boolean)
				.sort((a, b) => a.localeCompare(b, "pt-BR")),
		[filteredOperations]
	);

	// opções para cultura (NOVO)
	const cultureOptions = useMemo(
		() =>
			(dictSelect ?? [])
				.map((d) => (d.cultura ?? "").toString().trim())
				.filter(Boolean)
				.filter((value, index, self) => self.indexOf(value) === index)
				.sort((a, b) => a.localeCompare(b, "pt-BR")),
		[dictSelect]
	);

	const isAllSelected =
		options.length > 0 && operationFilter.length === options.length;

	const isAllCulturesSelected =
		cultureOptions.length > 0 && cultureFilter.length === cultureOptions.length;

	const handleChangeOpFilt = (event) => {
		const value = event.target.value; // array
		setOperationFilter(typeof value === "string" ? value.split(",") : value);
	};

	const handleToggleAll = () => {
		setOperationFilter(isAllSelected ? [] : options);
	};

	const handleClear = () => setOperationFilter([]);

	// handlers para filtro de cultura (NOVO)
	const handleChangeCultureFilt = (event) => {
		const value = event.target.value;
		setCultureFilter(typeof value === "string" ? value.split(",") : value);
	};

	const handleToggleAllCultures = () => {
		setCultureFilter(isAllCulturesSelected ? [] : cultureOptions);
	};

	const handleClearCultures = () => setCultureFilter([]);



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
					filtFarm.length > 0 &&
					<>
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								gap: 1.5,
								flexWrap: "wrap",
								mb: 2,
								p: 1.5,
								borderRadius: 2,
								backgroundColor: colors.brown[500],
								border: `1px solid ${colors.grey[300]}`,
								boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
							}}
						>
							{/* Operações */}
							<FormControl
								size="small"
								sx={{
									minWidth: 320,
									"& .MuiInputLabel-root": { color: colors.grey[800] },
									"& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
								}}
							>
								<InputLabel id="op-filter-label">Operações</InputLabel>
								<Select
									labelId="op-filter-label"
									multiple
									value={operationFilter}
									onChange={handleChangeOpFilt}
									input={
										<OutlinedInput
											label="Operações"
											sx={{
												"& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[400] },
												"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
												"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueOrigin?.[600] || colors.grey[700] },
											}}
										/>
									}
									renderValue={(selected) => (
										<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
											{selected.map((value) => (
												<Chip
													key={value}
													label={value}
													size="small"
													sx={{
														backgroundColor: colors.grey[200],
														color: colors.grey[900],
														border: `1px solid ${colors.grey[300]}`,
													}}
												/>
											))}
										</Box>
									)}
									MenuProps={MenuProps}
									sx={{ backgroundColor: "#fff" }}
								>
									<MenuItem onClick={handleToggleAll}>
										<Checkbox
											checked={isAllSelected}
											indeterminate={!isAllSelected && operationFilter.length > 0}
										/>
										<ListItemText primary={isAllSelected ? "Desmarcar todos" : "Selecionar todos"} />
									</MenuItem>

									<MenuItem onClick={handleClear}>
										<Checkbox checked={operationFilter.length === 0} />
										<ListItemText primary="Limpar seleção" />
									</MenuItem>

									{options.map((name) => (
										<MenuItem key={name} value={name}>
											<Checkbox checked={operationFilter.indexOf(name) > -1} />
											<ListItemText primary={name} />
										</MenuItem>
									))}
								</Select>
							</FormControl>

							<Tooltip title={isAllSelected ? "Desmarcar todos" : "Selecionar todos"}>
								<IconButton
									size="small"
									onClick={handleToggleAll}
									sx={{
										backgroundColor: "#fff",
										border: `1px solid ${colors.grey[300]}`,
										"&:hover": { backgroundColor: colors.grey[200] },
									}}
								>
									{isAllSelected ? (
										<ClearAllIcon sx={{ color: colors.grey[800] }} />
									) : (
										<DoneAllIcon sx={{ color: colors.grey[800] }} />
									)}
								</IconButton>
							</Tooltip>

							<Tooltip title="Limpar seleção">
								<IconButton
									size="small"
									onClick={handleClear}
									sx={{
										backgroundColor: "#fff",
										border: `1px solid ${colors.grey[300]}`,
										"&:hover": { backgroundColor: colors.grey[200] },
									}}
								>
									<ClearAllIcon sx={{ color: colors.grey[800] }} />
								</IconButton>
							</Tooltip>

							{/* Cultura */}
							{cultureOptions.length > 0 && (
								<>
									<FormControl
										size="small"
										sx={{
											minWidth: 260,
											"& .MuiInputLabel-root": { color: colors.grey[800] },
											"& .MuiOutlinedInput-root": { backgroundColor: "#fff" },
										}}
									>
										<InputLabel id="cultura-filter-label">Cultura</InputLabel>
										<Select
											labelId="cultura-filter-label"
											multiple
											value={cultureFilter}
											onChange={handleChangeCultureFilt}
											input={
												<OutlinedInput
													label="Cultura"
													sx={{
														"& .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[400] },
														"&:hover .MuiOutlinedInput-notchedOutline": { borderColor: colors.grey[600] },
														"&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: colors.blueOrigin?.[600] || colors.grey[700] },
													}}
												/>
											}
											renderValue={(selected) => (
												<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
													{selected.map((value) => (
														<Chip
															key={value}
															label={value}
															size="small"
															sx={{
																backgroundColor: colors.grey[200],
																color: colors.grey[900],
																border: `1px solid ${colors.grey[300]}`,
															}}
														/>
													))}
												</Box>
											)}
											MenuProps={MenuProps}
											sx={{ backgroundColor: "#fff" }}
										>
											<MenuItem onClick={handleToggleAllCultures}>
												<Checkbox
													checked={isAllCulturesSelected}
													indeterminate={!isAllCulturesSelected && cultureFilter.length > 0}
												/>
												<ListItemText
													primary={isAllCulturesSelected ? "Desmarcar todas" : "Selecionar todas"}
												/>
											</MenuItem>

											<MenuItem onClick={handleClearCultures}>
												<Checkbox checked={cultureFilter.length === 0} />
												<ListItemText primary="Limpar seleção" />
											</MenuItem>

											{cultureOptions.map((name) => (
												<MenuItem key={name} value={name}>
													<Checkbox checked={cultureFilter.indexOf(name) > -1} />
													<ListItemText primary={name} />
												</MenuItem>
											))}
										</Select>
									</FormControl>

									<Tooltip title={isAllCulturesSelected ? "Desmarcar todas" : "Selecionar todas"}>
										<IconButton
											size="small"
											onClick={handleToggleAllCultures}
											sx={{
												backgroundColor: "#fff",
												border: `1px solid ${colors.grey[300]}`,
												"&:hover": { backgroundColor: colors.grey[200] },
											}}
										>
											{isAllCulturesSelected ? (
												<ClearAllIcon sx={{ color: colors.grey[800] }} />
											) : (
												<DoneAllIcon sx={{ color: colors.grey[800] }} />
											)}
										</IconButton>
									</Tooltip>

									<Tooltip title="Limpar seleção de cultura">
										<IconButton
											size="small"
											onClick={handleClearCultures}
											sx={{
												backgroundColor: "#fff",
												border: `1px solid ${colors.grey[300]}`,
												"&:hover": { backgroundColor: colors.grey[200] },
											}}
										>
											<ClearAllIcon sx={{ color: colors.grey[800] }} />
										</IconButton>
									</Tooltip>
								</>
							)}

							{/* Tipo de Aplicação */}
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									gap: 1.5,
									flexWrap: "wrap",
									px: 1,
									py: 0.5,
									borderRadius: 2,
									backgroundColor: "#fff",
									border: `1px solid ${colors.grey[300]}`,
								}}
							>
								<FormControlLabel
									sx={{
										m: 0,
										"& .MuiFormControlLabel-label": { color: colors.grey[900], fontWeight: 600 },
									}}
									control={
										<Checkbox
											checked={tipoAplicacaoFilter.length === TIPOS_APLICACAO.length}
											indeterminate={
												tipoAplicacaoFilter.length > 0 &&
												tipoAplicacaoFilter.length < TIPOS_APLICACAO.length
											}
											onChange={toggleAllTiposAplicacao}
										/>
									}
									label="Todos"
								/>

								{TIPOS_APLICACAO.map((tipo) => (
									<FormControlLabel
										key={tipo}
										sx={{ m: 0, "& .MuiFormControlLabel-label": { color: colors.grey[900] } }}
										control={
											<Checkbox
												checked={tipoAplicacaoFilter.includes(tipo)}
												onChange={() => toggleTipoAplicacao(tipo)}
											/>
										}
										label={tipo === "Operacao" ? "Operação" : tipo === "Solido" ? "Sólido" : "Líquido"}
									/>
								))}
							</Box>
						</Box>

					</>

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
				<Box
					className={classes.dashboardDiv}
					sx={{
						justifyContent: !isNonMobile ? "flex-start" : "space-around",
					}}
				>
					<div className={classes.dashLeft}>
						{filtFarm?.map((data) => {
							const totalAberto =
								totalCountSelected?.[data]?.reduce(
									(acc, curr) => acc + Number(curr?.saldoAplicar ?? 0),
									0
								) ?? 0;

							const totalArea =
								totalCountSelected?.[data]?.reduce(
									(acc, curr) => acc + Number(curr?.area ?? 0),
									0
								) ?? 0;

							const totalAplicado =
								totalCountSelected?.[data]?.reduce(
									(acc, curr) => acc + Number(curr?.areaAplicada ?? 0),
									0
								) ?? 0;

							const appsDaFazenda = filteredApps
								.filter((app) =>
									!openAppOnly
										? app.status === "sought"
										: app.status === "sought" || app.status === "finalized"
								)
								.filter((app) =>
									filterPreaproSolo
										? operationFilter.includes((app?.operacao ?? "").trim())
										: (app?.app ?? "").length > 0
								)
								// operação (MultiSelect) - INCLUSÃO
								.filter((app) => {
									const op = (app?.operacao ?? "").toString().trim();
									return operationFilter.length === 0 ? true : operationFilter.includes(op);
								})
								// cultura (MultiSelect)
								.filter((app) => {
									const cultura = (app?.cultura ?? "").toString().trim();
									return cultureFilter.length === 0 ? true : cultureFilter.includes(cultura);
								})
								.filter((app) =>
									!showFutureApps
										? new Date(app.date) < getNextWeekDays()
										: new Date(app.date) < new Date("2031-10-17")
								)
								.filter((app) => app.fazenda === data)
								.filter((app) => tipoAplicacaoFilter.includes(getTipoAplicacao(app)))
								.sort((b, a) => a.status.localeCompare(b.status))
								.sort((a, b) => {
									const dateA = new Date(a.date);
									const dateB = new Date(b.date);
									if (dateA < dateB) return -1;
									if (dateA > dateB) return 1;
									const numA = parseInt(String(a.app).replace(/\D/g, ""), 10);
									const numB = parseInt(String(b.app).replace(/\D/g, ""), 10);
									return numA - numB;
								});

							if (!appsDaFazenda.length) return null;

							const grupos = appsDaFazenda.reduce(
								(acc, app) => {
									const tipo = getTipoAplicacao(app);
									acc[tipo].push(app);
									return acc;
								},
								{ Operacao: [], Solido: [], Liquido: [] }
							);

							const saldoTotalHa = appsDaFazenda.reduce(
								(sum, app) => sum + getSaldoAplicarHa(app),
								0
							);

							const isFarmOpen = openFarmMap?.[data] ?? false;

							const GRID_COLS = {
								// ajuste fino aqui se precisar bater 100% com seu card
								gridTemplateColumns: "120px 40px 1.2fr 220px 110px 115px 90px 130px",
								//                AP   icon  operação   datas/tipo   área   aplicado  saldo  progresso
							};


							const renderGrupo = (tipo, titulo) => {
								const arr = grupos[tipo];
								if (!arr || arr.length === 0) return null;

								const saldoGrupo = arr.reduce((sum, app) => sum + getSaldoAplicarHa(app), 0);

								return (
									<Box sx={{ mt: 2 }}>
										{/* Título do subgrupo */}
										<Divider sx={{ mb: 0 }}>
											<Typography variant="h5" sx={{ fontWeight: 700 }}>
												{titulo} ({arr.length}) — {formatHa(saldoGrupo)} ha
											</Typography>
										</Divider>

										{/* HEADER DAS COLUNAS (alinhado com os cards) */}
										<Box
											sx={{
												...GRID_COLS,
												display: "grid",
												alignItems: "center",
											}}
										>
											{/* Espaços “vazios” para bater com as colunas da esquerda do card */}
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '15px', fontWeight: 'bold', textAlign: "left", paddingLeft: 3 }}>
												Nº
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '15px', fontWeight: 'bold', textAlign: "right" }}>
												Operação
											</Typography>
											<Box /> {/* operação */}
											<Box /> {/* datas/tipo */}

											{/* Colunas numéricas */}
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '15px', fontWeight: 'bold', textAlign: "right" }}>
												Área
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '15px', fontWeight: 'bold', textAlign: "right"  }}>
												Aplicado
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '15px', fontWeight: 'bold', textAlign: "right" }}>
												Saldo
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '15px', fontWeight: 'bold', textAlign: "center", paddingLeft: 3 }}>
												Status
											</Typography>
										</Box>

										{/* Cards */}
										{arr.map((app) => (
											<TableDataPage
												key={`${app.fazenda}-${app.app}`}
												totalCountSelected={totalCountSelected[data] || []}
												colors={colors}
												dataF={app}
												openAll={isFarmOpen}
												setTotalCountSelected={setTotalCountSelected}
												tipoAplicacao={getTipoAplicacao(app)}
											/>
										))}
									</Box>
								);
							};


							return (
								<div key={data} style={{ position: "relative", marginBottom: 24 }}>
									{/* HEADER STICKY DA FAZENDA */}
									<Box
										onClick={() => toggleOpenFarm(data)}
										sx={{
											position: "sticky",
											top: -25, // ajuste aqui se tiver AppBar fixa (ex.: top: 64)
											zIndex: 20,
											cursor: "pointer",
											px: 1,
											py: 1,
											borderRadius: 1,
											// importante para "tapar" o conteúdo ao passar por cima:
											backgroundColor: colors.brown[400],
											border: '0.5px solid whitesmoke',
											// leve sombra pra separar visualmente:
											boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
											mb: 1,
										}}
									>
										<Box
											sx={{
												display: "flex",
												alignItems: "baseline",
												justifyContent: "space-between",
												gap: 2,
												flexWrap: "wrap",
											}}
										>
											<Typography variant="h4" sx={{ fontWeight: 800 }}>
												{data}
											</Typography>

											<Typography variant="body2" sx={{ opacity: 0.85 }}>
												Saldo a aplicar: {formatHa(saldoTotalHa)} ha
												{"  "}
												— {isFarmOpen ? "Fechar tudo" : "Abrir tudo"}
											</Typography>
										</Box>

										{!!totalCountSelected?.[data]?.length && (
											<Box sx={{ display: "flex", flexWrap: "wrap", gap: 3, mt: 0.5 }}>
												<Typography variant="body2">
													Área: {formatNumber(totalArea)}
												</Typography>
												<Typography variant="body2">
													Aplicado: {formatNumber(totalAplicado)}
												</Typography>
												<Typography variant="body2">
													Saldo: {formatNumber(totalAberto)}
												</Typography>
											</Box>
										)}
									</Box>

									{/* SUBGRUPOS */}
									{renderGrupo("Operacao", "Operação")}
									{renderGrupo("Solido", "Sólido")}
									{renderGrupo("Liquido", "Líquido")}
								</div>
							);
						})}
					</div>


					<div className={classes.dashRight} style={{ display: !isNonMobile && "none" }}>
						{filteredApps.length > 0 && (
							<div className={classes.resumoAppPage}>
								<div className={classes.headerDivApp} onClick={() => handleShowResumoGeral()}>
									<Divider>
										<h3>Resumo Geral</h3>
									</Divider>
								</div>

								{showResumoGeral && (
									<div
										className={classes.bodyDivApp}
										style={{
											opacity: showResumoGeral ? 1 : 0,
											overflow: "hidden",
											backgroundColor: colors.blueOrigin[700],
											transition: "opacity 0.3s ease, max-height 0.3s ease",
										}}
									>
										<ResumoDataPage daysFilter={daysFilter} />
									</div>
								)}

								{filtFarm && (
									<>
										<Box sx={{ width: "100%" }} mt={3}>
											<Divider>
												<h3>
													Resumo Fazendas -{" "}
													{saldoAplicar.toLocaleString("pt-br", {
														minimumFractionDigits: 2,
														maximumFractionDigits: 2,
													})}
												</h3>
											</Divider>
										</Box>

										<div
											className={classes.resumoFazendasPage}
											style={{ backgroundColor: colors.blueOrigin[700] }}
										>
											{filtFarm
												?.sort((a, b) => a.localeCompare(b))
												.map((farm, i) => {
													const hasDivider = filtFarm.length - 1 === i;
													return (
														<ResumoFazendasPage
															colors={colors}
															fazenda={farm}
															key={i}
															operationFilter={operationFilter}
															filterPreaproSolo={filterPreaproSolo}
															divider={!hasDivider}
															showFutureApps={showFutureApps}
															daysFilter={daysFilter}
															dataGeral={dataGeral}
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
