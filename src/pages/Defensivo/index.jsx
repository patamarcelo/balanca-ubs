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

const DefensivoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);
	const [ordems, setOrdems] = useState([]);

	const [dataDef, setDataDef] = useState([]);
	const [resumeData, setResumeDate] = useState([]);

	useEffect(() => {
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [dispatch]);

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
						setDataDef(res.data.dados);
						setResumeDate(res.data.app_date);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				console.log("Finally statement");
				setIsLoading(false);
			}
		})();
	}, []);

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
						</Stack>
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
							width="100%"
							height="100%"
							mt={1}
							sx={{
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "8px",
								boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
							}}
						>
							<Box
								sx={{
									width: "100%",
									height: "100%",
									padding: "20px"
								}}
							>
								<Typography variant="h1">
									<Skeleton
										variant="rectangular"
										animation="wave"
									/>
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
									<Skeleton animation="wave" />
								</Typography>
							</Box>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default DefensivoPage;
