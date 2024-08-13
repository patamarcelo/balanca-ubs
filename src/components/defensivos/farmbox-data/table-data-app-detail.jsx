import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import Chip from "@mui/material/Chip";
import { Box, useTheme } from "@mui/material";
import classes from "./farmbox.module.css";
import { tokens } from "../../../theme";

import { useState, useEffect } from "react";

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
		openAll
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

	// useEffect(() => {
	// 	if (sumArea === 0) {
	// 		setParcelaSelected([]);
	// 	}
	// }, [sumArea]);

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
						return (
							<Box
								m={1}
								className={`${classes.parcelasInfoDiv}`}
								onClick={() => handlerSumArea(data)}
							>
								{/* {<IconDetail color={data.aplicado} />} */}
								<span
									className={
										checkIsInArr(data) && classes.isInArr
									}
									style={{
										backgroundColor: data.aplicado
											? "rgba(0,250,0, 0.6)"
											: "rgba(238,75,43, 0.6)",
										padding: "3px 10px",
										borderRadius: "12px",
										fontWeight: "bold",
										whiteSpace: "nowrap"
									}}
								>
									{data.parcela} -{" "}
									{data.area
										.toFixed(2)
										.toString()
										.replace(".", ",")}
								</span>
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
					.map((data, i) => {
						const bombCalc =
							bombArr[0].bombx > 0 && bombArr[0].bombx;

						const tipo = data.tipo.includes("Óleo Mineral")
							? "Óleo"
							: data.tipo;
						const quantiAplicar =
							bombaValue > 0
								? bombCalc * Number(data.dose)
								: data.quantidade;

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
									margin={"7px"}
								>
									<b>
										{parseFloat(data.dose).toLocaleString(
											"pt-br",
											{
												minimumFractionDigits: 3,
												maximumFractionDigits: 3
											}
										)}
									</b>{" "}
									<Chip
										label={data.insumo}
										// label={
										// 	tipo.includes("Óleo Mineral")
										// 		? "Óleo"
										// 		: tipo + " - " + data.insumo
										// }
										sx={{
											backgroundColor: getColorChip(tipo),
											minWidth: "90px",
											textAlign: "center",
											height: "auto",
											margin: "0px 8px 0px 4px",
											fontWeight: "bold",
											border: "0.1em solid black"
										}}
										size="small"
									/>
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
													Number(data.dose) *
														bombArr[1].bomby
												).toLocaleString("pt-br", {
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												})}
											</b>
										</Box>
									)}
								</Box>
							</>
						);
					})}
			</div>
		</>
	);
};

export default DetailAppData;
