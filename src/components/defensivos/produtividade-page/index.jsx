import { Box, Typography } from "@mui/material";
import djangoApi from "../../../utils/axios/axios.utils";
import { useEffect, useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";

import SelectFarm from "./select-farm";
import MapPage from "./map-page";
import ListPage from "./list-page";

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

const ProdutividadePage = () => {
	const [params, setParams] = useState({
		safra: "2023/2024",
		ciclo: "1"
	});
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
	const [selectedProject, setSelectedProject] = useState();
	const [filteredArray, setFilteredArray] = useState([]);

	const [filtCult, setFiltCult] = useState([]);

	useEffect(() => {
		console.log(selectedProject);
		const filteredArray = produtividade.filter(
			(data) =>
				data.talhao__fazenda__nome === selectedProject &&
				data.finalizado_plantio === true
		);
		console.log(filteredArray);
		setMapPlantation(filteredArray);
		const filtCult = filteredArray
			.filter((data) => data.variedade__cultura__cultura !== "Milheto")
			.map((data) => {
				return data.variedade__cultura__cultura;
			});
		console.log(
			setFiltCult(
				[...new Set(filtCult)].sort((b, a) => a.localeCompare(b))
			)
		);
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
				marginLeft: "10px",
				marginRight: "10px",
				width: "100%"
			}}
		>
			<Box>
				<SelectFarm
					projetos={projetos}
					handleChange={handleChangeSelect}
					value={selectedProject}
				/>
			</Box>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					justifyContent: "center",
					alignItems: "center",
					backgroundColor: colors.blueOrigin[700],
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
						/>
						<div className={styles.mapListDiv}>
							<Box
								width={"67%"}
								display="flex"
								justifyContent="center"
								alignItems="center"
								height="650px"
								sx={{
									boxShadow:
										"rgba(0, 0, 0, 0.65) 0px 5px 15px",
									borderRadius: "8px"
								}}
							>
								<MapPage
									mapArray={filteredPlantioMal}
									filtData={mapPlantation}
								/>
							</Box>
							<Box width={"30%"}>
								<ListPage
									filteredArray={filteredArray}
									projeto={selectedProject}
								/>
							</Box>
						</div>
					</>
				)}
			</Box>
		</Box>
	);
};

export default ProdutividadePage;
