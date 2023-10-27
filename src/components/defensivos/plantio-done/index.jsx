import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./plantio-done-page.module.css";

import { useEffect, useState } from "react";

import djangoApi from "../../../utils/axios/axios.utils";
import PlantioDoneTable from "./data-table-plantio-done";
import LoaderHomeSkeleton from "../home/loader";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../../store/plantio/plantio.selector";

import {
	selecPlantioCharts,
	selectPlantioVarsChart
} from "../../../store/plantio/plantio.selector";

import MyResponsivePie from "../plantio-done/pie-chart";
import MyResponsiveSunburst from "./pie-chart-vars";
import MyResponsiveChartVars from "./pie-chart-cultiv";

const PlantioDonePage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const safraCiclo = useSelector(selectSafraCiclo);
	const plantioChart = useSelector(selecPlantioCharts);
	const plantioChartVars = useSelector(selectPlantioVarsChart);

	const [dataF, setDataF] = useState([]);
	const [filtCult, setFiltCult] = useState([]);
	const [selectCult, setSelectCult] = useState("Todas");

	const [isLoading, setIsLoading] = useState(true);
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

	const handleFilter = (e) => {
		setSelectCult(e);
	};

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.post("plantio/get_plantio_done/", params, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						// console.log(res.data);
						const newData = res.data.data.map((data, i) => ({
							...data,
							id: i,
							area_colheita: data.area_colheita
								? data.area_colheita
										.toFixed(2)
										.toString()
										.replace(".", ",")
								: "",
							data_plantio: data.data_plantio
								? data.data_plantio
										.split("-")
										.reverse()
										.join("/")
								: "",
							data_plantio_inicio: data.cronograma_programa
								? data["cronograma_programa__0"]["Data Plantio"]
										.split("-")
										.reverse()
										.join("/")
								: ""
						}));
						setDataF(newData);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, [params]);

	return (
		<>
			<Box className={classes.container}>
				{isLoading && <LoaderHomeSkeleton />}

				{!isLoading && dataF && (
					<>
						<Box
							sx={{
								width: "100%",
								minHeight: "300px",
								backgroundColor: "rgb(208, 209, 213, 0.2)",
								// backgroundColor: "rgb(249, 244, 244,0.9)",
								borderRadius: "12px",
								display: "flex",
								// flexDirection: "column",
								justifyContent: "space-around",
								flexDirection: "column",
								alignItems: "center",
								overflow: "auto",
								overflowY: "hidden"
							}}
						>
							<Box
								sx={{
									display: "flex",
									width: "100%",
									justifyContent: "flex-start",
									marginLeft: "10px"
								}}
							>
								<Box
									sx={{
										alignSelf: "baseline",
										justifySelf: "baseline",
										paddingTop: "10px",
										gap: "10px",
										display: "flex",
										flexDirection: "row"
									}}
								>
									{filtCult &&
										filtCult.map((data, i) => {
											return (
												<Box
													key={i}
													onClick={() => {
														handleFilter(data);
													}}
													sx={{
														cursor: "pointer"
													}}
													className={`${
														classes.varChoices
													} ${
														selectCult === data &&
														classes.varChoiceActive
													}`}
												>
													{data}
												</Box>
											);
										})}
								</Box>
							</Box>
							<Box
								sx={{
									width: "100%",
									borderRadius: "12px",
									display: "flex",
									// flexDirection: "column",
									justifyContent: "space-between",
									alignItems: "center",
									overflow: "auto",
									overflowY: "hidden"
								}}
							>
								<Box sx={{ height: "400px", width: "400px" }}>
									<MyResponsivePie
										colors={colors}
										data={plantioChart}
									/>
								</Box>
								<Box sx={{ height: "400px", width: "400px" }}>
									<MyResponsiveSunburst
										colors={colors}
										data={plantioChartVars["result"]}
									/>
								</Box>
								<Box sx={{ height: "400px", width: "400px" }}>
									<MyResponsiveChartVars
										colors={colors}
										setFiltCult={setFiltCult}
										data={plantioChartVars["data"]}
										cultFilt={selectCult}
									/>
								</Box>
							</Box>
						</Box>
						<PlantioDoneTable loading={isLoading} rows={dataF} />
					</>
				)}
			</Box>
		</>
	);
};
export default PlantioDonePage;
