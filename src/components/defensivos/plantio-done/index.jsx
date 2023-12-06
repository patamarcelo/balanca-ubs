import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./plantio-done-page.module.css";

import { useEffect, useState } from "react";

import djangoApi from "../../../utils/axios/axios.utils";
import PlantioDoneTable from "./data-table-plantio-done";
import LoaderHomeSkeleton from "../home/loader";

import { useSelector } from "react-redux";
import {
	selecCalendarArray,
	selectSafraCiclo
} from "../../../store/plantio/plantio.selector";

import {
	selecPlantioCharts,
	selectPlantioVarsChart,
	selectPlantioDoneResume
} from "../../../store/plantio/plantio.selector";

import { setPlantioCalendarDone } from "../../../store/plantio/plantio.actions";

import MyResponsivePie from "../plantio-done/pie-chart";
import MyResponsiveSunburst from "./pie-chart-vars";
import MyResponsiveChartVars from "./pie-chart-cultiv";
import MyResponsiveBar from "./bar-chart-plantio";

import LinearProgress, {
	linearProgressClasses
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import { useDispatch } from "react-redux";
import CalendarDonePage from "./plantio-done-calendar";

const PlantioDonePage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dispatch = useDispatch();
	const safraCiclo = useSelector(selectSafraCiclo);
	const [selectCult, setSelectCult] = useState("Todas");
	const plantioChart = useSelector(selecPlantioCharts(selectCult));
	const plantioChartVars = useSelector(selectPlantioVarsChart);
	const plantioBarChartVars = useSelector(
		selectPlantioDoneResume(selectCult)
	);

	const [dataF, setDataF] = useState([]);
	const [filtCult, setFiltCult] = useState([]);

	const [isLoading, setIsLoading] = useState(true);
	const [params, setParams] = useState({
		safra: safraCiclo.safra,
		ciclo: safraCiclo.ciclo
	});

	const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
		height: 10,
		borderRadius: 5,
		[`&.${linearProgressClasses.colorPrimary}`]: {
			backgroundColor:
				colors.primary[theme.palette.mode === "light" ? 900 : 100]
		},
		[`& .${linearProgressClasses.bar}`]: {
			borderRadius: 5,
			backgroundColor:
				theme.palette.mode === "light" ? "#33CD32" : "#33CD32"
		}
	}));

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

	useEffect(() => {
		(async () => {
			setIsLoading(true);
			try {
				await djangoApi
					.post("plantio/get_plantio_calendar_done/", params, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						dispatch(setPlantioCalendarDone(res.data.data));
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	return (
		<>
			<Box className={classes.container}>
				{isLoading && <LoaderHomeSkeleton />}

				{!isLoading && dataF && (
					<>
						<Box
							sx={{
								width: "100%",
								// minHeight: "300px",
								// backgroundColor: "rgb(208, 209, 213, 0.2)",
								// backgroundColor: "rgb(249, 244, 244,0.9)",
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "12px",
								display: "flex",
								// flexDirection: "column",
								justifyContent: "space-around",
								flexDirection: "column",
								alignItems: "center",
								// overflow: "auto",
								// overflowY: "hidden",
								border: "1px solid black"
							}}
						>
							<Box
								sx={{
									display: "flex",
									width: "100%",
									justifyContent: "flex-start",
									marginLeft: "25px"
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
														cursor: "pointer",
														backgroundColor:
															colors
																.blueOrigin[900]
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
								<Box sx={{ height: "350px", width: "400px" }}>
									<MyResponsivePie
										colors={colors}
										data={plantioChart}
									/>
								</Box>
								<Box sx={{ height: "350px", width: "400px" }}>
									<MyResponsiveSunburst
										colors={colors}
										data={plantioChartVars["result"]}
									/>
								</Box>
								<Box sx={{ height: "350px", width: "400px" }}>
									<MyResponsiveChartVars
										colors={colors}
										setFiltCult={setFiltCult}
										data={plantioChartVars["data"]}
										cultFilt={selectCult}
									/>
								</Box>
							</Box>
						</Box>
						<Box
							sx={{
								width: "100%",
								minHeight: "300px",
								// backgroundColor: "rgb(208, 209, 213, 0.2)",
								backgroundColor: colors.blueOrigin[700],
								borderRadius: "12px",
								display: "flex",
								justifyContent: "space-between",
								flexDirection: "row",
								alignItems: "center",
								marginTop: "5px",
								border: "1px solid black",
								gap: "5px"
							}}
						>
							<Box
								sx={{
									height: "400px",
									width: "75%",
									display: "flex"
								}}
							>
								<MyResponsiveBar
									colors={colors}
									dataChart={plantioBarChartVars["allFarm"]}
									filtCult={filtCult}
								/>
							</Box>
							{/* <Divider
								orientation="vertical"
								variant="middle"
								flexItem
							/> */}
							<Box
								sx={{
									height: "400px",
									width: "25%",
									display: "grid",
									gridTemplateColumns: "98%",
									justifyContent: "end",
									alignContent: "start",
									overflow: "auto",
									gap: "5px",
									backgroundColor: colors.blueOrigin[900]
								}}
							>
								{plantioBarChartVars["planted"]
									.sort((a, b) => b.area - a.area)
									.map((data, i) => {
										const percent =
											plantioBarChartVars["totalPlan"][
												data.fazenda
											];
										const final =
											(data.area / percent) * 100;
										return (
											<Box
												key={i}
												sx={{
													display: "flex",
													flexDirection: "column",
													justifyContent:
														"space-between",
													width: "100%",
													padding: "5px 25px",
													// backgroundColor:
													// 	"rgb(208, 209, 213, 0.1)",
													backgroundColor:
														colors.blueOrigin[700],
													color: colors
														.blueOrigin[200],
													fontWeight: "bold",
													borderRadius: "7px"
												}}
											>
												<Box
													sx={{
														display: "flex",
														justifyContent:
															"space-between",
														width: "100%",
														// padding: "5px 25px",
														// backgroundColor:
														// 	"rgb(208, 209, 213, 0.1)",
														backgroundColor:
															colors
																.blueOrigin[700],
														color: colors
															.blueOrigin[200],
														fontWeight: "bold"
													}}
												>
													<span>
														{data.fazenda.replace(
															"Projeto",
															""
														)}
													</span>
													{data.area === percent ? (
														<span>
															{data.area.toLocaleString(
																"pt-br",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2
																}
															)}{" "}
														</span>
													) : (
														<span>
															{data.area.toLocaleString(
																"pt-br",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2
																}
															)}{" "}
															/{" "}
															{percent.toLocaleString(
																"pt-br",
																{
																	minimumFractionDigits: 2,
																	maximumFractionDigits: 2
																}
															)}{" "}
														</span>
													)}
												</Box>
												<Box
													sx={{
														width: "100%",
														alignSelf: "center",
														display: "flex",
														flexDirection: "row",
														justifyContent:
															"space-between",
														alignItems: "center",
														marginTop: "10px"
														// marginBottom: "5px"
													}}
												>
													<Box
														sx={{
															width: "70%",
															height: "10px"
														}}
													>
														<BorderLinearProgress
															variant="determinate"
															value={final}
														/>
													</Box>
													<Box
														sx={{
															width: "15%",
															height: "10px",
															color: colors
																.primary[100],
															fontSize: "0.7rem",
															marginBottom: "5px"
														}}
													>
														{final.toLocaleString(
															"pt-br",
															{
																minimumFractionDigits: 0,
																maximumFractionDigits: 0
															}
														)}{" "}
														%
													</Box>
												</Box>
											</Box>
										);
									})}
							</Box>
						</Box>

						<CalendarDonePage cultFilt={selectCult} />
						<PlantioDoneTable loading={isLoading} rows={dataF} />
					</>
				)}
			</Box>
		</>
	);
};
export default PlantioDonePage;
