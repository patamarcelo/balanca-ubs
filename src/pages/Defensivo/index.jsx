import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { useEffect, useState } from "react";

import HomeDefensivoPage from "../../components/defensivos/home";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { useDispatch } from "react-redux";
import { formatDate } from "../../utils/format-suport/data-format";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import djangoApi from "../../utils/axios/axios.utils";

import LoaderHomeSkeleton from "../../components/defensivos/home/loader";

const DefensivoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);
	const [ordems, setOrdems] = useState([]);

	const [dataDef, setDataDef] = useState([]);

	const [dataDefFalse, setDataDefFalse] = useState([]);
	const [dataDefTrue, setDataDefTrue] = useState([]);
	const [resumeData, setResumeDate] = useState([]);

	useEffect(() => {
		(async () => {
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
						setResumeDate(res.data.app_date);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				// console.log("Finally statement");
				setIsLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
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
				setIsLoading(false);
			}
		})();
	}, []);

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
						resumeData={resumeData}
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
						</Stack>
						<LoaderHomeSkeleton />
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default DefensivoPage;
