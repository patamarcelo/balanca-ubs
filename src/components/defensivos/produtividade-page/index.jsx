import { Box, Typography } from "@mui/material";
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
import { IconButton, Tooltip } from "@mui/material";



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

	useEffect(() => {
		const filteredArray = produtividade.filter(
			(data) =>
				selectedProject.includes(data.talhao__fazenda__nome) &&
				data.finalizado_plantio === true
		);
		setMapPlantation(filteredArray);

		const totalResumo = {};
		const totalResumoVariedades = {};
		const filtCult = filteredArray
			.filter((data) => data.variedade__cultura__cultura !== "Milheto")
			.map((data) => {
				const areaSum = data.finalizado_colheita
					? data.area_colheita
					: data.area_parcial;
				const getArea = areaSum ? areaSum : 0;
				const pesoSum = data?.peso_kg ? data?.peso_kg : 0;
				const dataSum = {
					area: getArea,
					peso: pesoSum
				};
				const areaSumByVar = {
					area: data.area_colheita
				};
				const nameOfArea =
					data.variedade__cultura__cultura +
					"|" +
					data.variedade__nome_fantasia;
				if (totalResumo[data.variedade__cultura__cultura]) {
					totalResumo[data.variedade__cultura__cultura].peso +=
						pesoSum;
					totalResumo[data.variedade__cultura__cultura].area +=
						getArea;
				} else {
					totalResumo[data.variedade__cultura__cultura] = dataSum;
				}

				if (totalResumoVariedades[nameOfArea]) {
					totalResumoVariedades[nameOfArea].area +=
						data.area_colheita;
				} else {
					totalResumoVariedades[nameOfArea] = areaSumByVar;
				}

				return totalResumo;
			});

		setResumoByVar(totalResumoVariedades);
		setFiltCult(totalResumo);
		// const totalFiltered = filteredPlantioMal.reduce((cur, sum) => {
		// 	const keyDic = cur.dados
		// 	if(sum[cur.])
		// 	return sum;
		// }, {});
		// console.log(totalFiltered);
	}, [selectedProject, produtividade]);

	useEffect(() => {
		const filterCult = plantioMapALl.filter((data) => selectedProject.includes(data.fazenda)).map((data) => data.dados.cultura)
		const uniqueFilterCult = [...new Set(filterCult)].filter((data) => data !== null)
		setFilterDropCulture(uniqueFilterCult)

		const filterVariety = plantioMapALl.filter((data) => selectedProject.includes(data.fazenda)).map((data) => data.dados.variedade)
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
		const filterArray = produtividade.filter(
			(data) => selectedProject.includes(data.talhao__fazenda__nome)
		);
		setFilteredArray(filterArray);
	}, [selectedProject, produtividade]);
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
				<Tooltip title="Mudar Modo Lista Tabela" placement="bottom">
					<Switch
						checked={printPage}
						onChange={handlePrintPage}
						inputProps={{ "aria-label": "controlled" }}
						color="warning"
					/>
				</Tooltip>
				<Tooltip title="Alterar o Tamanho do Mapa" placement="bottom">
					<Switch
						checked={bigMap}
						onChange={handleBigMap}
						inputProps={{ "aria-label": "controlled" }}
						color="success"
					/>
				</Tooltip>
				<Tooltip title="Incluir Áreas Sem Plantio no Relatório Lateral" placement="bottom">
					<Switch
						checked={filtPlantioDone}
						onChange={handleListShowData}
						inputProps={{ "aria-label": "controlled" }}
						color="success"
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
				<Tooltip title="Mostar Resuno do Mapa">
					<IconButton onClick={() => setShowResumeMap(!showResumeMap)}>
						{showResumeMap ?
							<CloseIcon fontSize="medium" sx={{ color: showResumeMap ? colors.redAccent[100] : colors.greenAccent[100] }} />
							:

							<MapIcon fontSize="medium" sx={{ color: showResumeMap ? colors.redAccent[100] : colors.greenAccent[300] }} />
						}
					</IconButton>
				</Tooltip>
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
					height: filteredArray.length === 0 && '500px'
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
						/>
						<div
							className={styles.mapListDiv}
							id="printableMapPage"
						>
							<Box
								width={"100%"}
								display="flex"
								// justifyContent="center"
								minHeight={bigMap ? "1500px" : "980px"}
								alignItems={"stretch"}
								sx={{
									boxShadow:
										"rgba(0, 0, 0, 0.65) 0px 5px 15px",
									borderRadius: "8px"
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
								/>
							</Box>
							{printPage ? (
								<Box width={"20%"} ml={1}>
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
						</div>
					</>
				)}
			</Box>
		</Box>
	);
};

export default ProdutividadePage;
