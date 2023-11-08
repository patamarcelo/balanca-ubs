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

const ProdutividadePage = () => {
	const [params, setParams] = useState({
		safra: "2023/2024",
		ciclo: "1"
	});

	const [printPage, setPrintPage] = useState(true);

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
	const [selectedProject, setSelectedProject] = useState("");
	const [filteredArray, setFilteredArray] = useState([]);

	const [resumoByVar, setResumoByVar] = useState();

	const [filtCult, setFiltCult] = useState([]);

	const [sumTotalSelected, setSumTotalSelected] = useState(0);

	const [totalSelected, setTotalSelected] = useState([]);

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
		console.log(e.target.checked);
		setPrintPage(e.target.checked);
	};

	useEffect(() => {
		const filteredArray = produtividade.filter(
			(data) =>
				data.talhao__fazenda__nome === selectedProject &&
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
		const filterArr = plantioMapALl.filter(
			(data) => data.fazenda === selectedProject
		);
		setFilteredPlantioMal(filterArr);
	}, [selectedProject, plantioMapALl]);

	const handleChangeSelect = (event) => {
		setSelectedProject(event.target.value);
	};
	useEffect(() => {
		const filterArray = produtividade.filter(
			(data) => data.talhao__fazenda__nome === selectedProject
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
						dispatch(setPlantioMapAll(res.data.dados_plantio));
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
				width: "100%"
			}}
		>
			<Box
				display="flex"
				justifyContent="flex-start"
				alignItems="center"
				gap="15px"
			>
				{projetos.length > 0 ? (
					<SelectFarm
						projetos={projetos}
						handleChange={handleChangeSelect}
						value={selectedProject}
						title={"Projeto"}
						width={200}
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
				<Switch
					checked={printPage}
					onChange={handlePrintPage}
					inputProps={{ "aria-label": "controlled" }}
					color="warning"
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: colors.blueOrigin[600],
					padding: "20px",
					borderRadius: "8px"
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
							height: "100%"
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
								justifyContent="center"
								alignItems="center"
								height={"1300px"}
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
								/>
							</Box>
							{printPage ? (
								<Box width={"20%"} ml={2}>
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
									/>
								</Box>
							) : (
								<Box width={"30%"} ml={2}>
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
