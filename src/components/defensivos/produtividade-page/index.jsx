import { Box, Typography, Collapse } from "@mui/material";
import djangoApi from "../../../utils/axios/axios.utils";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

import SelectFarm from "./select-farm";
import MapPage from "./map-page";
import ListPage from "./list-page";
import ListPrintPage from "./list-print-page";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import styles from "./produtividade.module.css";

import { useDispatch, useSelector } from "react-redux";
import { setPlantioMapAll } from "../../../store/plantio/plantio.actions";
import {
	selecPlantioMapAll,
	selectSafraCiclo
} from "../../../store/plantio/plantio.selector";
import HeaderPage from "./header-page";

import Switch from "@mui/material/Switch";

import CircularProgress from "@mui/material/CircularProgress";
import "./printPage.css";

import Filter1Icon from '@mui/icons-material/Filter1';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';


import EventNoteIcon from "@mui/icons-material/EventNote"; // Planner
import LandscapeIcon from "@mui/icons-material/Landscape"; // Planted Area

import MapIcon from "@mui/icons-material/Map";
import CloseIcon from "@mui/icons-material/Close";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { IconButton, Tooltip } from "@mui/material";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPlane, faPrint, faFilePdf
} from "@fortawesome/free-solid-svg-icons";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import MultiSelectFilter from "./filter-parcelas";
import { formatNumber } from '../../../utils/format-suport/data-format'



