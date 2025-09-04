import { Box, Typography, useTheme, Slide } from "@mui/material";
import { tokens } from "../../theme";
import styles from "./PlantioColheita.module.css";

import { useEffect, useState } from "react";

import { onSnapshot, collection, query, where, limit, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../store/plantio/plantio.selector";

import PermanentDrawerLeft from "./drawer";

import djangoApi from "../../utils/axios/axios.utils";

import CircularProgress from "@mui/material/CircularProgress";
import PlantioColheitaPortal from "../../components/plantio-colheita-portal";

import { useDispatch } from "react-redux";
import { setRomaneiosLoads } from "../../store/trucks/trucks.actions";
import { selectRomaneiosLoads } from "../../store/trucks/trucks.selector";

import toast from "react-hot-toast";

import { MenuItem, Select, FormControl, InputLabel } from "@mui/material";



const PlantioColheitaPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dispatch = useDispatch();

	const [isLoading, setIsLoading] = useState(false);
	const [dataArray, setDataArray] = useState([]);
	const [cargasArray, setCargasArray] = useState([]);
	const [combinedData, setCombinedData] = useState([]);
	const [filteredFarm, setFilteredFarm] = useState([]);
	const [selectedFarm, setSelectedFarm] = useState(null);
	const [selectedFilteredData, setSelectedFilteredData] = useState([]);

	const [selectedRoute, setSelectedRoute] = useState("rota 3");

	const useData = useSelector(selectRomaneiosLoads)
	const [idsRomaneioPending, setIdsRomaneioPending] = useState({});
	const [resumeFarmRomaneios, setResumeFarmRomaneios] = useState({});
	const [openDrawer, setOpenDrawer] = useState(true);

	const visible = useSelector((state) => state.ui.headerVisible);
	const params = useSelector(selectSafraCiclo);

	const handleNagivationIcon = (route) => {
		setSelectedRoute(route);
	};


	useEffect(() => {
		const getTrueApi = async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.post("plantio/get_colheita_plantio_info/", params, {
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

	const handlerRefresh = () => {
		handlerUpdateRomaneios()
		const getTrueApi = async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.post("plantio/get_colheita_plantio_info/", params, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						console.log('response here ', res.data);
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
	};

	useEffect(() => {
		if (params) {
			handlerRefresh()
		}
	}, [params]);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.truckmove);
		const q = query(collRef, where("syncDate", "!=", null), where('uploadedToProtheus', '==', false),
			// const q = query(collRef, where("syncDate", "!=", null),
			orderBy("syncDate", "desc"), limit(100));
		onSnapshot(q, (snapshot) => {
			// snapshot.docChanges().forEach((change) => {
			// 	if (change.type === "added") {
			// 		toast.success(`Romaneio Adiconado - ${change.doc.data().relatorioColheita}  - ${change.doc.data().fazendaOrigem}`, {
			// 			position: "top-center"
			// 		});
			// 	}
			// 	if (change.type === "modified") {
			// 		toast.success(`Romaneio Alterado - ${change.doc.data().relatorioColheita}  - ${change.doc.data().fazendaOrigem}`, {
			// 			position: "top-center"
			// 		});
			// 	}
			// })
			const formArr = snapshot.docs.map((doc) => {
				const upToPro = doc.data().uploadedToProtheus ? doc.data().uploadedToProtheus : false
				return ({
					...doc.data(),
					id: doc.id,
					uploadedToProtheus: upToPro
				})
			})
			dispatch(setRomaneiosLoads(formArr))
		});
	}, [dispatch]);

	const handlerUpdateRomaneios = () => {
		const resumeId = {}
		const resumeFarm = {}
		useData.filter((data) => data.uploadedToProtheus === false).forEach(data => {
			resumeFarm[data.fazendaOrigem] = resumeFarm[data.fazendaOrigem] ? resumeFarm[data.fazendaOrigem] + 1 : 1
			data?.parcelasObjFiltered?.forEach((parcela) => {
				resumeId[parcela.id_plantio] = resumeId[parcela.id_plantio] ? resumeId[parcela.id_plantio] + 1 : 1
			})
		});
		setIdsRomaneioPending(resumeId)
		setResumeFarmRomaneios(resumeFarm)
	}
	useEffect(() => {
		handlerUpdateRomaneios()
	}, []);


	useEffect(() => {
		handlerUpdateRomaneios()
	}, [useData]);



	return (
		<>
			<Box
				width={"100%"}
				position={"relative"}
				sx={{
					display: "flex",
					borderRadius: "12px"
				}}
			>
				<Box>
					<PermanentDrawerLeft
						openDrawer={openDrawer}
						handleNagivationIcon={handleNagivationIcon}
						selectedRoute={selectedRoute}
						handlerRefresh={handlerRefresh}
					/>
				</Box>
				<Box
					className={styles["main-container"]}
					// position={"relative"}
					sx={{
						backgroundColor: colors.blueOrigin[800],
						borderRadius: "0px 12px 12px 0px"
					}}
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
					{!isLoading && (
						<PlantioColheitaPortal
							setOpenDrawer={setOpenDrawer}
							openDrawer={openDrawer}
							selectedRoute={selectedRoute}
							filteredFarm={filteredFarm}
							selectedFarm={selectedFarm}
							handlerFilter={handlerFilter}
							selectedFilteredData={selectedFilteredData}
							idsPending={idsRomaneioPending}
							resumeFarmRomaneios={resumeFarmRomaneios}
							params={params}
						/>
					)}
				</Box>
			</Box>
		</>
	);
};

export default PlantioColheitaPage;
