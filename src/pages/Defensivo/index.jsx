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

const DefensivoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isLoadingHome, setIsLoading] = useState(true);

	const [dataDef, setDataDef] = useState([]);

	const [dataDefFalse, setDataDefFalse] = useState([]);
	const [dataDefTrue, setDataDefTrue] = useState([]);

	const getTrueApi = async () => {
		try {
			await djangoApi
				.get("plantio/get_plantio_operacoes_detail/", {
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
		try {
			await djangoApi
				.get("plantio/get_plantio_operacoes_detail_json_program/", {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					}
				})
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

	useEffect(() => {
		(async () => {
			try {
				await getTrueApi();
				await getFalseApi();
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	const handleRefreshData = async () => {
		setIsLoading(true);
		try {
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
	}, [dataDefFalse, dataDefTrue]);

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
					marginBottom: "-30px"
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
							margin: "0px 10px",
							cursor: "pointer",
							position: 'relative'
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
					marginBottom: "10px"
				}}
			>
				{!isLoadingHome && (
					<HomeDefensivoPage
						dataDef={dataDef}
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
						</Stack>
						<LoaderHomeSkeleton />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default DefensivoPage;
