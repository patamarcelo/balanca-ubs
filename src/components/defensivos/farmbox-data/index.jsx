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


import html2canvas from "html2canvas";
import { useRef, } from "react";


import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AplicacoesDailyPage from "./aplicacoes-daily/AplicacoesDailyPage";
import ResumoProdutosConsolidados from "./resumo-produtos-consolidados";




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

	// novo filtro: mostrar somente aplicações com endDate <= hoje
	const [onlyEndedUntilToday, setOnlyEndedUntilToday] = useState(false);

	const [openAplicacoesDaily, setOpenAplicacoesDaily] = useState(false);

	const handleOpenAplicacoesDaily = () => setOpenAplicacoesDaily(true);
	const handleCloseAplicacoesDaily = () => setOpenAplicacoesDaily(false);

	const [apCodeFilter, setApCodeFilter] = useState([]);


	const [dapApDestaque, setDapApDestaque] = useState(50);

	const [insumoFilter, setInsumoFilter] = useState([]);

	const handleOnlyEndedUntilToday = () => {
		setOnlyEndedUntilToday((prev) => !prev);
	};

	// helpers de data (dia “zerado”)
	const toDayStart = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

	const parseYmdToDayStart = (ymd) => {
		// espera "YYYY-MM-DD"
		if (!ymd) return null;
		const s = String(ymd).trim();
		const m = s.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (!m) return null;
		const y = Number(m[1]);
		const mo = Number(m[2]) - 1;
		const da = Number(m[3]);
		const dt = new Date(y, mo, da);
		return Number.isNaN(dt.getTime()) ? null : dt;
	};


	const makeApOptionKey = (fazenda, appCode) =>
		`${(fazenda ?? "").toString().trim()}___${(appCode ?? "").toString().trim()}`;

	const parseApOptionKey = (key) => {
		const [fazenda = "", app = ""] = String(key).split("___");
		return { fazenda, app };
	};

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


	const getInsumoLabel = (insumo) => {
		if (!insumo) return "";

		const candidate =
			insumo?.produto ||
			insumo?.insumo ||
			insumo?.nome ||
			insumo?.name ||
			insumo?.produto_nome ||
			insumo?.insumo_nome ||
			"";

		return String(candidate).trim();
	};

	const getAppInsumosLabels = (app) => {
		const insumos = Array.isArray(app?.insumos) ? app.insumos : [];

		return insumos
			.map((item) => getInsumoLabel(item))
			.filter(Boolean);
	};


	const aplicacoesFiltradas = useMemo(() => {
		return (filteredApps || [])
			// status
			.filter((app) =>
				!openAppOnly
					? app.status === "sought"
					: app.status === "sought" || app.status === "finalized"
			)

			// seu "preapro solo" (manteve sua lógica original)
			.filter((app) =>
				filterPreaproSolo
					? operationFilter.includes((app?.operacao ?? "").trim())
					: (app?.app ?? "").length > 0
			)

			// operação (MultiSelect)
			.filter((app) => {
				const op = (app?.operacao ?? "").toString().trim();
				return operationFilter.length === 0 ? true : operationFilter.includes(op);
			})

			// cultura (MultiSelect)
			.filter((app) => {
				const cultura = (app?.cultura ?? "").toString().trim();
				return cultureFilter.length === 0 ? true : cultureFilter.includes(cultura);
			})

			// apCode (MultiSelect)
			.filter((app) => {
				const key = makeApOptionKey(app?.fazenda, app?.app);
				return apCodeFilter.length === 0 ? true : apCodeFilter.includes(key);
			})

			// futuro / janela
			.filter((app) =>
				!showFutureApps
					? new Date(app.date) < getNextWeekDays()
					: new Date(app.date) < new Date("2031-10-17")
			)

			// tipo aplicação (Operacao / Solido / Liquido)
			.filter((app) => tipoAplicacaoFilter.includes(getTipoAplicacao(app)))

			// insumos (MultiSelect)
			.filter((app) => {
				if (insumoFilter.length === 0) return true;

				const appInsumos = getAppInsumosLabels(app);
				return insumoFilter.some((insumo) => appInsumos.includes(insumo));
			})

			// NOVO: endDate <= hoje
			.filter((app) => {
				if (!onlyEndedUntilToday) return true;

				const end = parseYmdToDayStart(app?.endDate);
				if (!end) return false;

				const today = toDayStart(new Date());
				return end.getTime() <= today.getTime();
			});
	}, [
		filteredApps,
		openAppOnly,
		filterPreaproSolo,
		operationFilter,
		cultureFilter,
		showFutureApps,
		tipoAplicacaoFilter,
		onlyEndedUntilToday,
		getTipoAplicacao,
		apCodeFilter,
		insumoFilter,
		getAppInsumosLabels
	]);


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
					console.log('res app data', res.data)
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

	const saldoAplicar = useMemo(() => {
		return (aplicacoesFiltradas || [])
			.filter((app) => filtFarm.includes(app.fazenda))
			.reduce((acc, app) => acc + getSaldoAplicarHa(app), 0);
	}, [aplicacoesFiltradas, filtFarm]);

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

	const apCodeOptions = useMemo(() => {
		const hasManyFarmsSelected = filtFarm.length > 1;

		const rows = (filteredApps ?? [])
			.filter((app) => {
				const op = (app?.operacao ?? "").toString().trim();
				return operationFilter.length === 0 ? true : operationFilter.includes(op);
			})
			.filter((app) => {
				const cultura = (app?.cultura ?? "").toString().trim();
				return cultureFilter.length === 0 ? true : cultureFilter.includes(cultura);
			})
			.map((app) => {
				const fazenda = (app?.fazenda ?? "").toString().trim();
				const code = (app?.app ?? "").toString().trim();

				if (!fazenda || !code) return null;

				return {
					key: makeApOptionKey(fazenda, code),
					fazenda,
					code,
					label: hasManyFarmsSelected
						? `${fazenda.replace("Fazenda ", "")} - ${code}`
						: code,
				};
			})
			.filter(Boolean);

		const uniqueRows = rows.filter(
			(item, index, self) => index === self.findIndex((x) => x.key === item.key)
		);

		return uniqueRows.sort((a, b) => {
			const farmCompare = a.fazenda.localeCompare(b.fazenda, "pt-BR");
			if (farmCompare !== 0) return farmCompare;

			const numA = parseInt(String(a.code).replace(/\D/g, ""), 10);
			const numB = parseInt(String(b.code).replace(/\D/g, ""), 10);

			if (!Number.isNaN(numA) && !Number.isNaN(numB) && numA !== numB) {
				return numA - numB;
			}

			return a.code.localeCompare(b.code, "pt-BR");
		});
	}, [filteredApps, operationFilter, cultureFilter, filtFarm]);


	const insumoOptions = useMemo(() => {
		const rows = (filteredApps ?? [])
			.filter((app) => {
				const op = (app?.operacao ?? "").toString().trim();
				return operationFilter.length === 0 ? true : operationFilter.includes(op);
			})
			.filter((app) => {
				const cultura = (app?.cultura ?? "").toString().trim();
				return cultureFilter.length === 0 ? true : cultureFilter.includes(cultura);
			})
			.filter((app) => {
				const key = makeApOptionKey(app?.fazenda, app?.app);
				return apCodeFilter.length === 0 ? true : apCodeFilter.includes(key);
			})
			.flatMap((app) => getAppInsumosLabels(app));

		return [...new Set(rows)].sort((a, b) => a.localeCompare(b, "pt-BR"));
	}, [filteredApps, operationFilter, cultureFilter, apCodeFilter, getAppInsumosLabels]);


	const isAllApCodesSelected =
		apCodeOptions.length > 0 && apCodeFilter.length === apCodeOptions.length;

	const handleChangeApCodeFilt = (event) => {
		const value = event.target.value;
		setApCodeFilter(typeof value === "string" ? value.split(",") : value);
	};

	const handleToggleAllApCodes = () => {
		setApCodeFilter(
			isAllApCodesSelected ? [] : apCodeOptions.map((item) => item.key)
		);
	};

	const handleClearApCodes = () => setApCodeFilter([]);

	useEffect(() => {
		const validKeys = apCodeOptions.map((item) => item.key);
		setApCodeFilter((prev) => prev.filter((key) => validKeys.includes(key)));
	}, [apCodeOptions]);

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


	const dashboardRef = useRef(null);
	const [isPrinting, setIsPrinting] = useState(false);


	const isAllInsumosSelected =
		insumoOptions.length > 0 && insumoFilter.length === insumoOptions.length;

	const handleChangeInsumoFilt = (event) => {
		const value = event.target.value;
		setInsumoFilter(typeof value === "string" ? value.split(",") : value);
	};

	const handleToggleAllInsumos = () => {
		setInsumoFilter(isAllInsumosSelected ? [] : insumoOptions);
	};

	const handleClearInsumos = () => setInsumoFilter([]);



	const handlePrintDashboard = useCallback(async () => {
		if (!dashboardRef.current) return;

		setIsPrinting(true);

		try {
			// Se tiver imagens remotas, isso ajuda a não “quebrar” o canvas
			const canvas = await html2canvas(dashboardRef.current, {
				backgroundColor: null, // mantém transparente (ou use "#fff" para fundo branco)
				scale: window.devicePixelRatio > 1 ? 2 : 1, // melhora qualidade sem explodir memória
				useCORS: true,
				allowTaint: false,
				logging: false,
				// Captura só o conteúdo visível do trecho (não a página inteira)
				scrollX: 0,
				scrollY: -window.scrollY,
			});

			const dataUrl = canvas.toDataURL("image/png", 1.0);

			const now = new Date();

			const formatted = now.toLocaleString("pt-BR", {
				year: "numeric",
				month: "2-digit",
				day: "2-digit",
				hour: "2-digit",
				minute: "2-digit",
				second: "2-digit",
			})
				.replace(/\//g, "-")
				.replace(/,?\s/g, "-")
				.replace(/:/g, "-");

			// Download automático
			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = `dashboard-${formatted}.png`;
			a.click();
		} catch (err) {
			console.error("Erro ao gerar print:", err);
		} finally {
			setIsPrinting(false);
		}
	}, []);

	const handlePrintElement = useCallback(async (element, fileName = "card") => {
		if (!element) return;

		try {
			const canvas = await html2canvas(element, {
				backgroundColor: null,
				scale: window.devicePixelRatio > 1 ? 2 : 1,
				useCORS: true,
				allowTaint: false,
				logging: false,
				scrollX: 0,
				scrollY: -window.scrollY,
			});

			const dataUrl = canvas.toDataURL("image/png", 1.0);

			const now = new Date();
			const formatted = now
				.toLocaleString("pt-BR", {
					year: "numeric",
					month: "2-digit",
					day: "2-digit",
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				})
				.replace(/\//g, "-")
				.replace(/,?\s/g, "-")
				.replace(/:/g, "-");

			const a = document.createElement("a");
			a.href = dataUrl;
			a.download = `${fileName}-${formatted}.png`;
			a.click();
		} catch (err) {
			console.error("Erro ao gerar print do elemento:", err);
			toast.error("Não foi possível gerar o print.");
		}
	}, []);


	const compactFilterSx = {
		minWidth: 180,
		flex: "0 1 auto",
		"& .MuiInputLabel-root": {
			color: `${colors.grey[900]} !important`,
			fontWeight: 700,
		},
		"& .MuiInputLabel-root.Mui-focused": {
			color: `${colors.blueOrigin?.[600] || colors.grey[900]} !important`,
		},
		"& .MuiOutlinedInput-root": {
			height: 40,
			backgroundColor: "#fff",
			borderRadius: "10px",
			color: `${colors.grey[900]} !important`,
			fontWeight: 600,
		},
		"& .MuiSelect-select": {
			color: `${colors.grey[900]} !important`,
			WebkitTextFillColor: `${colors.grey[900]} !important`,
			display: "flex",
			alignItems: "center",
		},
		"& .MuiOutlinedInput-input": {
			color: `${colors.grey[900]} !important`,
			WebkitTextFillColor: `${colors.grey[900]} !important`,
		},
		"& .MuiSvgIcon-root": {
			color: `${colors.grey[800]} !important`,
		},
		"& .MuiOutlinedInput-notchedOutline": {
			borderColor: colors.grey[300],
		},
		"& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline": {
			borderColor: colors.grey[500],
		},
		"& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
			borderColor: colors.blueOrigin?.[600] || colors.grey[700],
		},
	};

	const compactCheckboxSx = {
		py: 0,
		px: 0.5,
		color: colors.grey[800],
		"&.Mui-checked": {
			color: colors.greenSuccess?.[100] || colors.grey[900],
		},
		"&.MuiCheckbox-indeterminate": {
			color: colors.greenSuccess?.[100] || colors.grey[900],
		},
	};

	const getCompactSelectLabel = (selected, allOptions, getLabel) => {
		if (!selected?.length) return "Todos";

		if (selected.length === 1) {
			const found = allOptions.find((item) => item.key === selected[0] || item === selected[0]);
			if (!found) return "1 selecionado";
			return getLabel ? getLabel(found) : found.label || found;
		}

		if (selected.length === allOptions.length) return "Todos";

		return `${selected.length} selecionados`;
	};

	const handleClearAllFilters = () => {
		setApCodeFilter([]);
		setOperationFilter([]);
		setCultureFilter([]);
		setTipoAplicacaoFilter(TIPOS_APLICACAO);
		setDapApDestaque(50);
		setInsumoFilter([]);
	};

	useEffect(() => {
		setInsumoFilter((prev) => prev.filter((item) => insumoOptions.includes(item)));
	}, [insumoOptions]);


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
					<Button onClick={handleOpenAplicacoesDaily} color="success" disabled={dictSelect.length === 0 || IsloadingDbFarm || loadingData} >
						Aplicações
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
			{openAplicacoesDaily && (
				<AplicacoesDailyPage
					open={openAplicacoesDaily}
					onClose={handleCloseAplicacoesDaily}
					applications={openApp}
					onlyFarms={onlyFarms}
					colors={colors}
					theme={theme}
					initialFarms={filtFarm}
				/>
			)}
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
				{
					filtFarm?.length > 0 &&
					<Tooltip title="Salvar print do dashboard" placement="left">
						<IconButton
							onClick={handlePrintDashboard}
							disabled={isPrinting}
							sx={{
								position: "fixed",
								bottom: 24,
								right: 24,
								zIndex: 1300, // acima de modais comuns
								width: 56,
								height: 56,
								backgroundColor: "info.main",
								color: "#fff",
								boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
								"&:hover": {
									backgroundColor: "info.dark",
								},
								"&:disabled": {
									backgroundColor: "grey.500",
									color: "#fff",
								},
							}}
						>
							{isPrinting ? (
								<CircularProgress size={26} sx={{ color: "#fff" }} />
							) : (
								<PhotoCameraIcon />
							)}
						</IconButton>
					</Tooltip>
				}
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
						{!isMobile && (
							<Box display="flex" flexDirection="row" alignItems="center" gap={1}>
								{/* 1) Aberto + Finalizado */}
								<Tooltip
									arrow
									placement="top"
									title="Quando ligado: mostra aplicações em aberto (sought) e também finalizadas. Quando desligado: mostra somente em aberto (sought)."
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Switch
											checked={openAppOnly}
											onChange={handleCheckOpenApp}
											inputProps={{ "aria-label": "Mostrar finalizadas" }}
											color="secondary"
										/>
									</Box>
								</Tooltip>

								{/* 2) Futuras */}
								<Tooltip
									arrow
									placement="top"
									title="Quando ligado: inclui aplicações com data futura. Quando desligado: limita até a próxima semana."
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Switch
											checked={showFutureApps}
											onChange={handleFutureAp}
											inputProps={{ "aria-label": "Mostrar futuras" }}
											color="warning"
										/>
									</Box>
								</Tooltip>

								{/* 3) EndDate <= hoje */}
								<Tooltip
									arrow
									placement="top"
									title="Quando ligado: mostra somente aplicações cuja data de término (EndDate) é menor ou igual a hoje."
								>
									<Box sx={{ display: "flex", alignItems: "center" }}>
										<Switch
											checked={onlyEndedUntilToday}
											onChange={handleOnlyEndedUntilToday}
											inputProps={{ "aria-label": "EndDate menor ou igual a hoje" }}
											color="error"
										/>
									</Box>
								</Tooltip>

								<Tooltip
									arrow
									placement="top"
									title="Filtro de término: EndDate menor ou igual a hoje."
								>
									<Typography variant="caption" sx={{ color: colors.grey[200], fontWeight: 900, fontSize: '1em' }}>
										{onlyEndedUntilToday ? "Atrasados" : 'Geral'}
									</Typography>
								</Tooltip>
							</Box>
						)}


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
					filtFarm.length > 0 && (
						<Box
							sx={{
								display: "flex",
								alignItems: "center",
								// justifyContent: 'space-evenly',
								gap: 3,
								mb: 2,
								px: 1.25,
								py: 1,
								borderRadius: "12px",
								backgroundColor: isDark ? colors.blueOrigin[700] : colors.grey[100],
								border: `1px solid ${isDark ? colors.grey[700] : colors.grey[300]}`,
								boxShadow: !isDark
									? "0 6px 18px rgba(0,0,0,0.10)"
									: "0 6px 18px rgba(0,0,0,0.28)",
								flexWrap: "nowrap",
								overflowX: "auto",
								overflowY: "hidden",
								whiteSpace: "nowrap",
								scrollbarWidth: "thin",
								"&::-webkit-scrollbar": {
									height: 8,
								},
								"&::-webkit-scrollbar-thumb": {
									backgroundColor: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.18)",
									borderRadius: 999,
								},
							}}
						>
							{apCodeOptions.length > 0 && (
								<FormControl size="small" sx={{ ...compactFilterSx, minWidth: 230 }}>
									<InputLabel id="apcode-filter-label">APs</InputLabel>
									<Select
										labelId="apcode-filter-label"
										multiple
										value={apCodeFilter}
										onChange={handleChangeApCodeFilt}
										input={<OutlinedInput label="APs" />}
										MenuProps={MenuProps}
										renderValue={(selected) =>
											getCompactSelectLabel(selected, apCodeOptions, (item) => item.label)
										}
									>
										<MenuItem onClick={handleToggleAllApCodes}>
											<Checkbox
												checked={isAllApCodesSelected}
												indeterminate={!isAllApCodesSelected && apCodeFilter.length > 0}
											/>
											<ListItemText
												primary={isAllApCodesSelected ? "Desmarcar todas" : "Selecionar todas"}
											/>
										</MenuItem>

										<MenuItem onClick={handleClearApCodes}>
											<Checkbox checked={apCodeFilter.length === 0} />
											<ListItemText primary="Limpar seleção" />
										</MenuItem>

										<Divider />

										{apCodeOptions.map((item) => (
											<MenuItem key={item.key} value={item.key}>
												<Checkbox checked={apCodeFilter.includes(item.key)} />
												<ListItemText primary={item.label} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}

							<FormControl size="small" sx={{ ...compactFilterSx, minWidth: 220 }}>
								<InputLabel id="op-filter-label">Operações</InputLabel>
								<Select
									labelId="op-filter-label"
									multiple
									value={operationFilter}
									onChange={handleChangeOpFilt}
									input={<OutlinedInput label="Operações" />}
									MenuProps={MenuProps}
									renderValue={(selected) => getCompactSelectLabel(selected, options)}
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

									<Divider />

									{options.map((name) => (
										<MenuItem key={name} value={name}>
											<Checkbox checked={operationFilter.includes(name)} />
											<ListItemText primary={name} />
										</MenuItem>
									))}
								</Select>
							</FormControl>

							{cultureOptions.length > 0 && (
								<FormControl size="small" sx={{ ...compactFilterSx, minWidth: 200 }}>
									<InputLabel id="cultura-filter-label">Cultura</InputLabel>
									<Select
										labelId="cultura-filter-label"
										multiple
										value={cultureFilter}
										onChange={handleChangeCultureFilt}
										input={<OutlinedInput label="Cultura" />}
										MenuProps={MenuProps}
										renderValue={(selected) => getCompactSelectLabel(selected, cultureOptions)}
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

										<Divider />

										{cultureOptions.map((name) => (
											<MenuItem key={name} value={name}>
												<Checkbox checked={cultureFilter.includes(name)} />
												<ListItemText primary={name} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}
							{insumoOptions.length > 0 && (
								<FormControl size="small" sx={{ ...compactFilterSx, minWidth: 240 }}>
									<InputLabel id="insumo-filter-label">Insumos</InputLabel>
									<Select
										labelId="insumo-filter-label"
										multiple
										value={insumoFilter}
										onChange={handleChangeInsumoFilt}
										input={<OutlinedInput label="Insumos" />}
										MenuProps={MenuProps}
										renderValue={(selected) => getCompactSelectLabel(selected, insumoOptions)}
									>
										<MenuItem onClick={handleToggleAllInsumos}>
											<Checkbox
												checked={isAllInsumosSelected}
												indeterminate={!isAllInsumosSelected && insumoFilter.length > 0}
											/>
											<ListItemText
												primary={isAllInsumosSelected ? "Desmarcar todos" : "Selecionar todos"}
											/>
										</MenuItem>

										<MenuItem onClick={handleClearInsumos}>
											<Checkbox checked={insumoFilter.length === 0} />
											<ListItemText primary="Limpar seleção" />
										</MenuItem>

										<Divider />

										{insumoOptions.map((name) => (
											<MenuItem key={name} value={name}>
												<Checkbox checked={insumoFilter.includes(name)} />
												<ListItemText primary={name} />
											</MenuItem>
										))}
									</Select>
								</FormControl>
							)}

							<Box
								sx={{
									height: 40,
									display: "flex",
									alignItems: "center",
									gap: 1,
									px: 1.25,
									borderRadius: "10px",
									backgroundColor: "#fff",
									border: `1px solid ${colors.grey[300]}`,
									flex: "0 0 auto",
								}}
							>
								<Typography
									sx={{
										fontSize: "0.82rem",
										fontWeight: 700,
										color: colors.grey[900],
										mr: 0.25,
									}}
								>
									Tipo
								</Typography>

								<FormControlLabel
									sx={{
										m: 0,
										"& .MuiFormControlLabel-label": {
											fontSize: "0.8rem",
											color: colors.grey[900],
											fontWeight: 600,
										},
									}}
									control={
										<Checkbox
											size="small"
											checked={tipoAplicacaoFilter.length === TIPOS_APLICACAO.length}
											indeterminate={
												tipoAplicacaoFilter.length > 0 &&
												tipoAplicacaoFilter.length < TIPOS_APLICACAO.length
											}
											onChange={toggleAllTiposAplicacao}
											sx={compactCheckboxSx}
										/>
									}
									label="Todos"
								/>

								{TIPOS_APLICACAO.map((tipo) => (
									<FormControlLabel
										key={tipo}
										sx={{
											m: 0,
											"& .MuiFormControlLabel-label": {
												fontSize: "0.8rem",
												color: colors.grey[900],
											},
										}}
										control={
											<Checkbox
												size="small"
												checked={tipoAplicacaoFilter.includes(tipo)}
												onChange={() => toggleTipoAplicacao(tipo)}
												sx={compactCheckboxSx}
											/>
										}
										label={
											tipo === "Operacao"
												? "Operação"
												: tipo === "Solido"
													? "Sólido"
													: "Líquido"
										}
									/>
								))}
							</Box>

							<FormControl
								size="small"
								sx={{
									...compactFilterSx,
									minWidth: 110,
									maxWidth: 110,
								}}
							>
								<InputLabel id="dap-destaque-label">DAP</InputLabel>
								<OutlinedInput
									label="DAP"
									type="number"
									value={dapApDestaque}
									onChange={(e) => {
										const value = Number(e.target.value);
										setDapApDestaque(Number.isNaN(value) ? 0 : value);
									}}
									sx={{
										height: 40,
										fontWeight: 700,
									}}
								/>
							</FormControl>

							<Button
								variant="contained"
								color="error"
								onClick={handleClearAllFilters}
								sx={{
									height: 40,
									minWidth: 120,
									borderRadius: "10px",
									fontWeight: 700,
									textTransform: "none",
									boxShadow: "none",
									flex: "0 0 auto",
								}}
							>
								Limpar filtros
							</Button>
						</Box>
					)
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
					ref={dashboardRef}
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
								// apCode (MultiSelect)
								.filter((app) => {
									const key = makeApOptionKey(app?.fazenda, app?.app);
									return apCodeFilter.length === 0 ? true : apCodeFilter.includes(key);
								})
								.filter((app) => tipoAplicacaoFilter.includes(getTipoAplicacao(app)))
								// NOVO: endDate <= hoje
								.filter((app) => {
									if (!onlyEndedUntilToday) return true;

									const end = parseYmdToDayStart(app?.endDate);
									if (!end) return false; // se não tem endDate válido, não entra no filtro

									const today = toDayStart(new Date());
									return end.getTime() <= today.getTime();
								})
								.filter((app) => {
									if (insumoFilter.length === 0) return true;

									const appInsumos = getAppInsumosLabels(app);
									return insumoFilter.some((insumo) => appInsumos.includes(insumo));
								})
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
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '10px', fontWeight: 'bold', textAlign: "left", paddingLeft: 3 }}>
												Nº
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '10px', fontWeight: 'bold', textAlign: "right" }}>
												Operação
											</Typography>
											<Box /> {/* operação */}
											<Box /> {/* datas/tipo */}

											{/* Colunas numéricas */}
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '10px', fontWeight: 'bold', textAlign: "right" }}>
												Área
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '10px', fontWeight: 'bold', textAlign: "right" }}>
												Aplicado
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '10px', fontWeight: 'bold', textAlign: "right" }}>
												Saldo
											</Typography>
											<Typography variant="caption" sx={{ opacity: 0.9, fontSize: '10px', fontWeight: 'bold', textAlign: "center", paddingLeft: 3 }}>
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
												dapApDestaque={dapApDestaque}
												onPrintCard={handlePrintElement}
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
											top: -25, // ajuste conforme altura do header
											zIndex: 20,

											cursor: "pointer",

											// espaçamento
											padding: "12px 16px",

											// visual
											background: colors.brown[100],
											color: colors.modal[700],
											fontWeight: 600,
											borderRadius: 1,

											// 🔴 BORDA CONDICIONAL (somente atrasado)
											border: onlyEndedUntilToday
												? `2px solid ${colors.redAccent?.[500] || "#d32f2f"}`
												: "0.5px solid rgba(255,255,255,0.25)",

											// sombra também pode reforçar o alerta
											boxShadow: onlyEndedUntilToday
												? "0 0 0 2px rgba(211,47,47,0.25), 0 6px 18px rgba(0,0,0,0.15)"
												: "0 6px 18px rgba(0,0,0,0.08)",

											// suavidade
											transition: "all 0.2s ease-in-out",
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
											<Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
												<Typography variant="h4" sx={{ fontWeight: 800 }}>
													{data?.replace("Fazenda ", "")}
												</Typography>

												{onlyEndedUntilToday && (
													<Typography
														variant="caption"
														sx={{
															mt: 1.2,          // 👈 empurra para baixo
															alignSelf: "flex-end",
															px: 1,
															py: 0.25,
															borderRadius: "6px",
															fontWeight: 800,
															backgroundColor: colors.redAccent?.[100],
															color: colors.redAccent?.[600],
															border: `1px solid ${colors.redAccent?.[400]}`,
															textTransform: "uppercase",
														}}
													>
														atrasado
													</Typography>
												)}
											</Box>


											<Typography variant="body2" sx={{ opacity: 0.85, fontWeight: 'bold' }}>
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
														minimumFractionDigits: 0,
														maximumFractionDigits: 0,
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
													const rowsFarm = aplicacoesFiltradas.filter((app) => app.fazenda === farm);
													return (
														<ResumoFazendasPage
															colors={colors}
															fazenda={farm}
															key={i}

															divider={!hasDivider}

															rows={rowsFarm}
														/>
													);
												})}
											{
												filtFarm && (
													<ResumoProdutosConsolidados
														rows={aplicacoesFiltradas}
														title="Produtos pendentes (saldo a aplicar)"
														colors={colors}
														getSaldoHa={(app) => {
															const saldo = Number(app?.saldoAplicar ?? 0);
															if (saldo > 0) return saldo;
															const area = Number(app?.area ?? 0);
															const aplicado = Number(app?.areaAplicada ?? 0);
															return Math.max(0, area - aplicado);
														}}
													/>


												)
											}
										</div>
									</>
								)}
							</div>
						)}
					</div>
				</Box>

				{
					!loadingData && filteredApps.length === 0 && (
						<Box className={classes.emptyFarm}>
							<Typography variant="h4" color={colors.grey[300]}>Selecione uma fazenda</Typography>
							{filtFarm.length === 0 && !isMobile &&
								<PluviDataComp />
							}
						</Box>
					)
				}
			</IndexModalDataFarmbox >

		</Box >
	);
};

export default FarmBoxPage;
