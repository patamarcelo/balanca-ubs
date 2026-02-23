import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Chip from "@mui/material/Chip";
import { Box, Divider, Typography, useTheme } from "@mui/material";
import classes from "./farmbox.module.css";
import { tokens } from "../../../theme";

import { useState, useEffect } from "react";

import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';

import { formatNumber } from "../../../utils/format-suport/data-format";

const rgbToRgba = (rgb, a = 1) => rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);
const colorDict = [
	{
		tipo: "Inseticida",
		color: "rgb(218,78,75)"
	},
	{
		tipo: "Herbicida",
		color: "rgb(166,166,54)"
	},
	{
		tipo: "Adjuvante",
		color: "rgb(136,171,172)"
	},
	{
		tipo: "Óleo",
		color: "rgb(120,161,144)"
	},
	{
		tipo: "Micronutrientes",
		color: "rgb(118,192,226)"
	},
	{
		tipo: "Fungicida",
		color: "rgb(238,165,56)"
	},
	{
		tipo: "Fertilizante",
		color: "rgb(76,180,211)"
	},
	{
		tipo: "Nutrição ",
		color: "rgb(87,77,109)"
	},
	{
		tipo: "Biológico",
		color: "rgb(69,133,255)"
	}
];

const getColorChip = (data) => {
	const folt = colorDict.filter((tipo) => tipo.tipo === data);
	if (folt.length > 0) {
		return folt[0].color;
	} else {
		return "rgb(255,255,255,0.1)";
	}
};

