import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { useState, useEffect, useCallback } from "react";
import classes from "./data-program.module.css";

import { displayDate } from "../../../utils/format-suport/data-format";

import { faCheck, faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import { faCheckDouble } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { faArrowDownAZ } from "@fortawesome/free-solid-svg-icons";
import { faArrowDownShortWide } from "@fortawesome/free-solid-svg-icons";
import { faMapLocationDot } from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useMediaQuery from "@mui/material/useMediaQuery";

import Zoom from "@mui/material/Zoom";
// import CustomButton from "../../button";
import IconButton from "@mui/material/IconButton";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

import MapPage from "../maps";
import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";

import { useSelector } from "react-redux";
import { selectIsAdminUser } from "../../../store/user/user.selector";
import {
	selectPlantio,
	selectSafraCiclo
} from "../../../store/plantio/plantio.selector";

import EmptyResultPage from "./empty-result";

const DataProgramPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { initialDateForm, finalDateForm, handleRefreshData } = props;

	const [farmList, setFarmList] = useState([]);
	const [objList, setObjList] = useState([]);
	const [objResumValues, setObjResumValues] = useState([]);

	const [filteredList, setFilteredList] = useState([]);
	const [farmSelected, setFarmSelected] = useState("");

	const [showProducts, setShoeProducts] = useState(false);
	const isNonIpad = useMediaQuery("(min-width: 1404px)");
	const isCellPhone = useMediaQuery("(min-width: 850px)");

	const [onlyOpenApp, setOnlyOpenApp] = useState(false);

	const [filtData, setFiltData] = useState(false);

	const [mapArray, setMapArray] = useState([]);
	const [dataToMap, setDataToMap] = useState([]);

	const [areaFiltTotal, setAreaFiltTotal] = useState(0);

	const [showMapps, setShowMapps] = useState(false);

	const [isLoadingHome, setIsLoading] = useState(true);

	const [updateApp, setUpdateApp] = useState([]);

	const [sendingData, setSendingData] = useState(false);
	const [positiveSignal, setPositiveSignal] = useState(false);

	const isAdminUser = useSelector(selectIsAdminUser);
	const plantioRedux = useSelector(selectPlantio);
	const safraCiclo = useSelector(selectSafraCiclo);

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];

	const handleSetApp = (dataId, estagio) => {
		const newDict = {
			id: dataId,
			estagio: estagio
		};

		const isIn = updateApp.some(
			(data) => data.id === dataId && data.estagio === estagio
		);
		if (isIn) {
			// console.log("já colocado");
			const newArr = updateApp.filter((data) => {
				const newData = `${data.id}${data.estagio}`;
				const oldData = `${dataId}${estagio}`;
				return newData !== oldData;
			});
			setUpdateApp(newArr);
		} else {
			setUpdateApp((updateApp) => [...updateApp, newDict]);
			// console.log("ainda não estava");
		}
	};

	const handleSendApiApp = async (data) => {
		const params = JSON.stringify({
			data: data
		});
		try {
			setSendingData(true);
			await djangoApi
				.put("plantio/update_aplication_plantio/", params, {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					}
				})
				.then((res) => {
					console.log(res);
				});
		} catch (err) {
			console.log("Erro ao alterar as aplicações", err);
		} finally {
			setUpdateApp([]);
			setSendingData(false);

			setPositiveSignal(true);
			setTimeout(() => {
				setPositiveSignal(false);
			}, 1500);

			setTimeout(() => {
				handleRefreshData();
			}, 1700);
		}
	};

	const handleShowMaps = () => {
		setShowMapps(!showMapps);
	};

	const handlerShowMaps = useCallback(() => {
		if (showMapps && farmSelected) {
			setShowMapps(false);
			setTimeout(() => {
				setShowMapps(true);
			}, 500);
		}
	}, [farmSelected]);

	useEffect(() => {
		handlerShowMaps();
	}, [farmSelected, handlerShowMaps]);

	const filteredIcon = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data.cultura
		);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data.cultura
		);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	useEffect(() => {
		(async () => {
			try {
				await djangoApi
					.post("plantio/get_plantio_detail_map/", safraCiclo, {
						headers: {
							Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
						}
					})
					.then((res) => {
						setDataToMap(res.data.dados_plantio);
					})
					.catch((err) => console.log(err));
			} catch (err) {
				console.log("Erro ao consumir a API", err);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		if (dataToMap) {
			const mapArray = dataToMap.map((data, i) => {
				return {
					projeto: data.fazenda,
					parcela: data.parcela,
					map_centro_id: data.dados.projeto_map_centro_id,
					map_zoom: data.dados.projeto_map_zoom,
					cultura: data.dados.cultura,
					variedade: data.dados.variedade,
					variedadeColor: data.dados.variedade_color,
					variedadeColorLine: data.dados.variedade_color_line,
					map_geo_poins: data?.dados?.map_geo_points?.map((data) => ({
						lat: Number(data.latitude),
						lng: Number(data.longitude)
					})),
					map_geo_center_points: data?.dados?.map_geo_points_center
				};
			});

			setMapArray(
				mapArray.filter((data) => data.projeto === farmSelected)
			);
		}
	}, [dataToMap, farmSelected]);

	useEffect(() => {
		const listFarm = plantioRedux
			.filter((data) => data.dados.plantio_finalizado === true)
			.map((data, i) => {
				return data.fazenda;
			});
		setFarmList([...new Set(listFarm)].sort());
		handleFilterList([...new Set(listFarm)].sort()[0]);
	}, []);

	const handleFilterList = (farmName) => {
		setFarmSelected(farmName);
		const filtList = plantioRedux.filter(
			(data) =>
				data.fazenda === farmName &&
				data.dados.plantio_finalizado === true
		);
		setFilteredList(filtList);
	};

	const handleFilterTable = () => {
		setFiltData(!filtData);
	};

	useEffect(() => {
		const filtParcelas = filteredList.map((data, i) => {
			const initialDate = initialDateForm;
			const finalDate = finalDateForm ? finalDateForm : "2023-05-29";
			const cronograma = data.dados.cronograma;

			// PLOT MAT INFORMATION
			const projetoMapCentroId = data.dados.projeto_map_centro_id;
			const mapGeoPoints = data.dados.map_geo_points;
			const variedadeColor = data.dados.variedade_color;
			const variedadeColorLine = data.dados.variedade_color_line;
			const plantioId = data.dados.plantio_id;

			const cronArr = cronograma.map((cron, i) => {
				const aplicado = cron.aplicado;
				let cronOb;
				const dataPrev = cron["data prevista"];
				if (dataPrev >= initialDate && dataPrev <= finalDate) {
					const estagio = cron.estagio;
					const dataPrevApp = dataPrev;
					const dapApp = cron.dap;
					const parcela = data.parcela;
					const variedade = data.dados.variedade;
					const dataPlantio = data.dados.data_inicio_plantio;
					const area = data.dados.area_colheita;
					const dap = data.dados.dap;
					const cultura = data.dados.cultura;
					const produtosAp = cron.produtos;
					const produtos = produtosAp.map((data) => ({
						...data,
						area: area
					}));
					cronOb = {
						parcela,
						variedade,
						dataPlantio,
						estagio,
						dataPrevApp,
						dapApp,
						area,
						dap,
						cultura,
						produtos,
						aplicado,
						projetoMapCentroId,
						mapGeoPoints,
						variedadeColor,
						variedadeColorLine,
						plantioId
					};
				}
				return cronOb;
			});
			if (!onlyOpenApp) {
				return cronArr.filter(
					(data) => data !== undefined && data.aplicado === false
				);
			} else {
				return cronArr.filter((data) => data !== undefined);
			}
		});
		const filtArray = filtParcelas
			.flat()
			.sort((a, b) => new Date(a.dataPrevApp) - new Date(b.dataPrevApp))
			.sort((a, b) => a.dapApp - b.dapApp);

		const result = filtArray.reduce((acc, curr) => {
			const estagio = curr.estagio;
			const dapApp = curr.dapApp;
			if (dapApp > 0) {
				if (acc[estagio] == null) acc[estagio] = [];
				acc[estagio].push(curr);
			}
			return acc;
		}, {});
		const dictTotal = [];
		Object.keys(result).map((data, i) => {
			const total = result[data].reduce((acc, curr) => {
				return curr.area + acc;
			}, 0);

			const produtosArr = result[data].map((data, i) => {
				const filtArr = data.produtos.map((data) => {
					return data;
				});
				return filtArr;
			});
			const newDic = {
				estagio: data,
				cronograma: result[data],
				total: total.toLocaleString("pt-br", {
					maximumFractionDigits: 2
				}),
				produtos: produtosArr.flat()
			};
			dictTotal.push(newDic);
			return newDic;
		});
		setObjList(dictTotal);
	}, [filteredList, initialDateForm, finalDateForm, onlyOpenApp]);

	useEffect(() => {
		const useArr = [...objList];
		const filtArr = useArr.map((data, i) => {
			const dataProdutos = data.produtos;
			var result = [];
			// const area_total = data.total.replace(".", "").replace(",", ".");
			// console.log(parseFloat(area_total));
			dataProdutos.reduce(function (res, value) {
				if (!res[value.produto]) {
					res[value.produto] = {
						produto: value.produto,
						qty: 0,
						dose: Number(value.dose)
					};
					result.push(res[value.produto]);
				}
				res[value.produto].qty += value.area * Number(value.dose);
				return res;
			}, {});
			return { data, totais: result };
		});
		const totalArea = filtArr.map((data) =>
			Number(data.data.total.replace(".", "").replace(",", "."))
		);
		var sum = totalArea.reduce((accumulator, currentValue) => {
			return accumulator + currentValue;
		}, 0);
		setAreaFiltTotal(sum);
		setObjResumValues(filtArr);
	}, [objList]);

	return (
		<Box
			className={classes.mainDiv}
			style={{ backgroundColor: colors.blueOrigin[700] }}
			mt={3}
		>
			<Box
				className={`${classes.div} ${classes["farm-list-div"]}`}
				style={{ backgroundColor: colors.blueOrigin[800] }}
			>
				{farmList.map((data, i) => {
					return (
						<Box
							key={i}
							gap={10}
							sx={{
								boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 15px",
								borderRadius: "8px"
							}}
						>
							<Typography
								style={{
									backgroundColor:
										farmSelected === data
											? colors.primary[900]
											: colors.brown[550],
									color:
										farmSelected === data &&
										theme.palette.mode === "light"
											? "black"
											: farmSelected !== data &&
											  theme.palette.mode === "light"
											? "white"
											: colors.primary[100],
									fontStyle: "italic",
									fontWeight: 600
								}}
								variant="h6"
								onClick={() => handleFilterList(data)}
							>
								{data.replace("Projeto ", "")}
							</Typography>
						</Box>
					);
				})}
			</Box>
			<Box className={classes["box-program"]} mt={2}>
				<Box
					className={classes["fazenda-div"]}
					style={{ backgroundColor: colors.blueOrigin[800] }}
				>
					<Typography
						variant={!isCellPhone ? "h6" : "h6"}
						color={
							theme.palette.mode === "dark"
								? colors.primary[100]
								: "black"
						}
						sx={{
							display: "flex",
							flexDirection: "row",
							width: "100%",
							justifyContent: "space-between",
							paddingLeft: "5px",
							fontWeight: "bold"
						}}
					>
						<div>
							<span style={{ fontStyle: "italic" }}>
								até{" "}
								{finalDateForm && displayDate(finalDateForm)}
							</span>
						</div>
						<div>
							{farmSelected}
							<FontAwesomeIcon
								icon={!onlyOpenApp ? faCheckDouble : faClock}
								color={
									!onlyOpenApp
										? colors.greenAccent[500]
										: colors.yellow[500]
								}
								size="sm"
								style={{
									margin: "0px 10px",
									cursor: "pointer"
								}}
								onClick={() => setOnlyOpenApp(!onlyOpenApp)}
							/>
							<FontAwesomeIcon
								icon={
									!filtData
										? faArrowDownShortWide
										: faArrowDownAZ
								}
								color={
									!filtData
										? colors.greenAccent[500]
										: colors.yellow[500]
								}
								size="sm"
								style={{
									margin: "0px 0px",
									cursor: "pointer"
								}}
								onClick={() => handleFilterTable()}
							/>
							{isLoadingHome ? (
								<CircularProgress
									size={15}
									sx={{
										margin: "0px 10px",
										color: (theme) =>
											colors.greenAccent[
												theme.palette.mode === "dark"
													? 200
													: 800
											]
									}}
								/>
							) : (
								<FontAwesomeIcon
									icon={faMapLocationDot}
									color={
										!showMapps
											? colors.greenAccent[500]
											: colors.yellow[500]
									}
									size="sm"
									style={{
										margin: "0px 10px",
										cursor: "pointer"
									}}
									onClick={() => handleShowMaps()}
								/>
							)}

							{isAdminUser &&
								updateApp.length > 0 &&
								(sendingData ? (
									<CircularProgress
										size={15}
										sx={{
											margin: "0px 10px",
											color: (theme) =>
												colors.greenAccent[
													theme.palette.mode ===
													"dark"
														? 200
														: 800
												]
										}}
									/>
								) : (
									<IconButton
										aria-label="delete"
										onClick={() =>
											handleSendApiApp(updateApp)
										}
									>
										<FontAwesomeIcon
											icon={faCircleCheck}
											size="xs"
										/>
									</IconButton>
								))}

							{
								<Fade in={positiveSignal}>
									<FontAwesomeIcon
										icon={faCheck}
										size="xs"
										color={colors.greenAccent[500]}
									/>
								</Fade>
							}
						</div>
						<div>
							{areaFiltTotal > 0 && (
								<>
									&nbsp;&nbsp;&nbsp; Área:{" "}
									<span style={{ fontStyle: "italic" }}>
										{areaFiltTotal.toLocaleString("pt-br", {
											minimumFractionDigits: 2,
											maximumFractionDigits: 2
										})}
									</span>
								</>
							)}
						</div>
					</Typography>
				</Box>

				{objResumValues.length === 0 && <EmptyResultPage />}
				<Box className={classes["geral-program-div"]}>
					{objResumValues.length > 0 &&
						objResumValues.map((dat, i) => {
							const data = dat.data;
							const programa = data.estagio.split("|")[1];
							const estagio = data.estagio.split("|")[0];
							return (
								<div
									key={i}
									style={{
										boxShadow:
											"rgba(0, 0, 0, 0.5) 2px 2px 2px 1px",
										borderRadius: "8px"
									}}
								>
									<div
										key={i}
										style={{
											backgroundColor:
												colors.blueOrigin[800],
											border:
												theme.palette.mode ===
													"light" && "1px solid black"
										}}
										className={
											classes[
												`${
													!isCellPhone
														? "detail-parcela-div-mobile"
														: "detail-parcela-div"
												}`
											]
										}
									>
										<div
											className={
												!isNonIpad
													? classes[
															"estagio-div-ipad"
													  ]
													: classes["estagio-div"]
											}
										>
											<FontAwesomeIcon
												icon={
													!showProducts
														? faEyeSlash
														: faEye
												}
												color={
													!showProducts
														? colors.redAccent[500]
														: colors
																.greenAccent[500]
												}
												size="sm"
												style={{
													marginTop: "20px",
													cursor: "pointer"
												}}
												onClick={() =>
													setShoeProducts(
														!showProducts
													)
												}
											/>
											<p
												style={{
													color: colors.primary[200]
												}}
											>
												{programa}
											</p>
											<p>{estagio}</p>
											<p
												style={{
													color: colors.primary[200]
												}}
											>
												Area Total: {data.total}
											</p>
											<Zoom
												in={showProducts}
												style={{
													transitionDelay:
														showProducts
															? "300ms"
															: "0ms"
												}}
											>
												<div
													className={
														classes[
															"div-produtos-aplicar-outside"
														]
													}
												>
													{dat.totais
														.sort((a, b) =>
															a.produto.localeCompare(
																b.produto
															)
														)
														.map((dataP, i) => {
															const quantidade =
																Number(
																	dataP.qty
																).toLocaleString(
																	"pt-br",
																	{
																		maximumFractionDigits: 2,
																		minimumFractionDigits: 2
																	}
																);
															return (
																<div
																	key={i}
																	style={{
																		height: "100%",
																		transition:
																			"height 3s",
																		display:
																			showProducts
																				? ""
																				: "none"
																	}}
																>
																	<div
																		className={
																			classes[
																				"div-produtos-aplicar"
																			]
																		}
																	>
																		<div
																			style={{
																				color:
																					theme
																						.palette
																						.mode ===
																					"light"
																						? "grey"
																						: colors
																								.primary[300]
																			}}
																			className={
																				classes[
																					"div-produtos-aplicar-produto"
																				]
																			}
																		>
																			{`${dataP.dose.toLocaleString(
																				"pt-br",
																				{
																					minimumFractionDigits: 3,
																					maximumFractionDigits: 3
																				}
																			)} - ` +
																				dataP.produto}
																		</div>
																		<div
																			style={{
																				color:
																					theme
																						.palette
																						.mode ===
																					"light"
																						? "black"
																						: colors
																								.primary[100]
																			}}
																			className={
																				classes[
																					"div-produtos-aplicar-quantidade"
																				]
																			}
																		>
																			{" "}
																			{
																				quantidade
																			}
																		</div>
																	</div>
																</div>
															);
														})}
												</div>
											</Zoom>
										</div>
										<div
											className={
												classes["parcelas-resumo-div"]
											}
										>
											<div style={{ gap: "8px" }}>
												<div
													className={
														classes[
															"parcelas-div-header"
														]
													}
													style={{
														borderBottom: `0.5px dotted ${colors.primary[100]}`
													}}
												>
													<div
														style={{
															marginRight: "20px"
														}}
													>
														Parcela
													</div>
													<div>Plantio</div>
													<div
														style={{
															marginRight: "20px"
														}}
													>
														Dap
													</div>
													<div
														style={{
															marginRight: "30px"
														}}
														className={
															classes[
																"cultura-div"
															]
														}
													>
														Cultura
													</div>
													<div>Variedade</div>
													<div
														style={{
															marginLeft: "30px"
														}}
													>
														Prev.
													</div>
													<div
														style={{
															marginLeft: "20px"
														}}
													>
														DAP AP
													</div>
													<div>Area</div>
												</div>
												{data.cronograma
													.sort((a, b) =>
														!filtData
															? new Date(
																	a.dataPrevApp
															  ) -
															  new Date(
																	b.dataPrevApp
															  )
															: a.parcela.localeCompare(
																	b.parcela
															  )
													)
													.map((data, i) => {
														const dataId =
															data.plantioId;
														const setEstagio =
															data.estagio.split(
																"|"
															)[0];

														const checkSelected =
															updateApp.some(
																(data) =>
																	data.id ===
																		dataId &&
																	data.estagio ===
																		estagio
															);
														return (
															<div
																key={i}
																className={`${
																	classes[
																		"parcelas-detail-div"
																	]
																}
																	${checkSelected && classes["parcelas-resumo-div-selected"]}
																}
																	`}
															>
																<div
																	className={
																		classes[
																			"parcela-div"
																		]
																	}
																>
																	<div
																		className={
																			classes[
																				"parcela-icon-div"
																			]
																		}
																		onClick={() =>
																			handleSetApp(
																				dataId,
																				setEstagio
																			)
																		}
																	>
																		<img
																			src={filteredIcon(
																				data
																			)}
																			alt={filteredAlt(
																				data
																			)}
																			style={{
																				filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
																			}}
																		/>
																	</div>
																	{
																		data.parcela
																	}
																</div>
																<div
																	style={{
																		color: colors
																			.greenAccent[300]
																	}}
																>
																	{displayDate(
																		data.dataPlantio
																	)}
																</div>
																<div>
																	{data.dap <
																	10
																		? "0" +
																		  data.dap
																		: data.dap}
																</div>
																<div
																	className={
																		classes[
																			"cultura-div"
																		]
																	}
																>
																	{
																		data.cultura
																	}
																</div>
																<div
																	className={
																		classes[
																			"variedade-div"
																		]
																	}
																>
																	{
																		data.variedade
																	}
																</div>
																<div>
																	{displayDate(
																		data.dataPrevApp
																	)}
																</div>
																<div>
																	{
																		data.dapApp
																	}
																</div>
																<div
																	style={{
																		color: colors
																			.primary[200]
																	}}
																	className={
																		classes[
																			"area-div"
																		]
																	}
																>
																	{data.area
																		.toFixed(
																			2
																		)
																		.replace(
																			".",
																			","
																		)}
																</div>
															</div>
														);
													})}
											</div>
										</div>
									</div>
									{showMapps && (
										<Box
											sx={{
												display: "flex",
												justifyContent: "center",
												alignItems: "center",
												borderRadius: "8px",
												backgroundColor:
													colors.blueOrigin[800]
											}}
											className={classes["geral-map-div"]}
										>
											<MapPage
												mapArray={mapArray}
												filtData={data}
											/>
										</Box>
									)}
								</div>
							);
						})}
				</Box>
			</Box>
		</Box>
	);
};

export default DataProgramPage;