const ProdutividadePage = () => {
	const [params, setParams] = useState({
		safra: "2023/2024",
		ciclo: "1"
	});

	const [printPage, setPrintPage] = useState(true);
	const [bigMap, setBigMap] = useState(false);

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dispatch = useDispatch();

	const plantioMapALl = useSelector(selecPlantioMapAll);
	const safraCiclo = useSelector(selectSafraCiclo);
	const [filteredPlantioMal, setFilteredPlantioMal] = useState();
	const [mapPlantation, setMapPlantation] = useState([]);

	const [produtividade, setProdutividade] = useState([]);
	const [loadingData, setLoadingData] = useState(true);
	const [projetos, setProjetos] = useState([]);
	const [selectedProject, setSelectedProject] = useState([]);
	const [selectedCultureFilter, setSelectedCultureFilter] = useState([]);
	const [selectedVarietyFilter, setSelectedVarietyFilter] = useState([]);

	const [filteredArray, setFilteredArray] = useState([]);

	const [filtPlantioDone, setFiltPlantioDone] = useState(false);

	const [resumoByVar, setResumoByVar] = useState();

	const [filtCult, setFiltCult] = useState([]);

	const [sumTotalSelected, setSumTotalSelected] = useState(0);

	const [totalSelected, setTotalSelected] = useState([]);

	const [showVarOrArea, setShowVarOrArea] = useState(false);

	const [showAsPlanned, setShowAsPlanned] = useState(true);

	const [filterDropCulture, setFilterDropCulture] = useState([]);
	const [filterDropVariety, setFilterDropVariety] = useState([]);

	const [showResumeMap, setShowResumeMap] = useState(true);


	const [loadingMapKml, setLoadingMapKml] = useState(false);
	const [loadingMapKmlColor, setLoadingMapKmlColor] = useState(false);
	const [printPageList, setPrintPageList] = useState(false);

	const [loadingMap, setLoadingMap] = useState(false);
	const [loadingMapList, setLoadingMapList] = useState(false);
	const [farmIdPdf, setFarmIdPdf] = useState(null);

	const [parcelasSelected, setParcelasSeleced] = useState([]);

	const [showTableList, setShowTableList] = useState(false);

	const [operationName, setOperationName] = useState("");

	const [useRealArray, setUseRealArray] = useState([]);

	useEffect(() => {
		if (selectedProject) {
			const getFarmId = filteredArray.find((data) => data.talhao__fazenda__nome === selectedProject[0])?.talhao__fazenda__id_farmbox
			setFarmIdPdf(getFarmId)
		}
	}, [selectedProject, filteredArray]);

	const handlerClearData = () => {
		setShowResumeMap(!showResumeMap)
	}
	const handlerClearParcelas = () => {
		setParcelasSeleced([])
	}

	const handleStatusChange = (newSelection) => {
		setParcelasSeleced(newSelection);
	};
	const toggleParcela = (value) => {
		setParcelasSeleced((prev) => {
			// se o valor já estiver presente, remove
			if (prev.includes(value)) {
				return prev.filter((v) => v !== value);
			}
			// se não estiver, adiciona
			return [...prev, value];
		});
	};


	const handleValueMap = () => {
		setShowVarOrArea(prev => !prev)
	}

	const handlePlannerData = () => {
		setShowAsPlanned(prev => !prev)
	}

	const handleSUm = (selected) => {
		const findItem = totalSelected.filter(
			(data) => data.parcela === selected.parcela
		);
		if (findItem.length > 0) {
			setTotalSelected(
				totalSelected.filter(
					(data) => data.parcela !== selected.parcela
				)
			);
		} else {
			setTotalSelected((prev) => [...prev, selected]);
		}
	};

	const handlePrintPage = (e) => {
		setPrintPage(e.target.checked);
	};
	const handleBigMap = (e) => {
		setBigMap(e.target.checked);
	};

	const handleListShowData = (e) => {
		setFiltPlantioDone(e.target.checked);
	};

	// useEffect(() => {
	// 	const filteredArray = produtividade.filter(
	// 		(data) =>
	// 			selectedProject.includes(data.talhao__fazenda__nome)
	// 	);
	// 	setMapPlantation(filteredArray);

	// 	const totalResumo = {};
	// 	const totalResumoVariedades = {};
	// 	filteredArray
	// 		.filter((data) => data.variedade__cultura__cultura !== "Milheto")
	// 		.filter((data) => {
	// 			// If selectedCultureFilter is empty, return all cultures
	// 			if (selectedCultureFilter.length === 0) {
	// 				return true;
	// 			}
	// 			// Otherwise, filter by the selected cultures
	// 			return selectedCultureFilter.includes(data.variedade__cultura__cultura);
	// 		})
	// 		.filter((data) => {
	// 			// If selectedCultureFilter is empty, return all cultures
	// 			if (selectedVarietyFilter.length === 0) {
	// 				return true;
	// 			}
	// 			// Otherwise, filter by the selected cultures
	// 			return selectedVarietyFilter.includes(data.variedade__nome_fantasia);
	// 		})
	// 		.filter((data) => {
	// 			// If selectedCultureFilter is empty, return all cultures
	// 			if (parcelasSelected.length === 0) {
	// 				return true;
	// 			}
	// 			// Otherwise, filter by the selected parcelas
	// 			return parcelasSelected.includes(data.id_farmbox);
	// 		})
	// 		.map((data) => {
	// 			const areaSum = data.finalizado_colheita
	// 				? data.area_colheita
	// 				: data.area_parcial;
	// 			const getArea = areaSum ? areaSum : 0;
	// 			const pesoSum = data?.peso_kg ? data?.peso_kg : 0;
	// 			const dataSum = {
	// 				area: getArea,
	// 				peso: pesoSum
	// 			};
	// 			const areaSumByVar = {
	// 				area: data.area_colheita
	// 			};
	// 			const nameOfArea =
	// 				data.variedade__cultura__cultura +
	// 				"|" +
	// 				data.variedade__nome_fantasia;
	// 			if (totalResumo[data.variedade__cultura__cultura]) {
	// 				totalResumo[data.variedade__cultura__cultura].peso +=
	// 					pesoSum;
	// 				totalResumo[data.variedade__cultura__cultura].area +=
	// 					getArea;
	// 			} else {
	// 				totalResumo[data.variedade__cultura__cultura] = dataSum;
	// 			}

	// 			if (totalResumoVariedades[nameOfArea]) {
	// 				totalResumoVariedades[nameOfArea].area +=
	// 					data.area_colheita;
	// 			} else {
	// 				totalResumoVariedades[nameOfArea] = areaSumByVar;
	// 			}

	// 			return totalResumo;
	// 		});

	// 	setResumoByVar(totalResumoVariedades);
	// 	setFiltCult(totalResumo);
	// 	// const totalFiltered = filteredPlantioMal.reduce((cur, sum) => {
	// 	// 	const keyDic = cur.dados
	// 	// 	if(sum[cur.])
	// 	// 	return sum;
	// 	// }, {});
	// 	// console.log(totalFiltered);
	// }, [selectedProject, produtividade, selectedCultureFilter, selectedVarietyFilter, parcelasSelected]);

	useEffect(() => {
		// 1) Base: filtra pelo(s) projeto(s) selecionado(s)
		let base = produtividade.filter((d) =>
			selectedProject.includes(d.talhao__fazenda__nome)
		);

		// 2) Se showAsPlanned === true → mantém apenas plantios finalizados
		if (!showAsPlanned) {
			base = base.filter((d) => d.finalizado_plantio === true);
		}

		// continua expondo o "mapa" com a base (igual ao teu comportamento original)
		setMapPlantation(base);

		// 3) Filtros adicionais: cultura, variedade, parcelas, e remover "Milheto"
		const filtered = base
			.filter((d) => d.variedade__cultura__cultura !== "Milheto")
			.filter((d) =>
				selectedCultureFilter.length === 0
					? true
					: selectedCultureFilter.includes(d.variedade__cultura__cultura)
			)
			.filter((d) =>
				selectedVarietyFilter.length === 0
					? true
					: selectedVarietyFilter.includes(d.variedade__nome_fantasia)
			)
			.filter((d) =>
				parcelasSelected.length === 0
					? true
					: parcelasSelected.includes(d.id_farmbox)
			);

		// 4) Agrupamentos (iguais aos teus, só aplicados em "filtered")
		const totalResumo = {};
		const totalResumoVariedades = {};

		filtered.forEach((data) => {
			const areaSum = data.finalizado_colheita ? data.area_colheita : data.area_parcial;
			const getArea = areaSum || 0;
			const pesoSum = data?.peso_kg || 0;

			const cultura = data.variedade__cultura__cultura;
			const variedade = data.variedade__nome_fantasia;
			const nameOfArea = `${cultura}|${variedade}`;

			// por cultura
			if (totalResumo[cultura]) {
				totalResumo[cultura].peso += pesoSum;
				totalResumo[cultura].area += getArea;
			} else {
				totalResumo[cultura] = { area: getArea, peso: pesoSum };
			}

			// por variedade (usa area_colheita como no teu original)
			if (totalResumoVariedades[nameOfArea]) {
				totalResumoVariedades[nameOfArea].area += data.area_colheita || 0;
			} else {
				totalResumoVariedades[nameOfArea] = { area: data.area_colheita || 0 };
			}
		});

		setResumoByVar(totalResumoVariedades);
		setFiltCult(totalResumo);
	}, [
		selectedProject,
		produtividade,
		selectedCultureFilter,
		selectedVarietyFilter,
		parcelasSelected,
		showAsPlanned, // <<< importante!
	]);

	useEffect(() => {
		const filterCult = plantioMapALl.filter((data) => selectedProject.includes(data.fazenda)).map((data) => data.dados.cultura)
		const uniqueFilterCult = [...new Set(filterCult)].filter((data) => data !== null)
		setFilterDropCulture(uniqueFilterCult)

		const filterVariety = plantioMapALl
			.filter((data) => selectedProject.includes(data.fazenda))
			.filter((data) => {
				// If selectedCultureFilter is empty, return all cultures
				if (selectedCultureFilter.length === 0) {
					return true;
				}
				// Otherwise, filter by the selected cultures
				return selectedCultureFilter.includes(data.dados.cultura);
			})
			.map((data) => data.dados.variedade)

		const uniqueFilterVari = [...new Set(filterVariety)].filter((data) => data !== null)
		setFilterDropVariety(uniqueFilterVari)

		const filterArr = plantioMapALl
			.filter((data) => selectedProject.includes(data.fazenda))
			.filter((data) => {
				// If selectedCultureFilter is empty, return all cultures
				if (selectedCultureFilter.length === 0) {
					return true;
				}
				// Otherwise, filter by the selected cultures
				return selectedCultureFilter.includes(data.dados.cultura);
			})
			.filter((data) => {
				// If selectedCultureFilter is empty, return all cultures
				if (selectedVarietyFilter.length === 0) {
					return true;
				}
				// Otherwise, filter by the selected cultures
				return selectedVarietyFilter.includes(data.dados.variedade);
			});

		// const filterArr = plantioMapALl.filter(
		// 	(data) => selectedProject.includes(data.fazenda)
		// ).filter((data) => {
		// 	// console.log('data here from map page: ', data)
		// 	return data.dados.cultura === 'Soja'
		// }).filter((parcela) => !["A15", "B06", "B09"].includes(parcela.parcela));

		setFilteredPlantioMal(filterArr);
	}, [selectedProject, plantioMapALl, selectedCultureFilter, selectedVarietyFilter]);

	const handleChangeSelect = (event) => {
		const value = event.target.value;
		setSelectedProject(typeof value === 'string' ? value.split(',') : value);
		// setSelectedProject(event.target.value);
	};

	const handleChangeSelectCulture = (event) => {
		const value = event.target.value;
		setSelectedCultureFilter(typeof value === 'string' ? value.split(',') : value);
		// setSelectedProject(event.target.value);
	};

	const handleChangeSelectVariety = (event) => {
		const value = event.target.value;
		setSelectedVarietyFilter(typeof value === 'string' ? value.split(',') : value);
		// setSelectedProject(event.target.value);
	};

	useEffect(() => {
		const filterArray = produtividade
			.filter(
				(data) => selectedProject.includes(data.talhao__fazenda__nome)
			)
			.filter((data) => {
				// If selectedCultureFilter is empty, return all cultures
				if (selectedCultureFilter.length === 0) {
					return true;
				}
				// Otherwise, filter by the selected cultures
				return selectedCultureFilter.includes(data.variedade__cultura__cultura);
			})
			.filter((data) => {
				// If selectedCultureFilter is empty, return all cultures
				if (selectedVarietyFilter.length === 0) {
					return true;
				}
				// Otherwise, filter by the selected cultures
				return selectedVarietyFilter.includes(data.variedade__nome_fantasia);
			});

		;
		setFilteredArray(filterArray);
	}, [selectedProject, produtividade, selectedCultureFilter, selectedVarietyFilter]);

	useEffect(() => {
		const onlyProjetos = produtividade.map((data) => {
			return data.talhao__fazenda__nome;
		});
		setProjetos([
			...new Set(onlyProjetos.sort((a, b) => a.localeCompare(b)))
		]);
	}, [produtividade]);

	useEffect(() => {
		(async () => {
			setLoadingData(true);
			try {
				await djangoApi
					.post("plantio/get_produtividade_plantio/", safraCiclo, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						// console.log('detail Produtividade: ', res.data.dados_plantio)
						// setProdutividade(res.data.dados_plantio.filter((data) => data.variedade__nome_fantasia !== "Pingo de Ouro").filter((data) =>  data.variedade__nome_fantasia !== "Caupi"));
						setProdutividade(res.data.dados_plantio);
					});
			} catch (err) {
				console.log(err);
			} finally {
				setLoadingData(false);
			}
		})();
	}, []);

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
						// console.log('detailMap: ', res.data.dados_plantio)
						dispatch(setPlantioMapAll(res.data.dados_plantio))
						// dispatch(setPlantioMapAll(res.data.dados_plantio.filter((data) => data.dados.variedade !== "Pingo de Ouro").filter((data) => data.dados.variedade !== "Caupi")));
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setLoadingData(false);
			}
		})();
	}, []);


	const handleGenerateKml = async (color) => {
		const getIdFarm = [...new Set(filteredArray?.map((data) => data.talhao__fazenda__id_farmbox))];
		const idFarm = getIdFarm
		const getIdParcelas = filteredArray?.map((data) => data.id_farmbox)
		const idParcelasSelected = getIdParcelas

		const farmName = selectedProject
			.map(p => p.replace('Projeto ', ''))
			.join('__');
		const params = JSON.stringify({
			projeto: idFarm,
			parcelas: idParcelasSelected,
			safra: safraCiclo,
			shouldUsecolor: color

		});

		if (color) {
			setLoadingMapKmlColor(true)
		} else {
			setLoadingMapKml(true);
		}
		try {
			const res = await djangoApi.post("plantio/get_kmls_aviacao/", params, {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
				},
			});
			// Handle KML file download
			const downloadKMLFile = () => {
				const kmlDataUri = res.data.data.kml; // Accessing the KML data URI from the nested 'data'
				const link = document.createElement('a');
				link.href = kmlDataUri; // Set the KML data URI as the link href
				link.download = `${farmName.replace('Fazenda ', '')}_.kml`; // Set the filename for download
				document.body.appendChild(link); // Append link to body
				link.click(); // Trigger the download
				document.body.removeChild(link); // Clean up by removing the link
			};

			// Call the download function to initiate the download
			downloadKMLFile(); // Call this function to initiate the download
		} catch (err) {
			console.log("Erro ao alterar as aplicações", err);
			if (color) {
				setLoadingMapKmlColor(false)
			} else {
				setLoadingMapKml(false);
			}
		} finally {
			if (color) {
				setLoadingMapKmlColor(false)
			} else {
				setLoadingMapKml(false);
			}
		}
	};

	const handlePrintPdf = async () => {
		setLoadingMap(true);

		try {
			const res = await djangoApi.post(
				"plantio/get_matplot_draw/",
				{
					projeto: farmIdPdf,
					parcelas: parcelasSelected,
					safra: safraCiclo,
				},
				{
					responseType: "text",
					headers: { Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}` },
				}
			);

			const base64Image = res.data;
			const img = new Image();
			img.src = base64Image;

			img.onload = () => {
				const scaleFactor = 0.8; // mantém boa qualidade, reduz levemente
				const canvas = document.createElement("canvas");
				canvas.width = img.width * scaleFactor;
				canvas.height = img.height * scaleFactor;

				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

				const resizedBase64 = canvas.toDataURL("image/png");

				const pdf = new jsPDF({
					orientation: "landscape",
					unit: "px",
					format: "a4",
				});

				const pageWidth = pdf.internal.pageSize.getWidth();

				// Título colado no mapa
				const titleText = selectedProject[0]?.replace('Projeto', 'Fazenda') || "Mapa";
				pdf.setFont("helvetica", "bold");
				pdf.setFontSize(27);
				pdf.text(titleText, pageWidth / 2, 40, { align: "center" });

				// Mantém a imagem do mapa no tamanho máximo possível sem alterar proporção
				const ratio = Math.min(pageWidth / canvas.width, (pdf.internal.pageSize.getHeight() - 50) / canvas.height);
				const imgWidth = canvas.width * ratio;
				const imgHeight = canvas.height * ratio;
				const marginX = (pageWidth - imgWidth) / 2;
				const marginY = 50; // título ocupa 40px, deixamos 10px de espaçamento

				pdf.addImage(resizedBase64, "PNG", marginX, marginY, imgWidth, imgHeight);
				pdf.save(`${selectedProject}.pdf`);
				setLoadingMap(false);
			};
		} catch (err) {
			console.error("Error while generating PDF", err);
			setLoadingMap(false);
		}
	};




	const handlePrintPdfWithTable = async () => {
		setLoadingMapList(true);
		const colorArray = useRealArray.filter((data) => !!data.variedadeColor).map((data) => ({ id_farmbox: data.id_farmbox, color_selected: data.variedadeColor }))
		try {
			const parcelas = mapPlantation
				.map((data) => ({
					parcela: data.talhao__id_talhao,
					area: data.area_colheita,
				}))
				.sort((a, b) => a.parcela.localeCompare(b.parcela, undefined, { numeric: true }));

			const res = await djangoApi.post(
				"plantio/get_matplot_draw/",
				{
					projeto: farmIdPdf,
					parcelas: parcelasSelected,
					safra: safraCiclo,
					colorArray: colorArray
				},
				{
					responseType: "text",
					headers: { Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}` },
				}
			);

			const base64Image = res.data;
			const img = new Image();
			img.src = base64Image;

			img.onload = () => {
				const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
				const pageWidth = pdf.internal.pageSize.getWidth();
				const pageHeight = pdf.internal.pageSize.getHeight();

				// ---------- TÍTULO ----------
				const titleText = selectedProject[0]?.replace("Projeto", "Fazenda") || "Mapa";
				pdf.setFont("helvetica", "bold");
				pdf.setFontSize(25);
				const titleTopMargin = 20; // metade do valor anterior
				pdf.text(titleText, pageWidth / 2, titleTopMargin, { align: "center" });


				// ---------- SUBTÍTULO (TOTAL ÁREA) ----------
				let totalArea = 0
				totalArea = parcelas.reduce((sum, p) => sum + Number(p.area), 0);
				const subtitleText = `${totalArea.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
				// Cor cinza
				pdf.setTextColor(100); // 0 = preto, 255 = branco

				// Subtítulo
				pdf.setFont("helvetica", "bold");
				pdf.setFontSize(8);
				pdf.text(subtitleText, pageWidth / 2, 31, { align: "center" });


				if (operationName?.length > 0) {
					// ---------- TÍTULO OPERACAO BOTTOM PAGE ----------
					const titleTextOperation = operationName;
					pdf.setFont("helvetica", "bold");
					pdf.setFontSize(20);

					// Usa a altura total da página. PageHeight - margem
					const bottomMarginPage = 10;
					pdf.text(titleTextOperation, pageWidth / 2, pageHeight - bottomMarginPage, { align: "center" });

				}

				// ---------- SUBTÍTULO OPERACAO (TOTAL ÁREA) ----------
				const totalParcelas = mapPlantation.filter((data) => parcelasSelected.includes(data.id_farmbox))
				const totalValueOperation = totalParcelas.reduce(
					(acc, curr) => acc + Number(curr.area_colheita || 0),
					0
				);
				if (totalValueOperation > 0) {
					const subtitleTextTotalOp = `Área Total Selecionada: ${totalValueOperation.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ha`;
					// Cor cinza
					pdf.setTextColor(100); // 0 = preto, 255 = branco

					// Subtítulo
					pdf.setFont("helvetica", "bold");
					pdf.setFontSize(12);
					const bottomMarginPageSubtitle = 5;
					pdf.text(subtitleTextTotalOp, pageWidth / 2, pageHeight - bottomMarginPageSubtitle, { align: "center" });

				}
				// Volta para cor preta para outros elementos
				pdf.setTextColor(0);


				// ---------- CONFIGURAÇÃO DAS TABELAS (2 colunas compactas) ----------
				const selectedParcelNames = new Set(
					mapPlantation
						.filter(d => parcelasSelected.includes(d.id_farmbox))
						.map(d => d.talhao__id_talhao) // o rótulo que aparece na tabela
				);

				// ---------- CONFIGURAÇÃO DAS TABELAS (2 colunas compactas) ----------
				const tableTop = titleTopMargin + 8;
				const bottomMargin = 18;

				const rowHeight = 8;
				const headerHeight = rowHeight;
				const fontSizeHeader = 8;
				const fontSizeBody = 7;
				const colWidths = [28, 24];
				const tableWidth = colWidths[0] + colWidths[1];
				const tableLeftX = 10;
				const rightMargin = 10;

				const tableHeight = pageHeight - tableTop - bottomMargin;
				const maxRowsPerTable = Math.max(0, Math.floor((tableHeight - headerHeight) / rowHeight));

				// sempre com duas casas decimais
				const fmtArea = (v) =>
					Number(v || 0).toLocaleString("pt-BR", {
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
					});

				const col1 = parcelas.slice(0, maxRowsPerTable);
				const col2 = parcelas.slice(maxRowsPerTable, maxRowsPerTable * 2);

				const rightTableWidthPx = tableWidth;
				const tableRightX = pageWidth - rightTableWidthPx - rightMargin;

				pdf.setDrawColor(0);
				pdf.setLineWidth(0.1);

				const HEADER_GRAY = [150, 150, 150];       // cabeçalho (escuro)
				// const HIGHLIGHT_GRAY = [230, 230, 230];    // destaque (mais claro)
				const HIGHLIGHT_BLUE = [200, 220, 255]; // azul bem clarinho

				// função para desenhar uma tabela
				const drawTable = (startX, data) => {
					if (!data.length) return;

					// CABEÇALHO com fundo cinza escuro
					pdf.setFillColor(...HEADER_GRAY);
					pdf.rect(startX, tableTop, colWidths[0], headerHeight, "FD");
					pdf.rect(startX + colWidths[0], tableTop, colWidths[1], headerHeight, "FD");

					pdf.setFont("helvetica", "bold");
					pdf.setFontSize(fontSizeHeader);
					pdf.setTextColor(255); // branco sobre cinza
					pdf.text("Parcela", startX + 2, tableTop + headerHeight - 2, { align: "left" });
					pdf.text("Área", startX + colWidths[0] + colWidths[1] - 2, tableTop + headerHeight - 2, { align: "right" });

					// CORPO
					pdf.setFont("helvetica", "normal");
					pdf.setFontSize(fontSizeBody);
					pdf.setTextColor(0); // volta ao preto

					data.forEach((row, index) => {
						const y = tableTop + headerHeight + rowHeight * index;

						// >>> NOVO: fundo cinza claro se a parcela estiver selecionada
						if (selectedParcelNames.has(String(row.parcela))) {
							pdf.setFillColor(...HIGHLIGHT_BLUE);
							pdf.rect(startX, y, tableWidth, rowHeight, "F"); // pinta a linha inteira das 2 colunas
						}

						// bordas das células
						pdf.rect(startX, y, colWidths[0], rowHeight);
						pdf.rect(startX + colWidths[0], y, colWidths[1], rowHeight);

						// textos
						pdf.text(String(row.parcela ?? ""), startX + 2, y + rowHeight - 2, { align: "left" });
						pdf.text(fmtArea(row.area), startX + colWidths[0] + colWidths[1] - 2, y + rowHeight - 2, { align: "right" });
					});
				};

				drawTable(tableLeftX, col1);
				drawTable(tableRightX, col2);

				// ---------- MAPA (ajuste de largura útil considerando 2 tabelas) ----------
				const topMargin = tableTop;
				const availableHeight = pageHeight - topMargin - bottomMargin;

				// se a coluna existir, reserva sua largura + 10px de respiro
				const leftTableWidth = col1.length ? tableWidth + 10 : 0;
				const rightTableWidth = col2.length ? tableWidth + 10 : 0;

				// largura central para o mapa
				const availableWidth = pageWidth - leftTableWidth - rightTableWidth - 20;

				// redimensiona a imagem já carregada anteriormente
				const canvas = document.createElement("canvas");
				canvas.width = img.width;
				canvas.height = img.height;
				const ctx = canvas.getContext("2d");
				ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
				const resizedBase64 = canvas.toDataURL("image/png");

				const scaleHeight = availableHeight / canvas.height;
				const scaleWidth = availableWidth / canvas.width;
				const scale = Math.min(scaleHeight, scaleWidth);

				const mapWidth = canvas.width * scale;
				const mapHeight = canvas.height * scale;

				const availableStartX = leftTableWidth + 10;
				const mapX = availableStartX + (availableWidth - mapWidth) / 2;
				const mapY = topMargin;

				pdf.addImage(resizedBase64, "PNG", mapX, mapY, mapWidth, mapHeight);

				pdf.save(`${selectedProject[0]?.replace("Projeto", "Fazenda") || "Mapa"}.pdf`);
				setLoadingMapList(false);
			};
		} catch (err) {
			console.error("Error while generating PDF", err);
			setLoadingMapList(false);
		}
	};








	if (loadingData) {
		return (
			<Box
				sx={{
					width: "90%",
					margin: "0 auto",
					paddingTop: "20px"
				}}
			>
				<LinearProgress color="warning" />
			</Box>
		);
	}
	return (
		<Box
			sx={{
				width: bigMap ? "150%" : "100%"
			}}
		>
			<Box
				display="flex"
				justifyContent="flex-start"
				alignItems="center"
				gap="15px"
				mb={2}
			>
				{projetos.length > 0 ? (
					<SelectFarm
						projetos={projetos}
						handleChange={handleChangeSelect}
						value={selectedProject}
						title={"Projeto"}
						width={200}
						multiple={true}
					/>
				) : (
					<Box
						sx={{
							display: "flex",
							width: "50px",
							marginLeft: "30px"
						}}
					>
						<CircularProgress color="secondary" size={20} />
					</Box>
				)}
				<Collapse in={Array.isArray(selectedProject) && selectedProject.length > 0} timeout={300}>
					<Box
						sx={{ display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}
					>
						<Tooltip title="Mudar Modo Lista Tabela" placement="bottom">
							<Switch
								checked={printPage}
								onChange={handlePrintPage}
								inputProps={{ "aria-label": "controlled" }}
								color="warning"
								size="small"
							/>
						</Tooltip>
						<Tooltip title="Alterar o Tamanho do Mapa" placement="bottom">
							<Switch
								checked={bigMap}
								onChange={handleBigMap}
								inputProps={{ "aria-label": "controlled" }}
								color="success"
								size="small"
							/>
						</Tooltip>
						<Tooltip title="Incluir Áreas Sem Plantio no Relatório Lateral" placement="bottom">
							<Switch
								checked={filtPlantioDone}
								onChange={handleListShowData}
								inputProps={{ "aria-label": "controlled" }}
								color="success"
								size="small"
							/>
						</Tooltip>
						<ToggleButtonGroup
							value={showVarOrArea}
							exclusive
							onChange={handleValueMap}
							aria-label="text alignment"
						>
							<Tooltip title="Áreas / Há" placement="top">
								<ToggleButton value={true} aria-label="left aligned" size="small">
									<SortByAlphaIcon sx={{ fontSize: 16 }} /> {/* Adjust size here */}
								</ToggleButton>
							</Tooltip>
							<Tooltip title="Variedades" placement="top">
								<ToggleButton value={false} aria-label="centered" size="small">
									<Filter1Icon sx={{ fontSize: 12 }} /> {/* Adjust size here */}
								</ToggleButton>
							</Tooltip>
						</ToggleButtonGroup>
						<ToggleButtonGroup
							value={showAsPlanned}
							exclusive
							onChange={handlePlannerData}
							aria-label="text alignment"
						>
							<Tooltip title="Mostar Áreas Planejadas" placement="top">
								<ToggleButton value={true} aria-label="left aligned" size="small">
									<LandscapeIcon sx={{ fontSize: 16 }} />
								</ToggleButton>
							</Tooltip>
							<Tooltip title="Mostar Áreas Plantadas" placement="top">
								<ToggleButton value={false} aria-label="centered" size="small">
									<EventNoteIcon sx={{ fontSize: 16 }} />
								</ToggleButton>
							</Tooltip>
						</ToggleButtonGroup>

						{filterDropCulture.length > 0 && selectedProject.length > 0 && (
							<Box>
								<SelectFarm
									projetos={filterDropCulture}
									handleChange={handleChangeSelectCulture}
									value={selectedCultureFilter}
									title={"Cultura"}
									width={200}
									multiple={true}
								/>
							</Box>
						)}
						{filterDropVariety.length > 0 && selectedProject.length > 0 && (
							<Box>
								<SelectFarm
									projetos={filterDropVariety}
									handleChange={handleChangeSelectVariety}
									value={selectedVarietyFilter}
									title={"Variedade"}
									width={200}
									multiple={true}
								/>
							</Box>
						)}
						{filterDropVariety.length > 0 && selectedProject.length > 0 && (
							<Box>
								<MultiSelectFilter
									data={filteredArray}
									label="Parcelas"
									selectedItems={parcelasSelected}
									onSelectionChange={handleStatusChange}
									height={300}
									width={200}
									selectedProject={selectedProject}
								/>
							</Box>
						)}
						{parcelasSelected.length > 0 &&
							<Tooltip title="Limpar Parcelas">
								<IconButton onClick={handlerClearParcelas}>
									<CloseIcon fontSize="medium" sx={{ color: showResumeMap ? colors.redAccent[100] : colors.greenAccent[100] }} />
								</IconButton>
							</Tooltip>
						}
						<Tooltip title="Mostrar Resuno do Mapa">
							<IconButton onClick={handlerClearData}>
								{showResumeMap ?
									<RemoveRedEyeIcon fontSize="medium" sx={{ color: showResumeMap ? colors.redAccent[100] : colors.greenAccent[100] }} />
									:

									<MapIcon fontSize="medium" sx={{ color: showResumeMap ? colors.redAccent[100] : colors.greenAccent[300] }} />
								}
							</IconButton>
						</Tooltip>
						{
							selectedProject.length > 0 &&
							<Tooltip title="Gerar Kml">
								<IconButton
									onClick={() =>
										handleGenerateKml(false)
									}
									sx={{
										cursor: 'pointer'
									}}
								>
									{
										loadingMapKml ?
											<CircularProgress size={24} color="inherit" />
											:
											<FontAwesomeIcon
												icon={faPlane}
												color={colors.textColor[100]}
												style={{
													cursor: "pointer"
												}}
											/>
									}

								</IconButton>
							</Tooltip>
						}
						{
							selectedProject.length > 0 &&
							<Tooltip title="Gerar Kml">
								<IconButton
									onClick={() =>
										handleGenerateKml(true)
									}
									sx={{
										cursor: 'pointer'
									}}
								>
									{
										loadingMapKmlColor ?
											<CircularProgress size={24} color="inherit" />
											:
											<FontAwesomeIcon
												icon={faPlane}
												color={colors.blueOrigin[300]}
												style={{
													cursor: "pointer"
												}}
											/>
									}

								</IconButton>
							</Tooltip>
						}
						<Tooltip title="Gerar pdf Do Mapa">
							<IconButton onClick={() => handlePrintPdf()}>
								{loadingMap ? (
									<CircularProgress size={24} color="inherit" />
								) : (
									<FontAwesomeIcon
										icon={faFilePdf}
										color={colors.greenAccent[100]}
										style={{ cursor: "pointer" }}
									/>
								)
								}
							</IconButton>
						</Tooltip>
						<Tooltip title="Gerar pdf do Mapa Com Tabela dos Talhões">
							<IconButton onClick={() => handlePrintPdfWithTable()}>
								{loadingMapList ? (
									<CircularProgress size={24} color="inherit" />
								) : (
									<FontAwesomeIcon
										icon={faFilePdf}
										color={colors.greenAccent[100]}
										style={{ cursor: "pointer" }}
									/>
								)
								}
							</IconButton>
						</Tooltip>
						<Tooltip title="Mostar Tela expandida">
							<IconButton onClick={() => setPrintPageList(!printPageList)}>
								{!printPageList ?
									<FontAwesomeIcon
										icon={faPrint}
										color={colors.greenAccent[100]}
										style={{
											cursor: "pointer"
										}}
									/>
									:

									<FontAwesomeIcon
										icon={faPrint}
										color={colors.greenAccent[300]}
										style={{
											cursor: "pointer"
										}}
									/>
								}
							</IconButton>
						</Tooltip>
					</Box>
				</Collapse>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: colors.blueOrigin[600],
					padding: "0px 5px 5px 5px",
					borderRadius: "8px",
					height: filteredArray.length === 0 && '80vh'
				}}
			>
				{filteredArray.length === 0 ? (
					<Typography
						variant="h3"
						color={colors.primary[100]}
						sx={{
							textAlign: "center",
							padding: "5px",
							fontWeight: "bold",
							marginBottom: "10px",
							width: "100%",
							height: "100%",
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
						className={styles.titleProdutividade}
					>
						Selecione uma Fazenda!!
					</Typography>
				) : (
					<>
						<HeaderPage
							selectedProject={selectedProject}
							filtCult={filtCult}
							resumo={resumoByVar}
							sumTotalSelected={sumTotalSelected}
							showTableList={showTableList}
							setShowTableList={setShowTableList}
							operationName={operationName}
							setOperationName={setOperationName}
						/>
						<Box
							className={styles.mapListDiv}
							id="printableMapPage"
							sx={{
								// --- ESTILOS DO CONTAINER PAI ---
								display: 'flex',          // 1. Ativa o Flexbox
								width: '100%',            // 2. FORÇA o container a ter 100% da largura do seu elemento pai (MUITO IMPORTANTE)
								overflow: 'hidden',       // 3. Impede que qualquer filho transborde para fora
								maxHeight: !printPageList ? "90vh" : '',
								minHeight: !printPageList ? '90vh' : ''
							}}
						>
							<Box
								width={"100%"}
								display="flex"
								// justifyContent="center"
								// minHeight={bigMap ? "1500px" : "980px"} // <--- REMOVIDO
								flexGrow={1} // <--- ADICIONADO: Diz ao Box para crescer e ocupar o espaço
								alignItems={"stretch"}
								sx={{
									flex: '1 1 0', // 4. Forma abreviada e mais robusta para flex-grow, flex-shrink, e flex-basis.
									minWidth: 0,      // Garante que o mapa possa encolher.
									display: 'flex',
									boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 15px",
									borderRadius: "8px",
								}}
							>
								<MapPage
									printPage={printPage}
									mapArray={filteredPlantioMal}
									filtData={mapPlantation}
									handleSUm={handleSUm}
									totalSelected={totalSelected}
									setTotalSelected={setTotalSelected}
									showVarOrArea={showVarOrArea}
									showAsPlanned={showAsPlanned}
									setShowAsPlanned={setShowAsPlanned}
									showResumeMap={showResumeMap}
									parcelasSelected={parcelasSelected}
									toggleParcela={toggleParcela}
									useRealArray={useRealArray}
								/>
							</Box>
							<Collapse orientation="horizontal" in={showTableList}>

								{printPage ? (
									<Box sx={{
										// 5. Tente usar uma largura fixa em pixels primeiro para confirmar que o problema é o %
										width: printPage ? "250px" : "350px", // Mudei "30%" para "350px" para teste
										flexShrink: 0, // Impede que a lista encolha
										ml: printPage ? 3 : 1,
										overflow: !printPageList ? 'auto' : ''
									}}>

										<ListPrintPage
											resumo={resumoByVar}
											sumTotalSelected={sumTotalSelected}
											printPage={printPage}
											filteredArray={filteredArray}
											projeto={selectedProject}
											setSumTotalSelected={
												setSumTotalSelected
											}
											handleSUm={handleSUm}
											totalSelected={totalSelected}
											setTotalSelected={setTotalSelected}
											filtPlantioDone={filtPlantioDone}
											parcelasSelected={parcelasSelected}
											setParcelasSeleced={setParcelasSeleced}
											setUseRealArray={setUseRealArray}
											useRealArray={useRealArray}

										/>
									</Box>
								) : (
									<Box width={"30%"} ml={1}>
										<ListPage
											printPage={printPage}
											filteredArray={filteredArray}
											projeto={selectedProject}
											setSumTotalSelected={
												setSumTotalSelected
											}
											handleSUm={handleSUm}
											totalSelected={totalSelected}
											setTotalSelected={setTotalSelected}
										/>
									</Box>
								)}
							</Collapse>
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default ProdutividadePage;
