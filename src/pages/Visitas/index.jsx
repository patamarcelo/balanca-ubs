import { Box, Typography, useTheme } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { tokens } from "../../theme";
import djangoApi from "../../utils/axios/axios.utils";

import { useEffect, useState } from "react";
import ImageLoader from "../../components/visitas/img-loader";

import { displayDate } from "../../utils/format-suport/data-format";

import Skeleton from "@mui/material/Skeleton";
import SkeletonCard from "./skeleton-card";

const VisitasPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [isLoading, setisLoading] = useState(true);
	const [visitasArr, setVisitasArr] = useState([]);
	const [formatDataArr, setformatDataArr] = useState([]);

	useEffect(() => {
		const getData = async () => {
			try {
				await djangoApi
					.get("/visitas/get_visitas", {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						// console.log(res.data);
						setVisitasArr(res.data);
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

	useEffect(() => {
		if (visitasArr) {
			const formData = visitasArr?.data_visitas?.map((visita) => {
				const visitaId = visitasArr.data_registros.find(
					(registro) => registro.visita === visita.id
				);
				return { ...visita, registros: visitaId };
			});
			console.log(formData);
			setformatDataArr(formData);
		}
	}, [visitasArr]);

	const handlerNavigation = (data) => {
		console.log(data);
	};

	if (isLoading) {
		return (
			<Box width={"60%"} mt={4}>
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
				<SkeletonCard />
			</Box>
		);
	}
	return (
		<Box width={"60%"}>
			<Typography
				variant="h2"
				color={colors.textColor[100]}
				mb={1}
				// sx={{ textAlign: "center" }}
			>
				Visitas
			</Typography>
			<Box
				sx={{
					display: "flex",
					gap: "10px",
					flexDirection: "column",
					width: "100%"
				}}
			>
				{formatDataArr &&
					formatDataArr.map((data, i) => {
						return (
							<Box
								key={i}
								onClick={() => handlerNavigation(data)}
								sx={{
									display: "grid",
									gridTemplateColumns: "repeat(2, 1fr)",
									justifyContent: "space-between",
									alignItems: "center",
									backgroundColor: colors.blueOrigin[800],
									cursor: "pointer",
									width: "100%",
									borderRadius: "12px",
									opacity: 1,
									"&:not(:hover)": {
										backgroundColor: colors.blueOrigin[800],
										opacity: 0.8
									}
								}}
								p={1}
							>
								<Box>
									<Typography
										variant="h4"
										color={colors.primary[100]}
										pl={3}
									>
										{data.fazenda_title}
									</Typography>
									<Typography
										variant="h6"
										color={colors.primary[100]}
										pl={3}
									>
										{displayDate(data.data)}
									</Typography>
								</Box>
								<ImageLoader data={data} />
							</Box>
						);
					})}
			</Box>
		</Box>
	);
};

export default VisitasPage;
