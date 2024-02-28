import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import styles from "./PlantioColheita.module.css";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../store/plantio/plantio.selector";

import PermanentDrawerLeft from "./drawer";

import djangoApi from "../../utils/axios/axios.utils";

import CircularProgress from "@mui/material/CircularProgress";
import ListaRender from "../../components/plantio-colheita-portal/plantio-colheita";
import TableColheita from "../../components/plantio-colheita-portal/plantio-colheita/table";
import HeaderFarm from "../../components/plantio-colheita-portal/plantio-colheita/header-farm";
import ColheitaAtual from "../../components/plantio-colheita-portal/plantio-colheita";

import PlantioColheitaPortal from "../../components/plantio-colheita-portal";

const PlantioColheitaPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const safraCiclo = useSelector(selectSafraCiclo);

	const [isLoading, setIsLoading] = useState(false);
	const [dataArray, setDataArray] = useState([]);
	const [cargasArray, setCargasArray] = useState([]);
	const [combinedData, setCombinedData] = useState([]);
	const [filteredFarm, setFilteredFarm] = useState([]);
	const [selectedFarm, setSelectedFarm] = useState(null);
	const [selectedFilteredData, setSelectedFilteredData] = useState([]);

	const [selectedRoute, setSelectedRoute] = useState("rota 1");

	const handleNagivationIcon = (route) => {
		setSelectedRoute(route);
	};

	const [params, setParams] = useState({
		safra: safraCiclo.safra,
		ciclo: safraCiclo.ciclo
	});

	useEffect(() => {
		setParams({
			safra: safraCiclo.safra,
			ciclo: safraCiclo.ciclo
		});
	}, [safraCiclo]);

	useEffect(() => {
		const getTrueApi = async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.post("plantio/get_colheita_plantio_info/", safraCiclo, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						console.log(res.data);
						setDataArray(res.data.data);
						setCargasArray(res.data.cargas);
					})
					.catch((err) => {
						console.log(err);
						setIsLoading(false);
					});
			} catch (err) {
				console.log("Erro ao consumir a API", err);
				setIsLoading(false);
			} finally {
				setIsLoading(false);
				// console.log("Finally statement");
			}
		};
		getTrueApi();
	}, []);

	useEffect(() => {
		const newArr = dataArray.map((data) => {
			const getInfos = cargasArray.filter(
				(cargas) => cargas.plantio__id === data.id
			);
			let peso = 0;
			let romaneio = 0;
			if (getInfos.length > 0) {
				peso = getInfos[0].total_peso_liquido;
				romaneio = getInfos[0].total_romaneio;
			}
			const dap = parseInt(
				(new Date() - new Date(data.data_plantio)) /
					(1000 * 60 * 60 * 24) +
					1,
				10
			);
			return { ...data, peso: peso, romaneios: romaneio, dap };
		});
		setCombinedData(newArr);
	}, [cargasArray, dataArray]);

	useEffect(() => {
		const filteredFarm = dataArray.map(
			(farm) => farm.talhao__fazenda__nome
		);
		console.log(filteredFarm);
		const filteredSet = [...new Set(filteredFarm)];
		setFilteredFarm(filteredSet);
		setSelectedFarm(filteredSet[0]);
	}, [dataArray]);

	useEffect(() => {
		if (selectedFarm) {
			const newArra = combinedData.filter(
				(data) => data.talhao__fazenda__nome === selectedFarm
			);
			setSelectedFilteredData(newArra);
		} else {
			setSelectedFilteredData(combinedData);
		}
	}, [selectedFarm, combinedData]);

	const handlerFilter = (farm) => {
		console.log(farm);
		setSelectedFarm(farm);
	};

	// if (!isLoading && dataArray.length > 0) {
	return (
		<Box
			width={"100%"}
			position={"relative"}
			sx={{
				display: "flex"
			}}
		>
			<Box>
				<PermanentDrawerLeft
					handleNagivationIcon={handleNagivationIcon}
					selectedRoute={selectedRoute}
				/>
			</Box>
			<Box
				className={styles["main-container"]}
				// position={"relative"}
				sx={{ backgroundColor: colors.blueOrigin[800] }}
			>
				{isLoading && (
					<Box
						sx={{
							width: "100%",
							height: "100%",
							display: "flex",
							justifyContent: "center",
							alignItems: "center"
						}}
					>
						<CircularProgress
							sx={{ color: colors.blueAccent[100] }}
						/>
					</Box>
				)}
				{!isLoading && dataArray.length > 0 && (
					<PlantioColheitaPortal
						selectedRoute={selectedRoute}
						filteredFarm={filteredFarm}
						selectedFarm={selectedFarm}
						handlerFilter={handlerFilter}
						selectedFilteredData={selectedFilteredData}
					/>
				)}
			</Box>
		</Box>
	);
};

export default PlantioColheitaPage;
