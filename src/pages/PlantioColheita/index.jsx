import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import styles from "./PlantioColheita.module.css";

import { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../store/plantio/plantio.selector";

import djangoApi from "../../utils/axios/axios.utils";

import CircularProgress from "@mui/material/CircularProgress";
import ListaRender from "../../components/plantio-colheita";

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

	if (isLoading) {
		return (
			<Box
				sx={{
					width: "100%",
					height: "100%",
					display: "flex",
					justifyContent: "center",
					alignItems: "center"
				}}
			>
				<CircularProgress sx={{ color: colors.primary[100] }} />
			</Box>
		);
	}
	if (!isLoading && dataArray.length > 0) {
		return (
			<Box
				className={styles["main-container"]}
				sx={{ backgroundColor: colors.blueOrigin[800] }}
			>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "flex-start",
						gap: "20px",
						alignItems: "flex-start",
						width: "70%",
						height: "100%"
					}}
				>
					{filteredFarm.map((farm, i) => {
						return (
							<Box
								key={i}
								sx={{ cursor: "pointer" }}
								onClick={() => handlerFilter(farm)}
							>
								<p>{farm.replace("Projeto", "")}</p>
							</Box>
						);
					})}
				</Box>
				<Box
					sx={{
						justifySelf: "flex-start",
						width: "70%",
						marginBottom: "10px"
					}}
				>
					<Typography variant="h4" color={colors.textColor[100]}>
						{selectedFarm}
					</Typography>
				</Box>
				{selectedFilteredData
					.sort((b, a) => a.dap - b.dap)
					.map((data, i) => {
						return <ListaRender data={data} key={i} />;
					})}
			</Box>
		);
	}
};

export default PlantioColheitaPage;
