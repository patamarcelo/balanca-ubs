import { Typography, Box, useTheme, Button } from "@mui/material";
import { tokens } from "../../theme";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

import djangoApi from "../../utils/axios/axios.utils";
import ImageLoaderRegistros from "../../components/visitas/img-loaderr-registros";
import SkeletonCard from "../Visitas/skeleton-card";

import { displayDate } from "../../utils/format-suport/data-format";

const VisitaIDPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const params = useParams();
	const navigate = useNavigate();
	const { state } = useLocation();
	const { visitaId } = params;
	console.log(state);
	const [isLoading, setisLoading] = useState(true);
	const [visitasArr, setVisitasArr] = useState([]);
	const [formatDataArr, setformatDataArr] = useState([]);

	useEffect(() => {
		console.log(visitasArr);
	}, [visitasArr]);

	const getData = useCallback(async () => {
		const body = {
			idfilter: visitaId
		};
		try {
			await djangoApi
				.post("registrosvisita/get_registro_visita/", body, {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					}
				})
				.then((res) => {
					console.log(res.data);
					// setVisitasArr(res.data);
				})
				.catch((err) => console.log(err));
		} catch (err) {
			console.log("erro ao consumir a API", err);
		} finally {
			// setisLoading(false);
		}
	}, [visitaId]);

	useEffect(() => {
		getData();
	}, [getData]);

	useEffect(() => {
		const body = {
			idfilter: visitaId
		};
		const getData = async () => {
			try {
				await djangoApi
					.post("registrosvisita/get_registro_visita_url/", body, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						console.log(res.data);
						setVisitasArr(res.data.data);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("erro ao consumir a API", err);
			} finally {
				setisLoading(false);
			}
		};
		getData();
	}, []);

	return (
		<Box
			width={"100%"}
			textAlign={"center"}
			backgroundColor="rgb(245,245,245)"
			sx={{
				display: "flex",
				alignItems: "center",
				flexDirection: "column",
				height: "100vh"
			}}
		>
			<Button
				title="Voltar"
				color="warning"
				onClick={() => navigate(-1)}
				variant="contained"
				sx={{
					alignSelf: "self-start",
					margin: "5px"
				}}
			>
				Voltar
			</Button>

			<Box
				width={"70%"}
				sx={{
					display: "flex",
					flexDirection: "column",
					gap: "10px"
				}}
			>
				<Box display="flex" justifyContent="space-between">
					<Typography
						color={"blue"}
						sx={{ fontWeight: "bold" }}
						variant="h4"
						alignSelf={"flex-start"}
					>
						{state.data.fazenda_title}{" "}
					</Typography>
					<Typography
						color={"black"}
						sx={{ fontWeight: "bold" }}
						variant="h6"
						alignSelf={"flex-end"}
					>
						{displayDate(state.data.data)}{" "}
					</Typography>
				</Box>
				{isLoading && (
					<Box width={"100%"}>
						<SkeletonCard row="reverse" />
						<SkeletonCard row="reverse" />
						<SkeletonCard row="reverse" />
					</Box>
				)}
				{visitasArr &&
					visitasArr.map((data, i) => {
						return (
							<Box
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
									alignItems: "center",
									justifyContent: "space-between",
									border: "1px solid black",
									borderRadius: "12px",
									padding: "8px",
									backgroundColor: "white",
									boxShadow:
										"rgba(0, 0, 0, 0.35) 0px 5px 15px"
								}}
							>
								<ImageLoaderRegistros data={data} />
								<Typography variant="h6" color={"black"}>
									{data.obs}
								</Typography>
							</Box>
						);
					})}

				{visitasArr && (
					<>
						<Box
							sx={{
								backgroundColor: "white",
								borderRadius: "12px",
								border: "1px solid black",
								textAlign: "left",
								minHeight: "100px"
							}}
							mb={5}
						>
							<Typography
								color={"black"}
								sx={{
									padding: "10px",
									fontWeight: "bold"
								}}
							>
								Observações gerais:
							</Typography>
							<Typography
								color={"black"}
								sx={{
									padding: "10px"
								}}
							>
								{state.data.observacoes_gerais}
							</Typography>
						</Box>
						<Box
							sx={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
								padding: "10px 0px",
								marginBottom: "100px"
							}}
						>
							<Box sx={{ width: "250px" }}>
								<div
									style={{
										width: "100%",
										backgroundColor: "grey",
										height: "1px"
									}}
								/>
								<Typography variant="h5" color={"black"}>
									{state.data.resp_visita}
								</Typography>
							</Box>
							<Box sx={{ width: "250px" }}>
								<div
									style={{
										width: "100%",
										backgroundColor: "grey",
										height: "1px"
									}}
								/>
								<Typography variant="h5" color={"black"}>
									{state.data.resp_fazenda}
								</Typography>
							</Box>
						</Box>
					</>
				)}
			</Box>
		</Box>
	);
};

export default VisitaIDPage;
