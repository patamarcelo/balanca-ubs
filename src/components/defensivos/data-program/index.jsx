import { Box, Button, Divider, Typography, useTheme, Autocomplete, TextField, } from "@mui/material";
import { tokens, ColorModeContext } from "../../../theme";
import { useState, useEffect, useCallback, useRef, useContext } from "react";
import classes from "./data-program.module.css";

import { displayDate } from "../../../utils/format-suport/data-format";

import { faCheck, faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";
import { faArrowDownShortWide } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMediaQuery from "@mui/material/useMediaQuery";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import Zoom from "@mui/material/Zoom";
// import CustomButton from "../../button";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import cotton from '../../../utils/assets/icons/cotton.png'

import { faPrint } from "@fortawesome/free-solid-svg-icons";

import MapPage from "../maps";
import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

import { useSelector } from "react-redux";
import { selectIsAdminUser } from "../../../store/user/user.selector";
import {
	selectPlantio,
	selectSafraCiclo
} from "../../../store/plantio/plantio.selector";

import EmptyResultPage from "./empty-result";

// import JsPDF from "jspdf"
// import moment from "moment";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

// import MapPlotDjango from "./data-plot-map";


import FarmIcon from '../../../utils/assets/icons/farmbox.svg'
import toast from "react-hot-toast";
import LinearProgress from "@mui/material/LinearProgress";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { createRoot } from "react-dom/client";


import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';



const DataProgramPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const colorMode = useContext(ColorModeContext);
	const { initialDateForm, finalDateForm, handleRefreshData } = props;

	const [farmList, setFarmList] = useState([]);
	const [objList, setObjList] = useState([]);
	const [objResumValues, setObjResumValues] = useState([]);
	const [filteredAndDucplicatedParcelas, setfilteredAndDucplicatedParcelas] = useState([]);

	const [filteredList, setFilteredList] = useState([]);
	const [farmSelected, setFarmSelected] = useState("");

	const [showProducts, setShoeProducts] = useState(true);
	const isNonIpad = useMediaQuery("(min-width: 1404px)");
	const isCellPhone = useMediaQuery("(min-width: 850px)");

	const [onlyOpenApp, setOnlyOpenApp] = useState(false);

	const [filtData, setFiltData] = useState(false);

	const [mapArray, setMapArray] = useState([]);
	// const [mapArrayIds, setMapArrayIds] = useState([]);
	const [dataToMap, setDataToMap] = useState([]);

	const [areaFiltTotal, setAreaFiltTotal] = useState(0);

	const [showMapps, setShowMapps] = useState(false);

	const [isLoadingHome, setIsLoading] = useState(true);

	const [updateApp, setUpdateApp] = useState([]);

	const [sendingData, setSendingData] = useState(false);
	const [positiveSignal, setPositiveSignal] = useState(false);

	const isAdminUser = useSelector(selectIsAdminUser);
	const plantioRedux = useSelector(selectPlantio);
	const safraCiclo = useSelector(selectSafraCiclo);

	const [hidenAppsArr, setHidenAppsArr] = useState([]);

	const [appIsLoading, setAppIsLoading] = useState(null);

	const [loadMaps, setLoadMaps] = useState(false);
	const [prodsToRemove, setProdsToRemove] = useState([]);
	const [prodsToAdd, setprodsToAdd] = useState([]);

	const [prodsToUse, setProdsToUse] = useState([]);
	const [isLoadingProdsToUse, setIsLoadingProdsToUse] = useState(false);

	const MySwal = withReactContent(Swal);

	const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);



	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" },
		{ cultura: "Algodão", icon: cotton, alt: "algodao" },
	];


	useEffect(() => {
		const getDefensivosData = async () => {
			setIsLoadingProdsToUse(true)
			try {
				await djangoApi
					.get("defensivo/get_defensivos_integration_farmbox/", {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						console.log(res);
						const { dados } = res.data
						setProdsToUse(dados)
						setIsLoadingProdsToUse(false)
					});
			} catch (err) {
				console.log("Erro ao alterar as aplicações", err);
			} finally {
				setIsLoadingProdsToUse(false)
			}
		};
		getDefensivosData()
	}, []);

	const selectedProd = useRef(null);
	const filterOptions = (options, { inputValue }) =>
		options
			.filter((o) =>
				o.name.toLowerCase().includes(inputValue.toLowerCase())
			)
			.slice(0, 100050);


	const handleAddProd = async (hiddenAppName, existProds) => {

		await MySwal.fire({
			title: `Adicionar insumo`,
			html: `<div id="swal-react-root">/div>`,
			showCancelButton: true,
			confirmButtonText: "Adicionar",
			cancelButtonText: "Cancelar",
			focusConfirm: false,
			customClass: { popup: "swal2-compact" },
			/** Monta o React dentro do Swal */
			didOpen: () => {
				const container = document.getElementById("swal-react-root");
				const root = createRoot(container);

				root.render(
					<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						{/* AUTOCOMPLETE COMPACTO */}
						{hiddenAppName.replace('|', " - ").replace('Projeto', ' - ')}
						<Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
							<Autocomplete
								id="swal-prod"
								size="small"
								options={prodsToUse}
								filterOptions={filterOptions}
								getOptionLabel={(opt) => opt.name}
								onChange={(_, value) => (selectedProd.current = value)}
								renderInput={(params) => (
									<TextField {...params} label="Insumo" />
								)}
								sx={{ width: 280 }}
							/>

							{/* DOSE – 3 CASAS DECIMAIS */}
							<TextField
								id="swal-dose"
								label="Dose"
								placeholder="0.000"
								size="small"
								type="number"
								inputProps={{ step: 0.001, min: 0 }}
							/>
						</Box>
					</Box>
				);

				/** desmonta o React quando o Swal fechar */
				MySwal.getPopup().addEventListener("swalClose", () => root.unmount());
			},
			/** Valida e devolve resultado */
			preConfirm: () => {
				const doseStr = document.getElementById("swal-dose").value.trim();

				if (!selectedProd.current) {
					MySwal.showValidationMessage("Selecione um produto.");
					return false;
				}
				if (!/^\d+(\.\d{1,3})?$/.test(doseStr)) {
					MySwal.showValidationMessage("Dose deve ter até 3 casas decimais.");
					return false;
				}

				return {
					prod: selectedProd.current, // objeto inteiro {id, name…}
					dose: parseFloat(doseStr).toFixed(3),
				};
			},
		}).then(({ isConfirmed, value }) => {
			// if (isConfirmed) onSave?.(value); // { prod, dose }
			if (isConfirmed) {
				const prodName = value.prod.name;

				// 1) Já existe na calda?
				const alreadyInCalda = existProds.some(p => p.produto === prodName);

				// 2) Está na lista de remoção (para este app)?
				const scheduledToRemove = prodsToRemove
					.filter(item => item.appName === hiddenAppName)   // isola o app
					.some(item => item.prodToRemove?.produto === prodName); // ajuste o campo se necessário

				if (alreadyInCalda && !scheduledToRemove) {
					Swal.fire({
						title: "Atenção!!",
						html: `<b>Produto já consta na Calda</b> `,
						icon: "warning"
					});
					return;
				}
				const { prod, dose } = value
				const { name, ...prodClean } = prod;
				const newProd = {
					...prodClean,
					dosage_value: Number(dose)
				}
				const prodToAdd = {
					objToSendtoFarm: newProd,
					objToRender: {
						dose: Number(dose),
						produto: name,
					},
					appName: hiddenAppName
				}
				setprodsToAdd((prev) => {
					return [...prev, prodToAdd]
				})

				toast.success(
					'Produto Adicionado com sucesso!!',
					{
						position: "bottom-left",
						duration: 2000
					}
				)
			}
		});
	}


	const handleDeleteProdManual = (prod, hiddenAppName) => {
		setprodsToAdd((prev) =>
			prev.filter(
				(item) =>
					// mantém se NÃO for o app em questão...
					item.appName !== hiddenAppName ||
					// ...ou se for o app, mas NÃO é o mesmo produto
					item.objToRender?.produto !== prod.produto
			)
		);
	};

	const handleDeleteProd = (prod, prodsArray, appName) => {
		// console.log("AppName:", appName);

		const prodToRemove = prodsArray.find((data) => data.produto === prod.produto);
		// console.log("prodToRemove", prodToRemove);

		setProdsToRemove((prev) => {
			const alreadyExists = prev.some(
				(item) =>
					item.appName === appName &&
					item.prodToRemove?.produto === prodToRemove?.produto
			);

			if (alreadyExists) {
				// Remove o item se já existir
				return prev.filter(
					(item) =>
						!(item.appName === appName && item.prodToRemove?.produto === prodToRemove?.produto)
				);
			} else {
				// Adiciona o item
				return [...prev, { appName, prodToRemove }];
			}
		});
	};


	const handleSetApp = (dataId, estagio, hiddenAppName, plantioIdFarmbox) => {
		const newDict = {
			id: dataId,
			estagio: estagio,
			appName: hiddenAppName,
			plantioIdFarmbox
		};
		const isIn = updateApp.some(
			(data) => data.id === dataId && data.estagio === estagio
		);
		if (isIn) {
			// console.log("já colocado");
			const newArr = updateApp.filter((data) => {
				const newData = `${data.id}${data.estagio}`;
				const oldData = `${dataId}${estagio}`;
				return newData !== oldData;
			});
			setUpdateApp(newArr);
		} else {
			setUpdateApp((updateApp) => [...updateApp, newDict]);
			// console.log("ainda não estava");
		}
	};
	
	const handleSetAppMany = (dataId, estagio, hiddenAppName, plantioIdFarmbox) => {
		const newDict = {
			id: dataId,
			estagio: estagio,
			appName: hiddenAppName,
			plantioIdFarmbox
		};
		const isIn = updateApp.some(
			(data) => data.appName === hiddenAppName
		);
		if (isIn) {
			const newArr = updateApp.filter((data) => data.appName !== hiddenAppName)
			setUpdateApp(newArr);
		} else {
			setUpdateApp((updateApp) => [...updateApp, newDict]);
		}
	};

	// const handleRequestDjangoMaps = () => {
	// 	setLoadMaps(!loadMaps)
	// }
	
	const handleSendApiApp = async (data) => {
		const params = JSON.stringify({ data });
		try {
			setSendingData(true);
	
			const res = await djangoApi.put(
				"plantio/update_aplication_plantio/",
				params,
				{
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
					},
				}
			);
	
			const taskId = res.data.task_id;
			console.log("🔁 Task iniciada:", taskId);
	
			if (!taskId) {
				throw new Error("task_id não recebido!");
			}
	
			let attempts = 0;
			const maxAttempts = 60; // até 60 segundos
			const intervalId = setInterval(async () => {
				try {
					const statusRes = await djangoApi.get(
						`backgroundtask/${taskId}/task_status/`,
						{
							headers: {
								Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
							},
						}
					);
	
					const taskStatus = statusRes.data.status;
					console.log("🔍 Verificando status:", statusRes);
					console.log("🔍 Verificando status:", taskStatus);
	
					if (taskStatus === "done") {
						clearInterval(intervalId);
						setSendingData(false);
	
						Swal.fire({
							title: "Atualização concluída!",
							text: "As aplicações foram atualizadas com sucesso.",
							icon: "success",
							confirmButtonText: "Ok",
						});
	
						// setPositiveSignal(true);
						setPositiveSignal(false)
						handleRefreshData()
						// setTimeout(() => setPositiveSignal(false), 1500);
						// setTimeout(() => handleRefreshData(), 1700);
					}
	
					if (taskStatus === "failed") {
						clearInterval(intervalId);
						setSendingData(false);
	
						console.error("❌ Task falhou!", statusRes.data.result?.error);
	
						Swal.fire({
							title: "Erro ao processar!",
							text: "A tarefa falhou. Verifique os dados e tente novamente.",
							icon: "error",
							confirmButtonText: "Fechar",
						});
					}
	
					if (++attempts >= maxAttempts) {
						clearInterval(intervalId);
						setSendingData(false);
						Swal.fire({
							title: "Tempo esgotado",
							text: "A verificação da tarefa excedeu o tempo máximo.",
							icon: "warning",
						});
					}
				} catch (err) {
					console.error("Erro ao consultar status da task:", err);
					clearInterval(intervalId);
					setSendingData(false);
					Swal.fire({
						title: "Erro de rede",
						text: "Erro ao consultar o status da tarefa.",
						icon: "error",
					});
				}
			}, 1000);
		} catch (err) {
			console.error("Erro ao iniciar a tarefa:", err);
			setSendingData(false);
			Swal.fire({
				title: "Erro de envio",
				text: "Erro ao iniciar o envio das aplicações.",
				icon: "error",
			});
		}
	};

	// const handleSendApiApp = async (data) => {
	// 	const params = JSON.stringify({
	// 		data: data
	// 	});
	// 	try {
	// 		setSendingData(true);
	// 		await djangoApi
	// 			.put("plantio/update_aplication_plantio/", params, {
	// 				headers: {
	// 					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
	// 				}
	// 			})
	// 			.then((res) => {
	// 				console.log(res);
	// 			});
	// 	} catch (err) {
	// 		console.log("Erro ao alterar as aplicações", err);
	// 	} finally {
	// 		setUpdateApp([]);
	// 		setSendingData(false);

	// 		setPositiveSignal(true);
	// 		setTimeout(() => {
	// 			setPositiveSignal(false);
	// 		}, 1500);

	// 		setTimeout(() => {
	// 			handleRefreshData();
	// 		}, 1700);
	// 	}
	// };

	const handleShowMaps = () => {
		setShowMapps(!showMapps);
	};

	const handlerShowMaps = useCallback(() => {
		if (showMapps && farmSelected) {
			setShowMapps(false);
			setTimeout(() => {
				setShowMapps(true);
			}, 500);
		}
	}, [farmSelected, showMapps]);

	useEffect(() => {
		handlerShowMaps();
	}, [farmSelected, handlerShowMaps]);

	const filteredIcon = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data.cultura
		);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data.cultura
		);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	useEffect(() => {
		(async () => {
			try {
				await djangoApi
					.post("plantio/get_plantio_detail_map/", safraCiclo, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						setDataToMap(res.data.dados_plantio);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		if (dataToMap) {
			const mapArray = dataToMap.map((data, i) => {
				return {
					projeto: data.fazenda,
					parcela: data.parcela,
					map_centro_id: data.dados.projeto_map_centro_id,
					map_zoom: data.dados.projeto_map_zoom,
					cultura: data.dados.cultura,
					variedade: data.dados.variedade,
					variedadeColor: data.dados.variedade_color,
					variedadeColorLine: data.dados.variedade_color_line,
					map_geo_poins: data?.dados?.map_geo_points?.map((data) => ({
						lat: Number(data.latitude),
						lng: Number(data.longitude)
					})),
					map_geo_center_points: data?.dados?.map_geo_points_center
				};
			});

			setMapArray(
				mapArray.filter((data) => data.projeto === farmSelected)
			);
			setLoadMaps(false)
		}
	}, [dataToMap, farmSelected]);

	useEffect(() => {
		const listFarm = plantioRedux
			.filter((data) => data.dados.plantio_finalizado === true)
			.map((data, i) => {
				return data.fazenda;
			});
		setFarmList([...new Set(listFarm)].sort());
		handleFilterList([...new Set(listFarm)].sort()[0]);
	}, [plantioRedux]);

	const handleFilterList = (farmName) => {
		setFarmSelected(farmName);
		const filtList = plantioRedux.filter(
			(data) =>
				data.fazenda === farmName &&
				(data.dados.plantio_finalizado === true)
		);
		setFilteredList(filtList);
	};

	const handleFilterTable = () => {
		setFiltData(!filtData);
	};

	const addDaysToDate = (dateStr, daysToAdd) => {
		// Convert the date string to a Date object
		const date = new Date(dateStr);

		// Add the specified number of days
		date.setDate(date.getDate() + daysToAdd);

		// Format the new date back to "yyyy-mm-dd"
		const newDateStr = date.toISOString().split('T')[0];

		return newDateStr;
	}

	useEffect(() => {
		const filtParcelas = filteredList.map((data, i) => {
			const initialDate = initialDateForm;
			const finalDate = finalDateForm ? finalDateForm : "2023-05-29";
			const cronograma = data.dados.cronograma;

			// PLOT MAT INFORMATION
			const projetoMapCentroId = data.dados.projeto_map_centro_id;
			const mapGeoPoints = data.dados.map_geo_points;
			const variedadeColor = data.dados.variedade_color;
			const variedadeColorLine = data.dados.variedade_color_line;
			const plantioId = data.dados.plantio_id;

			//INTEGRACAO FARMBOX
			const id_marcelo_pata = 15153
			const harvest_id = data.dados.safra_id_farmbox
			const farm_id = data.dados.projeto_id_farmbox
			const responsible_id = data.dados?.responsavel_id_farmbox ? data.dados?.responsavel_id_farmbox : id_marcelo_pata
			const charge_id = data.dados?.encarregado_id_farmbox ? data.dados?.encarregado_id_farmbox : id_marcelo_pata
			const today = (new Date()).toLocaleDateString('pt-BR').split('/').reverse().join('-')
			const endDate = addDaysToDate(today, 6)

			const plantations = []
			const inputs = []

			const objSendToFarm = {
				date: today,
				end_date: endDate,
				harvest_id,
				farm_id,
				responsible_id,
				charge_id,
				plantations,
				inputs,
				observations: 'Aplicação Aberta via integração'
			}

			// console.log('objToFarm', objSendToFarm)


			const cronArr = cronograma.map((cron, i) => {
				const aplicado = cron.aplicado;
				let cronOb;
				const dataPrev = cron["data prevista"];
				if (dataPrev >= initialDate && dataPrev <= finalDate) {
					const plantioIdFarmbox = data?.plantio_id_farmbox
					const estagio = cron.estagio;
					const dataPrevApp = dataPrev;
					const dapApp = cron.dap;
					const parcela = data.parcela;
					const variedade = data.dados.variedade;
					const dataPlantio = data.dados.data_inicio_plantio;
					const area = data.dados.area_colheita;
					const dap = data.dados.dap;
					const cultura = data.dados.cultura;
					const produtosAp = cron.produtos;
					const produtos = produtosAp.map((data) => ({
						...data,
						area: area
					}));
					cronOb = {
						parcela,
						variedade,
						dataPlantio,
						estagio,
						dataPrevApp,
						dapApp,
						area,
						dap,
						cultura,
						produtos,
						aplicado,
						projetoMapCentroId,
						mapGeoPoints,
						variedadeColor,
						variedadeColorLine,
						plantioId,
						objSendToFarm,
						plantioIdFarmbox
					};
				}
				return cronOb;
			});
			if (!onlyOpenApp) {
				return cronArr.filter(
					(data) => data !== undefined && data.aplicado === false
				);
			} else {
				return cronArr.filter((data) => data !== undefined);
			}
		});
		const compare = (a, b) => {
			// if(new Date(a.dataPrevApp) < new Date(b.dataPrevApp)) return -1;
			// if(new Date(a.dataPrevApp) > new Date(b.dataPrevApp)) return 1;
			if (a.dapApp < b.dapApp) return -1;
			if (a.dapApp > b.dapApp) return 1;
			// if(a.cultura < b.cultura) return -1;
			// if(a.cultura > b.cultura) return 1;

			// if(a.variedade < b.variedade) return -1;
			// if(a.variedade > b.variedade) return 1;

		}
		const filtArray = filtParcelas
			.flat()
			.sort(compare)
			.sort((a, b) => a.estagio.split('|')[1]?.localeCompare(b.estagio.split('|')[1]))
		// .sort((a, b) => a.cultura.localeCompare(b.cultura))
		// .sort((a, b) => new Date(a.dataPrevApp) - new Date(b.dataPrevApp) || )
		// .sort((a, b) => a.dapApp - b.dapApp)
		const result = filtArray.reduce((acc, curr) => {
			const estagio = curr.estagio;
			const dapApp = curr.dapApp;
			if (dapApp >= 0) {
				if (acc[estagio] == null) acc[estagio] = [];
				acc[estagio].push(curr);
			}
			return acc;
		}, {});
		const dictTotal = [];
		Object.keys(result).map((data, i) => {
			// console.log('data', data)
			// console.log('resultData', result[data])

			//Array to send plantations to FarmBox
			const plantationsFarm = []

			const total = result[data].reduce((acc, curr) => {
				const objToAdd = {
					sought_area: curr.area,
					plantation_id: curr.plantioIdFarmbox
				}
				plantationsFarm.push(objToAdd)
				return curr.area + acc;
			}, 0);

			//Array to send plantations to FarmBox
			const inputsFarm = []
			let objToFarm;
			const produtosArr = result[data].map((data, i) => {
				if (i === 0) {
					objToFarm = data.objSendToFarm
				}
				const filtArr = data.produtos
					.sort((a, b) => a.tipo.localeCompare(b.tipo))
					.map((data) => {
						if (inputsFarm.filter((insumosInside) => insumosInside.input_id === data.id_farmbox).length === 0) {
							const objToAdd = {
								dosage_value: parseFloat(data.dose),
								dosage_unity: data.formulacao,
								input_id: data.id_farmbox
							}
							inputsFarm.push(objToAdd)
						}
						return data;
					});
				return filtArr;
			});
			const firstOrder = inputsFarm.filter((input) => input.dosage_unity === 'un_ha')
			const secondOrder = inputsFarm.filter((input) => input.dosage_unity !== 'un_ha')
			let inputsOrdered = []
			if (showProducts) {
				inputsOrdered = [...firstOrder, ...secondOrder]
			} else {
				inputsOrdered = firstOrder
			}
			//obj para enviar ao farm
			const dataToFarmBox = {
				...objToFarm,
				plantations: plantationsFarm,
				inputs: inputsOrdered,
			}

			const newDic = {
				estagio: data,
				cronograma: result[data],
				total: total.toLocaleString("pt-br", {
					maximumFractionDigits: 2
				}),
				produtos: produtosArr.flat(),
				dataToFarmBox: dataToFarmBox
			};
			dictTotal.push(newDic);
			return newDic;
		});
		setObjList(dictTotal);
	}, [filteredList, initialDateForm, finalDateForm, onlyOpenApp, showProducts]);

	useEffect(() => {
		const useArr = [...objList];
		const filtArr = useArr.map((data, i) => {
			const dataProdutos = data.produtos;
			var result = [];
			// const area_total = data.total.replace(".", "").replace(",", ".");
			// console.log(parseFloat(area_total));
			dataProdutos.reduce(function (res, value) {
				if (!res[value.produto]) {
					res[value.produto] = {
						produto: value.produto,
						qty: 0,
						dose: Number(value.dose),
						tipo: value.tipo
					};
					result.push(res[value.produto]);
				}
				res[value.produto].qty += value.area * Number(value.dose);
				return res;
			}, {});
			return { data, totais: result };
		});
		const totalArea = filtArr.map((data) =>
			Number(data.data.total.replace(".", "").replace(",", "."))
		);
		var sum = totalArea.reduce((accumulator, currentValue) => {
			return accumulator + currentValue;
		}, 0);
		setAreaFiltTotal(sum);
		setObjResumValues(filtArr);
		const parcelasArr = filtArr.map((data) => {
			const parcelasHere = data.data.cronograma.map((parcela) => parcela.parcela)
			return parcelasHere.flat()
		})
		setfilteredAndDucplicatedParcelas(parcelasArr.flat())

	}, [objList]);

	const formatName = () => {
		const saveFile = farmSelected;
		return saveFile;
	};

	const hasduplicated = (ele) => {
		if (filteredAndDucplicatedParcelas.length > 0) {
			const moreThanOne = filteredAndDucplicatedParcelas.filter((data) => data === ele).length
			const hasDuplicated = moreThanOne > 1 ? true : false
			return hasDuplicated
		}
		return false
	}

	const generatePDF = async () => {
		try {
			setIsGeneratingPDF(true);

			// Esconde elementos com classe .print-safe-wrapper (ex: botões)
			document.querySelectorAll(".print-safe-wrapper").forEach(el => {
				el.style.visibility = "hidden";
			});

			const actualTheme = theme.palette.mode;
			if (actualTheme === 'dark') {
				colorMode.toggleColorMode();
			}

			// Pequena pausa para aplicar mudanças visuais
			await new Promise(res => setTimeout(res, 300));

			const pdf = new jsPDF("portrait", "pt", "a4");
			const pageHeight = pdf.internal.pageSize.getHeight() - 40; // margem de 20pt topo/baixo
			const pageWidth = pdf.internal.pageSize.getWidth() - 40;   // margem lateral

			const headerDiv = document.querySelector(".print-fazenda-div");
			const contentDivs = Array.from(document.querySelectorAll(".mainProgramAllDiv"));
			const footerDiv = document.querySelector("#footerDiv");

			// Junta todos os elementos para renderizar no PDF
			const allDivs = [headerDiv, ...contentDivs];
			if (footerDiv) allDivs.push(footerDiv);

			let currentY = 20;

			for (let i = 0; i < allDivs.length; i++) {
				const div = allDivs[i];
				if (!div) continue;
				if (i > 0) {
					div.style.display = 'block';
				}
				div.style.opacity = '1';
				div.style.visibility = 'visible';

				const canvas = await html2canvas(div, {
					scale: 1.2,
					useCORS: true,
					allowTaint: true,
				});

				const imgData = canvas.toDataURL("image/jpeg", 0.7);
				const imgProps = pdf.getImageProperties(imgData);

				const imgWidth = pageWidth;
				const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

				if (currentY + imgHeight > pageHeight) {
					pdf.addPage();
					currentY = 20;
				}

				pdf.addImage(imgData, "JPEG", 20, currentY, imgWidth, imgHeight);
				currentY += imgHeight + 10;
			}

			pdf.save(`${formatName()}.pdf`);

			if (actualTheme === 'dark') {
				colorMode.toggleColorMode();
			}
		} catch (error) {
			console.error("Erro ao gerar PDF:", error);
		} finally {
			// Restaura visibilidade dos botões
			document.querySelectorAll(".print-safe-wrapper").forEach(el => {
				el.style.visibility = "visible";
			});
			setIsGeneratingPDF(false);
		}
	};

	const hiddenApps = (appNameToHdie, totalArea, parcelas) => {
		const parcelasToHide = parcelas.cronograma.map((parcelas) => parcelas.parcela)
		const formatArea = parseFloat(
			totalArea.replace(".", "").replace(",", ".")
		);
		if (hidenAppsArr.includes(appNameToHdie)) {
			const excludeApp = hidenAppsArr.filter(
				(data) => data !== appNameToHdie
			);
			setHidenAppsArr(excludeApp);
			const newArea = parseFloat(areaFiltTotal) + formatArea;
			setAreaFiltTotal(newArea);
			const reinsertParcelas = [...filteredAndDucplicatedParcelas, ...parcelasToHide]

			console.log('colocando')
			setfilteredAndDucplicatedParcelas(reinsertParcelas);
		} else {
			setHidenAppsArr((prev) => [...prev, appNameToHdie]);
			const newArea = parseFloat(areaFiltTotal) - formatArea;
			setAreaFiltTotal(newArea);

			console.log('retirando')
			setfilteredAndDucplicatedParcelas(prev => {
				parcelasToHide.forEach(item => {
					const index = prev.indexOf(item);
					if (index > -1) {
						prev.splice(index, 1);
					}
				})
				return prev
			})
		}
	};

	useEffect(() => {
		setHidenAppsArr([]);
	}, [farmSelected]);

	useEffect(() => {
		console.log('isThereAnyProdToAdd', prodsToAdd)
	}, [prodsToAdd]);

	const handleOpenApp = async (data, cronograma, estagio, programaLoading, hiddenAppName) => {
		console.log('data to send to Farmbox', data)
		let newData = data
		const isThereAnyProdToRemove = prodsToRemove.filter((data) => data.appName === hiddenAppName)
		if (isThereAnyProdToRemove?.length > 0) {
			console.log('yes, need to remove someProds here:');

			// helper para padronizar a dose com 3 casas
			const to3 = v => Number(v).toFixed(3);

			// monta array de {id, dose} padronizados
			const onlyIdToRemove = isThereAnyProdToRemove.map(data => ({
				id: data.prodToRemove.id_farmbox,
				dose: to3(data.prodToRemove.dose),
			}));


			// cria Set com chaves "id|dose" para busca eficiente
			const removeKeys = new Set(
				onlyIdToRemove.map(item => `${item.id}|${item.dose}`)
			);

			// filtra mantendo só os que NÃO estão no removeKeys
			newData = {
				...newData,
				inputs: newData.inputs.filter(
					prods => !removeKeys.has(`${prods.input_id}|${to3(prods.dosage_value)}`)
				),
			};
		}
		const isThereAnyProdToAdd = prodsToAdd.filter((data) => data.appName === hiddenAppName)
		if (isThereAnyProdToAdd.length > 0) {
			const onlyObjTOFarm = isThereAnyProdToAdd.map((data) => data.objToSendtoFarm)
			newData = {
				...newData,
				inputs: [...newData.inputs, ...onlyObjTOFarm]
			}
		}

		const isThereAnyPlantationToRemove = updateApp.filter((data) => data.appName === hiddenAppName)
		let parcelasToUp = cronograma.map((crono) => ({ id: crono.plantioId, estagio: estagio }))
		if (isThereAnyPlantationToRemove.length > 0) {
			console.log('precisa remover as plantacoes abaixo:')
			const onlyIdPlantations = isThereAnyPlantationToRemove.map((parcela) => parcela.plantioIdFarmbox)
			newData = {
				...newData,
				plantations: newData.plantations.filter((data) => !onlyIdPlantations.includes(data.plantation_id))
			}
			const onlyPlantioId = isThereAnyPlantationToRemove.map((data) => data.id)

			parcelasToUp = parcelasToUp.filter((data) => !onlyPlantioId.includes(data.id))
		}

		// console.log('newData', newData)
		// console.log('parcelasToRemove', updateApp)
		// console.log('cronograma', cronograma)
		// console.log('parcelasToUp', parcelasToUp)

		const params = JSON.stringify({
			data: newData
		});
		try {
			setAppIsLoading(programaLoading)
			await djangoApi
				.put("plantio/open_app_farmbox/", params, {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					}
				})
				.then((res) => {
					console.log(res);
					if (res.data.status === 201) {
						const dataFromServer = JSON.parse(res.data.result)
						const { code } = dataFromServer;
						Swal.fire({
							title: "Feito!!",
							html: `AP Aberta com Sucesso: <b>${code}</b> `,
							icon: "success"
						});
						parcelasToUp.forEach((parcela) => {
							handleSetApp(parcela.id, parcela.estagio)
						})
					}
					setAppIsLoading(null)
				});
		} catch (err) {
			console.log("Erro ao alterar as aplicações", err);
			console.log("Erro ao alterar as aplicações", err.response.data.msg);
			console.log("Erro ao alterar as aplicações", JSON.parse(err.response.data.result));
			toast.error(
				`Erro ao Abrir a Aplicação - ${err.response.data.msg} - ${JSON.parse(err.response.data.result)}`,
				{
					position: "top-center",
					duration: 5000
				}
			)
			setAppIsLoading(null)
		} finally {
			console.log('finally alterar')
		}
	}

	return (
		<Box
			className={classes.mainDiv}
			style={{ backgroundColor: colors.blueOrigin[700] }}
			mt={3}
		>
			<Box
				className={`${classes.div} ${classes["farm-list-div"]}`}
				style={{ backgroundColor: colors.blueOrigin[800] }}
			>
				{farmList.map((data, i) => {
					return (
						<Box
							key={i}
							gap={10}
							sx={{
								boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 15px",
								borderRadius: "8px"
							}}
						>
							<Typography
								className={classes.hasitemInsideArr}
								style={{
									backgroundColor:
										farmSelected === data
											? colors.primary[900]
											: colors.brown[550],
									color:
										farmSelected === data &&
											theme.palette.mode === "light"
											? "black"
											: farmSelected !== data &&
												theme.palette.mode === "light"
												? "white"
												: colors.primary[100],
									fontStyle: "italic",
									fontWeight: 600
								}}
								variant="h6"
								onClick={() => handleFilterList(data)}
							>
								{data.replace("Projeto ", "")}
							</Typography>
						</Box>
					);
				})}
				<Box sx={{ marginLeft: "auto" }}>
					{isGeneratingPDF ? (
						<CircularProgress
							size={24}
							sx={{
								color: colors.blueAccent[500],
								marginRight: "12px",
							}}
						/>
					) : (
						<IconButton onClick={generatePDF}>
							<FontAwesomeIcon
								icon={faPrint}
								color={colors.blueAccent[500]}
								size={"sm"}
							/>
						</IconButton>
					)}
				</Box>
			</Box>
			<Box
				className={[
					classes["box-program"],
					classes["printableGeralProgramaDiv"]
				]}
				id="printableGeralProgramaDiv"
				mt={2}
			>
				<Box
					className={`${classes["fazenda-div"]} fazenda-div`}
					style={{
						backgroundColor: theme.palette.mode !== "dark" ? "#ffffff" : colors.blueOrigin[800], // força branco no modo escuro
					}}
				>
					<Typography
						className="print-fazenda-div"
						variant={!isCellPhone ? "h6" : "h6"}
						color={
							theme.palette.mode === "dark"
								? colors.primary[100]
								: "black"
						}
						sx={{
							display: "flex",
							flexDirection: "row",
							width: "100%",
							justifyContent: "space-between",
							paddingLeft: "5px",
							fontWeight: "bold"
						}}
					>
						<div style={{ fontFamily: "Times New Roman", fontStyle: 'italic' }}>
							até{" "}
							{finalDateForm && displayDate(finalDateForm)}
						</div>
						<div style={{ fontFamily: "Times New Roman", display: 'flex', flexDirection: 'row' }}>
							{farmSelected?.replace('Projeto', '')}
							<div
								className="print-safe-wrapper"
								style={{
									visibility: isGeneratingPDF ? "hidden" : "visible"
								}}
							>
								<FontAwesomeIcon
									icon={!onlyOpenApp ? faCheckDouble : faClock}
									color={
										!onlyOpenApp
											? colors.greenAccent[500]
											: colors.yellow[500]
									}
									size="sm"
									style={{
										margin: "0px 10px",
										cursor: "pointer"
									}}
									onClick={() => setOnlyOpenApp(!onlyOpenApp)}
								/>
								<FontAwesomeIcon
									icon={
										!filtData
											? faArrowDownShortWide
											: faArrowDownAZ
									}
									color={
										!filtData
											? colors.greenAccent[500]
											: colors.yellow[500]
									}
									size="sm"
									style={{
										margin: "0px 0px",
										cursor: "pointer"
									}}
									onClick={() => handleFilterTable()}
								/>
								{isLoadingHome ? (
									<CircularProgress
										size={15}
										sx={{
											margin: "0px 10px",
											color: (theme) =>
												colors.greenAccent[
												theme.palette.mode === "dark"
													? 200
													: 800
												]
										}}
									/>
								) : (
									<FontAwesomeIcon
										icon={faMapLocationDot}
										color={
											!showMapps
												? colors.greenAccent[500]
												: colors.yellow[500]
										}
										size="sm"
										style={{
											margin: "0px 10px",
											cursor: "pointer"
										}}
										onClick={() => handleShowMaps()}
									/>
								)}

								{/* {isLoadingHome ? (
								<CircularProgress
									size={15}
									sx={{
										margin: "0px 10px",
										color: (theme) =>
											colors.greenAccent[
												theme.palette.mode === "dark"
													? 200
													: 800
											]
									}}
								/>
							) : (
								<FontAwesomeIcon
									icon={faMapLocationDot}
									color={
										!showMapps
											? colors.greenAccent[500]
											: colors.yellow[500]
									}
									size="sm"
									style={{
										margin: "0px 10px",
										cursor: "pointer"
									}}
									onClick={() => handleRequestDjangoMaps()}
								/>
							)} */}

								{isAdminUser &&
									updateApp.length > 0 &&
									(sendingData ? (
										<CircularProgress
											size={15}
											sx={{
												margin: "0px 10px",
												color: (theme) =>
													colors.greenAccent[
													theme.palette.mode ===
														"dark"
														? 200
														: 800
													]
											}}
										/>
									) : (
										<IconButton
											aria-label="delete"
											onClick={() =>
												handleSendApiApp(updateApp)
											}
										>
											<FontAwesomeIcon
												icon={faCircleCheck}
												size="xs"
											/>
										</IconButton>
									))}

								{
									<Fade in={positiveSignal}>
										<FontAwesomeIcon
											icon={faCheck}
											size="xs"
											color={colors.greenAccent[500]}
										/>
									</Fade>
								}
							</div>
						</div>
						<div>
							{areaFiltTotal > 0 && (
								<div style={{ fontFamily: "Times New Roman" }}>
									&nbsp;&nbsp;&nbsp; Área:&nbsp;{" "}
									{areaFiltTotal.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}
								</div>
							)}
						</div>
					</Typography>
				</Box>
				{objResumValues.length === 0 && <EmptyResultPage />}

				<Box className={classes["geral-program-div"]}>
					{objResumValues.length > 0 &&
						objResumValues.map((dat, i) => {
							const data = dat.data;
							const openApp = data.dataToFarmBox
							const programa = data.estagio.split("|")[1];
							const estagio = data.estagio.split("|")[0];
							const hiddenAppName =
								dat.data.estagio + farmSelected;


							const totalToMult = Number(data.total.replace(/\./g, '').replace(',', '.'));
							const totaisFiltrados = dat.totais
								.sort((a, b) => a.tipo.localeCompare(b.tipo))
								.filter((t) => t.tipo !== "operacao");

							const extrasRender = prodsToAdd
								.filter((ex) => ex.appName === hiddenAppName)
								.map((ex) => {
									return {
										...ex.objToRender,
										qty: totalToMult * ex.objToRender.dose,
										canRemove: true
									}
								});

							const linhasParaMostrar = [...totaisFiltrados, ...extrasRender];
							return (
								<>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											alignItems: 'center',
											width: '100%',
										}}
									>
										<IconButton
											onClick={() =>
												hiddenApps(
													hiddenAppName,
													data.total,
													data
												)
											}
											aria-label="delete"
											color="warning"
											sx={{
												alignSelf: "start",
												borderRadius: "12px"
											}}
										>
											<DeleteIcon />
											<Typography
												variant="h6"
												color={colors.textColor[100]}
											>
												{estagio}
											</Typography>
										</IconButton>
										{
											isAdminUser &&
											(
												appIsLoading === data.estagio ?
													<CircularProgress
														size={25}
														sx={{
															margin: "0px 10px",
															color: (theme) =>
																colors.greenAccent[
																theme.palette.mode === "dark"
																	? 200
																	: 800
																]
														}}
													/>
													:
													<Button
														onClick={() => handleOpenApp(openApp, data.cronograma, estagio, data.estagio, hiddenAppName)}
														sx={{
															cursor: "pointer",
															width: "50px",
															height: "50px",
														}}
													>
														<img src={FarmIcon} alt="img-icon" style={{ marginTop: '15px' }} />
													</Button>
											)
										}
									</Box >
									{
										appIsLoading === data.estagio &&
										<Box sx={{ width: "100%", padding: '0px 10px' }}>
											<LinearProgress color="success" />
										</Box>
									}
									<div
										key={i}
										style={{
											boxShadow:
												"rgba(0, 0, 0, 0.5) 2px 2px 2px 1px",
											borderRadius: "8px",
											opacity: hidenAppsArr.includes(
												hiddenAppName
											)
												? "0"
												: "1",
											display: hidenAppsArr.includes(
												hiddenAppName
											)
												? "none"
												: "block",
											pageBreakInside: "avoid",
											breakInside: "avoid" // importante para navegadores modernos
										}}
										className={`${classes["mainProgramAllDiv"]} mainProgramAllDiv`}
									>
										<div
											key={i}
											style={{
												backgroundColor:
													colors.blueOrigin[800],
												border:
													theme.palette.mode ===
													"light" &&
													"1px solid black"
											}}
											className={
												classes[
												`${!isCellPhone
													? "detail-parcela-div-mobile"
													: "detail-parcela-div"
												}`
												]
											}
										><span
											style={{
												alignSelf: 'self-start',
												marginTop: '10px',
												marginLeft: '10px',
												fontWeight: 'bold',
												marginRight: '-40px',
											}}
										>
												{objResumValues.length - (i)} {" "}
											</span>
											<div
												className={
													!isNonIpad
														? classes[
														"estagio-div-ipad"
														]
														: classes["estagio-div"]
												}
											>
												<FontAwesomeIcon
													icon={
														!showProducts
															? faEyeSlash
															: faEye
													}
													color={
														!showProducts
															? colors
																.redAccent[500]
															: colors
																.greenAccent[500]
													}
													size="sm"
													style={{
														marginTop: "20px",
														cursor: "pointer"
													}}
													onClick={() =>
														setShoeProducts(
															!showProducts
														)
													}
												/>
												<p
													style={{
														color:
															theme.palette
																.mode ===
																"light"
																? "grey"
																: colors
																	.primary[300]
													}}
												>
													{programa}
												</p>
												<Box
													sx={{
														cursor: 'pointer',
														"& p:hover": {
															opacity: 0.5
														}
													}}
													onClick={() => data.cronograma
														.sort((a, b) =>
															!filtData
																? new Date(
																	a.dataPrevApp
																) -
																new Date(
																	b.dataPrevApp
																)
																: a.parcela.localeCompare(
																	b.parcela
																)
														).forEach(element => {
															console.log(element.plantioId, element.estagio.split("|")[0])
															handleSetAppMany(element.plantioId, element.estagio.split("|")[0], hiddenAppName)
														})}
												>
													<p style={{ color: colors.primary[200] }}>{estagio}</p>
												</Box>
												<p
													style={{
														color:
															theme.palette
																.mode ===
																"light"
																? colors
																	.primary[100]
																: colors
																	.primary[100]
													}}
												>
													Área Total: {data.total}
												</p>
												<Zoom
													in={showProducts}
													style={{
														transitionDelay:
															showProducts
																? "300ms"
																: "0ms"
													}}
												>
													<div
														className={
															classes[
															"div-produtos-aplicar-outside"
															]
														}
													>
														{linhasParaMostrar
															.map((dataP, i) => {
																// console.log('dataP', dataP)
																const quantidade =
																	Number(
																		dataP.qty
																	).toLocaleString(
																		"pt-br",
																		{
																			maximumFractionDigits: 2,
																			minimumFractionDigits: 2
																		}
																	);
																const wasRemoved = prodsToRemove.filter((prodTo) => prodTo.appName === hiddenAppName && prodTo.prodToRemove.produto === dataP.produto && Number(prodTo?.prodToRemove?.dose).toFixed(3) === Number(dataP.dose).toFixed(3))
																if (wasRemoved.length > 0) {
																	console.log('wasRemoved', Number(wasRemoved[0]?.prodToRemove?.dose).toFixed(3) === Number(dataP.dose).toFixed(3))
																	console.log('dataP Dose', Number(dataP.dose).toFixed(3))
																}
																return (
																	<div
																		key={i}
																		style={{
																			height: "100%",
																			transition:
																				"height 3s",
																			display:
																				showProducts
																					? ""
																					: "none"
																		}}
																	>
																		<div
																			className={
																				classes[
																				"div-produtos-aplicar"
																				]
																			}
																		>
																			<div
																				style={{
																					textDecoration: wasRemoved.length > 0 && 'line-through',
																					color:
																						theme
																							.palette
																							.mode ===
																							"light"
																							? "black"
																							: colors
																								.primary[100]
																				}}
																				className={
																					classes[
																					"div-produtos-aplicar-produto"
																					]
																				}
																			><IconButton
																				onClick={() =>
																					!dataP.canRemove ?
																						handleDeleteProd(dataP, dat?.data?.produtos, hiddenAppName)
																						:
																						handleDeleteProdManual(dataP, hiddenAppName)
																				}
																				size="small"
																				aria-label="delete"
																				color={!wasRemoved.length > 0 ? "warning" : 'success'}
																				sx={{
																					alignSelf: "start",
																					borderRadius: "12px"
																				}}
																			>
																					{
																						!dataP.canRemove ?
																							<DeleteIcon />
																							:
																							<DeleteForeverIcon />

																					}
																				</IconButton>
																				{`${dataP.dose.toLocaleString(
																					"pt-br",
																					{
																						minimumFractionDigits: 3,
																						maximumFractionDigits: 3
																					}
																				)} - ` +
																					dataP.produto}
																			</div>
																			<div
																				style={{
																					color:
																						theme
																							.palette
																							.mode ===
																							"light"
																							? "black"
																							: colors
																								.primary[100]
																				}}
																				className={
																					classes[
																					"div-produtos-aplicar-quantidade"
																					]
																				}
																			>
																				{" "}
																				{
																					quantidade
																				}
																			</div>
																		</div>
																	</div>
																);
															})}
													</div>
												</Zoom>
												{
													isLoadingProdsToUse ?
														<CircularProgress size={24} color="inherit" />
														:
														<div
															className="print-safe-wrapper"
															style={{
																visibility: isGeneratingPDF ? "hidden" : "visible"
															}}
														>
															<IconButton
																size="small"
																color="success"
																onClick={() => handleAddProd(hiddenAppName, linhasParaMostrar)}
																aria-label="adicionar"
																disabled={prodsToUse.length === 0}
															>
																<AddCircleRoundedIcon fontSize="small" />
															</IconButton>
														</div>
												}
											</div>
											<div
												className={
													classes[
													"parcelas-resumo-div"
													]
												}
											>
												<div style={{ gap: "8px" }}>
													<div
														className={
															classes[
															"parcelas-div-header"
															]
														}
														style={{
															borderBottom: `0.5px dotted ${colors.primary[100]}`
														}}
													>
														<div
															style={{
																textAlign: 'left'
																// marginRight:
																// 	"20px"
															}}
														>
															Parcela
														</div>
														<div>Plantio</div>
														<div
														// style={{
														// 	marginRight:
														// 		"20px"
														// }}
														>
															Dap
														</div>
														<div
															// style={{
															// 	marginRight:
															// 		"30px"
															// }}
															className={
																classes[
																"cultura-div"
																]
															}
														>
															Cultura
														</div>
														<div>Variedade</div>
														<div
														// style={{
														// 	marginLeft:
														// 		"30px"
														// }}
														>
															Prev.
														</div>
														<div
														// style={{
														// 	marginLeft:
														// 		"20px"
														// }}
														>
															DAP AP
														</div>
														<div>Área</div>
													</div>
													{data.cronograma
														.sort((a, b) =>
															!filtData
																? new Date(
																	a.dataPrevApp
																) -
																new Date(
																	b.dataPrevApp
																)
																: a.parcela.localeCompare(
																	b.parcela
																)
														)
														.map((data, i) => {
															const dataId =
																data.plantioId;
															const setEstagio =
																data.estagio.split(
																	"|"
																)[0];

															const checkSelected =
																updateApp.some(
																	(data) =>
																		data.id ===
																		dataId &&
																		data.estagio ===
																		estagio
																);
															return (
																<div
																	key={i}
																	className={`${classes[
																		"parcelas-detail-div"
																	]
																		}
																	${checkSelected && classes["parcelas-resumo-div-selected"]}
																	${data.aplicado && classes["parcelas-resumo-div-aplicado"]}
																}
																	`}
																>
																	<div
																		className={
																			classes[
																			`${"parcela-div"}`

																			]
																		}
																	>
																		<div
																			className={
																				classes[
																				`${"parcela-icon-div"}`
																				]
																			}
																			onClick={() =>
																				handleSetApp(
																					dataId,
																					setEstagio,
																					hiddenAppName,
																					data.plantioIdFarmbox
																				)
																			}
																		>
																			<img
																				src={filteredIcon(
																					data
																				)}
																				alt={filteredAlt(
																					data
																				)}
																				style={{
																					filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
																				}}
																			/>
																		</div>
																		<span className={classes[`${hasduplicated(data.parcela) && "parcela-duplicated-" + theme.palette.mode}`]} style={{ fontWeight: 'bold' }}>
																			{
																				data.parcela
																			}
																		</span>
																	</div>
																	<div
																		style={{
																			color: colors
																				.greenAccent[300]
																		}}
																	>
																		{displayDate(
																			data.dataPlantio
																		)}
																	</div>
																	<div>
																		{data.dap <
																			10
																			? "0" +
																			data.dap
																			: data.dap}
																	</div>
																	<div
																		className={
																			classes[
																			"cultura-div"
																			]
																		}
																	>
																		{
																			data.cultura
																		}
																	</div>
																	<div
																		className={
																			classes[
																			"variedade-div"
																			]
																		}
																	>
																		{
																			data.variedade
																		}
																	</div>
																	<div>
																		{displayDate(
																			data.dataPrevApp
																		)}
																	</div>
																	<div>
																		{
																			data.dapApp
																		}
																	</div>
																	<div
																		style={{
																			color: colors
																				.primary[100],
																			fontWeight: 'bold'
																		}}
																		className={
																			classes[
																			"area-div"
																			]
																		}
																	>
																		{data.area
																			.toFixed(
																				2
																			)
																			.replace(
																				".",
																				","
																			)}
																	</div>
																</div>
															);
														})}
												</div>
											</div>
										</div>
										{/* <MapPlotDjango
											mapIdsFilter={mapIdsFilter}
											farmSelected={farmSelected}
											loadMaps={loadMaps}
											/> */}
										{showMapps && (
											<Box
												sx={{
													display: "flex",
													justifyContent: "center",
													alignItems: "center",
													borderRadius: "8px",
													backgroundColor:
														colors.blueOrigin[800]
												}}
												className={
													classes["geral-map-div"]
												}
											>
												<MapPage
													farmSelected={farmSelected}
													mapArray={mapArray}
													filtData={data}
												/>
											</Box>
										)}
									</div>
								</>
							);
						})}
					{objResumValues.length > 0 && (
						<Box
							id="footerDiv"
							sx={{ textAlign: 'center', marginTop: '10px' }}
						>
							<Divider>{farmSelected?.replace('Projeto', '')}</Divider>
						</Box>
					)}
				</Box>
			</Box>
		</Box >
	);
};

export default DataProgramPage;