const DetailAppData = (props) => {
	const {
		data,
		showData,
		setSumArea,
		sumArea,
		bombaValue,
		bombArr,
		setParcelaSelected,
		parcelaSelected,
		openAll,
		tipoAplicacao,
		dapApDestaque = 50
	} = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const handlerSumArea = (parcelaDetail) => {
		const findParcela = parcelaSelected.filter(
			(data) => data.id_plantation === parcelaDetail.id_plantation
		);
		if (findParcela.length > 0) {
			const removedParcela = parcelaSelected.filter(
				(data) => data.id_plantation !== parcelaDetail.id_plantation
			);
			setParcelaSelected(removedParcela);
		} else {
			setParcelaSelected((prev) => [...prev, parcelaDetail]);
		}
	};

	// Selecionar todas as parcelas ao abrir todas as APs
	// useEffect(() => {
	// 	if(openAll && data.parcelas.length > 0){
	// 		const newParcelas = data.parcelas
	// 		setParcelaSelected(newParcelas)
	// 		console.log(newParcelas)
	// 	} else {
	// 		setParcelaSelected([])
	// 	}
	// }, [openAll]);


	useEffect(() => {
		console.log(parcelaSelected);
		const totalArea = parcelaSelected.reduce(
			(acc, curr) => acc + curr.area,
			0
		);
		setSumArea(totalArea);
	}, [parcelaSelected]);

	const checkIsInArr = (parcelaDetail) => {
		const findParcela = parcelaSelected.filter(
			(data) => data.id_plantation === parcelaDetail.id_plantation
		);
		if (findParcela.length > 0) {
			return true;
		}
		return false;
	};


	const daysBetween = (date1) => {
		const d1 = new Date(date1);
		const d2 = new Date();
		const diffTime = Math.abs(d2 - d1); // Difference in milliseconds
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // Convert to days
		return diffDays;
	}

	const isSolidAp = tipoAplicacao === "Solido";

	return (
		<>
			<Box
				display="grid"
				gridAutoFlow="row"
				justifyContent="start"
				flexWrap="wrap"
				gridAutoRows="0fr"
				gridTemplateColumns="1fr 1fr 1fr"
				gridRowGap="0px"
				width="50%"
			>
				{data.parcelas
					.sort((a, b) => b.aplicado - a.aplicado)
					.map((data, i) => {
						const getArea = data.areaAplicada > 0 ? data.areaAplicada : data.area
						const notFinished = (data.area - getArea) > 0 ? true : false
						const getPercent = ((data.areaAplicada / data.area) * 100)
						const tooltipTile = getPercent.toFixed(0) + "%  - " + formatNumber(data.areaAplicada, 2) + " Ha"

						const dap = data?.dataPlantio ? daysBetween(data.dataPlantio) : null;
						const isDapCritical = typeof dap === "number" && dap >= dapApDestaque;
						const isRedEligible = isSolidAp && isDapCritical;



						return (
							<Box
								m={1}
								className={`${classes.parcelasInfoDiv}`}
								onClick={() => handlerSumArea(data)}
							>
								{/* {<IconDetail color={data.aplicado} />} */}
								<Tooltip
									title={
										<Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column' }}>
											{
												data?.variedade &&
												<>
													<h2>{data?.variedade}</h2>
													<Divider />
												</>
											}
											{
												data?.dataPlantio ?
													<h2>{data?.dataPlantio?.split("-").reverse().join("/")} - DAP {daysBetween(data.dataPlantio)}</h2>
													:
													<h3>Não Plantado na abertura</h3>
											}

											{
												getPercent !== 0 &&
												<>
													<Divider />
													<h2> {tooltipTile}</h2>
												</>

											}
										</Box>
									}
									arrow
									TransitionComponent={Zoom}
								>
									<Box
										className={[
											checkIsInArr(data) ? classes.isInArr : "",
											!checkIsInArr(data) && !data.aplicado && isRedEligible ? classes.isInArrRed : "",
										].filter(Boolean).join(" ")}

										style={{
											backgroundColor: colors.blueOrigin[600],
											width: "100%",
											borderRadius: "8px",
										}}
									>
										<Box
											sx={{
												width: data.aplicado ? `${getPercent}%` : '100%',
												padding: "3px 10px",
												borderRadius: notFinished ? "" : "6px",
												borderTopLeftRadius: notFinished && "6px",
												borderBottomLeftRadius: notFinished && "6px",
												fontWeight: "bold",
												whiteSpace: "nowrap",
												backgroundColor: notFinished ? 'rgba(248,198,0,0.6)' : data.aplicado
													? "rgba(0,250,0, 0.6)"
													: "rgba(238,75,43, 0.5)",
											}}
										>
											{data.parcela} -{" "}
											{data.area
												.toFixed(2)
												.toString()
												.replace(".", ",")}


										</Box>
									</Box>
								</Tooltip>
								{/* <progress value={20} max={data.area}></progress> */}
							</Box>
						);
					})}
			</Box>
			<div>
				{bombArr[0].bombx > 0 && (
					<Box
						// style={{ margin: "0px", padding: "0px" }}
						display={"grid"}
						gridAutoFlow={"column"}
						gridAutoColumns={"1fr 180px 1fr 1fr"}
						gridRowGap="5px"
						gap={"2px"}
						margin={"7px"}
						borderBottom={`1px solid ${colors.textColor[100]}`}
					>
						<span>
							<b>Dose</b>
						</span>
						<span style={{ textAlign: "center" }}>
							{" "}
							<b>Insumo</b>
						</span>
						<Box
							style={{ textAlign: "right" }}
							paddingRight={"8px"}
						>
							<b>
								{bombArr[0].quantx} x {bombArr[0].bombx}
							</b>
						</Box>
						{bombArr[1].bomby > 0 && (
							<Box
								style={{ textAlign: "right" }}
								borderLeft={`1px solid ${colors.textColor[100]}`}
								marginLeft={"5px"}
								paddingLeft={"3px"}
							>
								<b>
									{bombArr[1].quanty} x {bombArr[1].bomby}
								</b>
							</Box>
						)}
					</Box>
				)}
				{data.insumos
					.sort((a, b) => a.tipo.localeCompare(b.tipo))
					.map((dataInsum, i) => {
						const bombCalc =
							bombArr[0].bombx > 0 && bombArr[0].bombx;

						const tipo = dataInsum.tipo.includes("Óleo Mineral")
							? "Óleo"
							: dataInsum.tipo;
						const quantiAplicar =
							bombaValue > 0
								? bombCalc * Number(dataInsum.dose)
								: dataInsum.quantidade;

						const needed = Number(dataInsum.quantidade || 0);
						const taken = Number(dataInsum.retiradoLiquido || 0);
						const pct = needed > 0 ? Math.min(100, Math.max(0, (taken / needed) * 100)) : 0;
						const chipColor = getColorChip(tipo);

						const fill = rgbToRgba(chipColor, 0.45);
						const base = "rgba(255,255,255,0.10)";

						return (
							<>
								<Box
									key={i}
									// style={{ margin: "0px", padding: "0px" }}
									display={"grid"}
									gridAutoFlow={"column"}
									gridAutoColumns={"1fr 180px 1fr 1fr"}
									gridRowGap="5px"
									gap={"2px"}
									margin={"3px"}
									alignItems={"baseline"}
								>
									<b>
										{parseFloat(dataInsum.dose).toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 3,
												maximumFractionDigits: 3
											}
										)}
									</b>{" "}

									<Tooltip
										arrow
										TransitionComponent={Zoom}
										title={
											<Box sx={{ minWidth: 220, p: 0.5 }}>
												{/* Saiu */}
												<Box sx={{ display: "flex", justifyContent: "space-between" }}>
													<Typography variant="caption" sx={{ opacity: 0.7 }}>
														Saiu
													</Typography>
													<Typography variant="body2" fontWeight={600}>
														{dataInsum.retirado?.toLocaleString("pt-br")} {dataInsum.mov_unit}
													</Typography>
												</Box>

												{/* Voltou */}
												<Box sx={{ display: "flex", justifyContent: "space-between" }}>
													<Typography variant="caption" sx={{ opacity: 0.7 }}>
														Voltou
													</Typography>
													<Typography variant="body2" fontWeight={600}>
														{dataInsum.devolvido?.toLocaleString("pt-br")} {dataInsum.mov_unit}
													</Typography>
												</Box>

												<Divider sx={{ my: 0.8 }} />

												{/* Saldo (Destaque maior) */}
												<Box sx={{ display: "flex", justifyContent: "space-between" }}>
													<Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
														Utilizado
													</Typography>
													<Typography
														variant="h6"
														sx={{
															fontWeight: 800,
															// color: chipColor,
															lineHeight: 1.1,
														}}
													>
														{taken.toLocaleString("pt-br")} {dataInsum.mov_unit}
													</Typography>
												</Box>

												{/* Percentual */}
												<Box sx={{ mt: 1 }}>
													<Box
														sx={{
															height: 6,
															borderRadius: 4,
															backgroundColor: "rgba(255,255,255,0.15)",
															overflow: "hidden",
														}}
													>
														<Box
															sx={{
																width: `${pct}%`,
																height: "100%",
																backgroundColor: chipColor,
															}}
														/>
													</Box>
													<Typography
														variant="caption"
														sx={{ display: "block", textAlign: "right", mt: 0.5 }}
													>
														{pct.toFixed(0)}% do necessário
													</Typography>
												</Box>
											</Box>
										}
									>


										<Chip
											label={dataInsum.insumo}
											size="small"
											sx={{
												minWidth: "90px",
												textAlign: "center",
												height: "auto",
												margin: "0px 8px 0px 4px",
												fontWeight: "bold",
												border: `1.5px solid ${rgbToRgba(chipColor, 0.95)}`,
												boxShadow: `0 0 0 2px ${rgbToRgba(chipColor, 0.12)} inset`,
												borderRadius: "6px",
												overflow: "hidden",
												position: "relative",

												// ✅ FUNDO BASE (neutro), NÃO a cor do chip
												background: `linear-gradient(90deg, ${fill} 0%, ${fill} ${pct}%, ${base} ${pct}%, ${base} 100%)`,

												// ✅ barra colorida com width percentual
												// "&::before": {
												// 	content: '""',
												// 	position: "absolute",
												// 	left: 0,
												// 	top: 0,
												// 	bottom: 0,
												// 	width: `${pct}%`,          // ✅ agora respeita o percentual
												// 	backgroundColor: chipColor,
												// 	opacity: 0.45,
												// 	zIndex: 0,
												// 	pointerEvents: "none",
												// },

												// ✅ texto por cima
												"& .MuiChip-label": {
													position: "relative",
													zIndex: 1,
													px: 1,
													py: 0.35,
													whiteSpace: "nowrap",
												},
											}}
										/>
									</Tooltip>
									<Box
										textAlign={"right"}
										paddingRight={"8px"}
									>
										<b>
											{parseFloat(
												quantiAplicar
											).toLocaleString("pt-br", {
												minimumFractionDigits: 2,
												maximumFractionDigits: 2
											})}
										</b>
									</Box>
									{bombArr[1].bomby > 0 && (
										<Box
											textAlign={"right"}
											borderLeft={`1px solid ${colors.textColor[100]}`}
											marginLeft={"5px"}
											paddingLeft={"10px"}
										>
											<b>
												{" "}
												{parseFloat(
													Number(dataInsum.dose) *
													bombArr[1].bomby
												).toLocaleString("pt-br", {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												})}
											</b>
										</Box>
									)}
								</Box>
								{
									i !== data.insumos.length - 1 &&
									<Divider m={0} p={0} />
								}
							</>
						);
					})}
			</div>
		</>
	);
};

export default DetailAppData;
