import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { useEffect, useState } from "react";

import HomeDefensivoPage from "../../components/defensivos/home";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import djangoApi from "../../utils/axios/axios.utils";

import LoaderHomeSkeleton from "../../components/defensivos/home/loader";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";

import CircularProgress from "@mui/material/CircularProgress";

import { useDispatch, useSelector } from "react-redux";
import { setPlantio, setSafraCilco } from "../../store/plantio/plantio.actions";

import { selectSafraCiclo } from "../../store/plantio/plantio.selector";
// import { useLocation } from "react-router-dom";
import { selectUseMulti } from "../../store/plantio/plantio.selector";


const DefensivoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dispatch = useDispatch();
	const safraCiclo = useSelector(selectSafraCiclo);
	// const location = useLocation();               // ← pathname atual
	const useMulti= useSelector(selectUseMulti)


	const [isLoadingHome, setIsLoading] = useState(true);

	const [dataDef, setDataDef] = useState([]);

	const [dataDefFalse, setDataDefFalse] = useState([]);
	const [dataDefTrue, setDataDefTrue] = useState([]);

	const [params, setParams] = useState({
		safra: safraCiclo.safra,
		ciclo: safraCiclo.ciclo,
	});

	useEffect(() => {
		handleRefreshData();
	}, [safraCiclo]);

	useEffect(() => {
		setParams({
			safra: safraCiclo.safra,
			ciclo: safraCiclo.ciclo,
		});
	}, [safraCiclo]);

	const getTrueApi = async () => {
		const newPayload = {
				...safraCiclo,
				use_multi: useMulti
			}
		try {
			await djangoApi
				.post("plantio/get_plantio_operacoes_detail/", newPayload, {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					}
				})
				.then((res) => {
					// console.log(res.data);
					setDataDefFalse(res.data.dados);
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("Erro ao consumir a API", err);
		} finally {
			// console.log("Finally statement");
		}
	};

	const getFalseApi = async () => {
		const newPayload = {
				...safraCiclo,
				use_multi: useMulti,
				device: 'WEB'
			}
		try {
			await djangoApi
				.post(
					"plantio/get_plantio_operacoes_detail_json_program/",
					newPayload,
					{
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					}
				)
				.then((res) => {
					// console.log(res.data);
					setDataDefTrue(res.data.dados_plantio);
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("Erro ao consumir a API", err);
		} finally {
			// console.log("Finally statement");
		}
	};

	// useEffect(() => {
	// 	if (safraCiclo.safra.length > 0 && safraCiclo.ciclo.length > 0) {
	// 		(async () => {
	// 			if (dataDef.length === 0) {
	// 				try {
	// 					const allPromise = Promise.all([
	// 						getTrueApi(),
	// 						getFalseApi()
	// 					]);
	// 					let time1 = performance.now();
	// 					console.log("gerando dados");
	// 					await allPromise
	// 						.then((data) => {
	// 							console.log(data);
	// 						})
	// 						.catch((err) => console.log("promise Error", err));

	// 					// await getTrueApi();
	// 					// await getFalseApi();
	// 					let time2 = performance.now();
	// 					console.log(time2 - time1);
	// 				} catch (err) {
	// 					console.log("Erro ao consumir a API", err);
	// 				} finally {
	// 					setIsLoading(false);
	// 				}
	// 			}
	// 		})();
	// 	}
	// }, []);

	const handleRefreshData = async () => {
		setIsLoading(true);
		try {
			console.log("refresh data");
			await getTrueApi();
			await getFalseApi();
		} catch (err) {
			console.log("Erro ao consumir a API", err);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		const newArr = [...dataDefTrue, ...dataDefFalse];
		setDataDef(newArr);
		dispatch(setPlantio(newArr));
	}, [dataDefFalse, dataDefTrue, dispatch]);

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%"
			}}
		>
			<Box
				sx={{
					textAlign: "right",
					// marginBottom: "-30px"
				}}
			>
				{isLoadingHome ? (
					<CircularProgress
						size={20}
						sx={{
							margin: "-10px 10px",
							color: (theme) =>
								colors.greenAccent[
								theme.palette.mode === "dark" ? 200 : 800
								]
						}}
					/>
				) : (
					<FontAwesomeIcon
						icon={faArrowsRotate}
						color={colors.greenAccent[500]}
						size="lg"
						style={{
							// margin: "0px 10px",
							cursor: "pointer",
							position: "absolute",  // remove do fluxo do layout
							right: 15,
							// overflow: "hidden",
						}}
						onClick={() => handleRefreshData()}
					/>
				)}
			</Box>
			<Box
				sx={{
					width: "100%",
					height: "100%",
					// border: "1px solid whitesmoke",
					borderRadius: "8px",
					marginBottom: "10px",
					paddingBottom: '20px'
				}}
			>
				{!isLoadingHome && (
					<HomeDefensivoPage
						handleRefreshData={handleRefreshData}
						isLoadingHome={isLoadingHome}
					/>
				)}
				{isLoadingHome && (
					<Box width="100%" height="100%">
						<Stack direction="row" spacing={2}>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={120}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={90}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={90}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={90}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={90}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={90}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={70}
								height={38}
							/>
							<Skeleton
								animation="wave"
								variant="rounded"
								width={70}
								height={38}
							/>
						</Stack>
						<LoaderHomeSkeleton />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default DefensivoPage;
