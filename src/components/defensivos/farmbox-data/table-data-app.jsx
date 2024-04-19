import classes from "./farmbox.module.css";

import {
	useTheme,
	Slide,
	Divider,
	Box,
	TextField,
	InputAdornment,
	Button,
	IconButton
} from "@mui/material";
import Grow from "@mui/material/Grow";

import { tokens } from "../../../theme";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import question from "../../../utils/assets/icons/question.png";

import ProgressBarPage from "./progress-bar";

import ProgressCircularPage from "./progress-circular";
import DetailAppData from "./table-data-app-detail";
import { useState, useEffect } from "react";

import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faPrint,
	faCircleXmark,
	faMap,
	faCheckCircle,
	faArrowRotateRight
} from "@fortawesome/free-solid-svg-icons";

import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";

const TableDataPage = (props) => {
	const { dataF, openAll } = props;
	
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [showDetail, setShowDetail] = useState(false);
	const [sumArea, setSumArea] = useState(0);
	const [bombaValue, setBombaValue] = useState(0);
	const [bombArr, setBombArr] = useState([
		{ bombx: 0, quantx: 0 },
		{ bomby: 0, quanty: 0 }
	]);
	const [parcelaSelected, setParcelaSelected] = useState([]);
	const [idParcelasSelected, setIdParcelasSelected] = useState([]);

	const [displayMap, setDisplayMap] = useState(null);
	const [loadingMap, setLoadingMap] = useState(false);

	const [rotateDir, setRotateDir] = useState("270");

	useEffect(() => {
		if(openAll){
			setShowDetail(true)
		} else {
			setShowDetail(false)
		}
	}, [openAll]);

	useEffect(() => {
		const newArray = parcelaSelected.map((data) => data.id_plantation);
		setIdParcelasSelected(newArray);
	}, [parcelaSelected]);



	

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" },
		{ cultura: undefined, icon: question, alt: "?" }
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return iconDict[3].icon;
		// return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return iconDict[3].alt;
	};

	const progressNumber =
		Number(dataF.progresso) > 100 ? 100 : Number(dataF.progresso);
	const progressRealNumber = Number(dataF.progresso);
	const opTipo =
		dataF.operacaoTipo === "Operação"
			? dataF.operacao
			: "Sem Operação Informada";

	const warningColor = (title) => {
		return title === "Sem Operação Informada"
			? { color: "red", fontWeight: "bold" }
			: "";
	};

	const showDetailApp = () => {
		setShowDetail(!showDetail);
	};

	const containerRef = useRef(null);

	const handlerSelectAllParcelas = ()=>{
		setParcelaSelected(dataF.parcelas)
	}

	const handlerClearArea = () => {
		console.log("zerando a area");
		setSumArea(0);
		setBombaValue(0);
		setBombArr([
			{ bombx: 0, quantx: 0 },
			{ bomby: 0, quanty: 0 }
		]);
		setDisplayMap(null);
		setIdParcelasSelected([]);
		setRotateDir("270");
		setParcelaSelected([])
	};

	const handleSetBombValue = (value) => {
		if (value) {
			setBombaValue(value.replace(",", "."));
		} else {
			setBombaValue("");
		}
	};

	const handleBombCalc = (bombaValue, sumArea) => {
		const bomb = bombaValue;
		const areaTotalInicial = sumArea;
		let areaTotal = areaTotalInicial;
		let total = areaTotalInicial;
		let count = 0;
		while (total > bomb) {
			count += 1;
			total -= bomb;
		}
		const saldo = areaTotal - count * bomb;
		const bombArr = [
			{ bombx: Number(bombaValue), quantx: count },
			{ bomby: Number(Math.ceil(saldo)), quanty: saldo > 0 ? 1 : 0 }
		];
		if (Number(bombaValue) > sumArea) {
			const bombArrInside = [
				{ bombx: Number(sumArea.toFixed(0)), quantx: 1 },
				{ bomby: 0, quanty: 0 }
			];
			setBombArr(bombArrInside);
		} else {
			setBombArr(bombArr);
		}
	};
	useEffect(() => {
		if (bombaValue > 0) {
			handleBombCalc(bombaValue, sumArea);
		}
	}, [bombaValue, sumArea]);

	const handleSendApiApp = async (idFarm) => {
		const params = JSON.stringify({
			projeto: idFarm,
			parcelas: idParcelasSelected
		});
		setLoadingMap(true);
		try {
			await djangoApi
				.post("plantio/get_matplot_draw/", params, {
					headers: {
						Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`
					}
				})
				.then((res) => {
					console.log(res.data);
					setDisplayMap(res.data);
				});
		} catch (err) {
			console.log("Erro ao alterar as aplicações", err);
		} finally {
			setLoadingMap(false);
		}
	};

	const handleShowMap = (data) => {
		handleSendApiApp(data);
		console.log("get Map from API", data);
		console.log("parcelas Selecionadas: ,", parcelaSelected);
	};

	const handleRotateDir = () => {
		const currentRot = Number(rotateDir);
		if (currentRot === 360) {
			setRotateDir("90");
		} else {
			const newRotate = currentRot + 90;
			setRotateDir(newRotate.toLocaleString());
		}
	};

	return (
		<div
			style={{
				width: "100%",
				backgroundColor: colors.blueOrigin[700],
				border:
					dataF.status === "sought"
						? "0.5px solid yellow"
						: "0.5px solid green"
			}}
			className={classes.mainDivApp}
			ref={containerRef}
		>
			<div className={classes.appDiv}>
				<div
					className={classes.labelDivApp}
					onClick={() => showDetailApp()}
				>
					<p>
						{dataF.app.includes("L")
							? dataF.app.slice(0, 3)
							: dataF.app.slice(0, 2)}{" "}
						{dataF.app.includes("L")
							? dataF.app.slice(3)
							: dataF.app.slice(2)}
					</p>
					<div className={classes.tipoDivApp}>
						<p style={{ ...warningColor(opTipo) }}>{opTipo}</p>
						<img
							className={classes.imgFarmDiv}
							src={filteredIcon(dataF?.cultura)}
							alt={filteredAlt(dataF?.cultura)}
						/>
					</div>
					<div
						className={classes.dateDiv}
						style={{
							color: colors.primary[100],
							marginLeft: "-20px"
						}}
					>
						<div>{dataF.date.split("-").reverse().join("/")}</div>
						<Divider />
						<div>
							{dataF.endDate.split("-").reverse().join("/")}
						</div>
					</div>
				</div>
				<div className={classes.numberDivApp}>
					<p>
						{Number(dataF.area).toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</p>
					<p style={{ textAlign: "center" }}>
						{Number(dataF.areaAplicada).toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</p>
					<p style={{ textAlign: "center" }}>
						{Number(dataF.saldoAplicar).toLocaleString("pt-br", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2
						})}
					</p>
					<div className={classes.progressCircularDiv}>
						<ProgressCircularPage
							progressNumber={progressNumber}
							progressRealNumber={progressRealNumber}
						/>
					</div>
				</div>
			</div>
			<Grow
				in={showDetail}
				mountOnEnter
				unmountOnExit
				container={containerRef.current}
				direction="up"
			>
				<div className={classes.parcelasDetailDiv}>
					<Box
						width="100%"
						flexDirection={"row"}
						display={"flex"}
						justifyContent={"space-between"}
					>
						<DetailAppData
							data={dataF}
							setSumArea={setSumArea}
							sumArea={sumArea}
							bombaValue={bombaValue}
							bombArr={bombArr}
							parcelaSelected={parcelaSelected}
							setParcelaSelected={setParcelaSelected}
							openAll={openAll}
						/>
					</Box>
					{sumArea > 0 ? (
						<Box
							sx={{
								display: "flex",
								width: "100%",
								flexDirection: "row",
								justifyContent: "space-between",
								alignItems: "end"
							}}
						>
							<Box className={classes.areaTotalSumDiv}>
								<span
									onClick={handlerClearArea}
									style={{ cursor: "pointer" }}
								>
									<FontAwesomeIcon
										icon={faCircleXmark}
										color={colors.textColor[100]}
										style={{ marginRight: "10px" }}
									/>
									Area Total:{" "}
									<b>
										{sumArea?.toLocaleString("pt-BR", {
											maximumFractionDigits: 2,
											minimumFractionDigits: 2
										})}
									</b>
								</span>
								<Box width={"100%"}>
									<TextField
										sx={{
											width: "180px",
											paddingLeft: "5px"
										}}
										aria-label="Bomba Input"
										placeholder="Tamanho"
										onChange={(e) =>
											handleSetBombValue(e.target.value)
										}
										variant="standard"
										value={bombaValue}
										InputProps={{
											endAdornment: (
												<InputAdornment
													disableTypography
													position="end"
												>
													Bomba / Hectares
												</InputAdornment>
											)
										}}
									/>
								</Box>
							</Box>
							<Box>
								<IconButton
									onClick={() =>
										handleShowMap(dataF.fazenda_box_id)
									}
								>
									<FontAwesomeIcon
										icon={faMap}
										color={colors.textColor[100]}
										style={{
											cursor: "pointer"
										}}
									/>
								</IconButton>
							</Box>
						</Box>
					) : 
					<Box className={classes.areaTotalSumDiv}>
								<span
									onClick={handlerSelectAllParcelas}
									style={{ cursor: "pointer" }}
								>
									<FontAwesomeIcon
										icon={faCheckCircle}
										color={colors.greenAccent[300]}
										style={{ marginRight: "10px" }}
									/>
									</span></Box>
					}
					{loadingMap && (
						<Box
							display="flex"
							justifyContent="center"
							alignItems="center"
						>
							<CircularProgress
								sx={{ color: colors.primary[100] }}
							/>
						</Box>
					)}
					{displayMap && (
						<Box>
							<Box display={"flex"} justifyContent={"center"}>
								<img
									src={displayMap}
									alt="Italian Trulli"
									style={{
										transform: `rotate(${rotateDir}deg)`,
										width: "400px"
									}}
								/>
							</Box>
							<Box>
								<FontAwesomeIcon
									onClick={handleRotateDir}
									icon={faArrowRotateRight}
									color={colors.textColor[100]}
									style={{
										cursor: "pointer"
									}}
								/>
							</Box>
						</Box>
					)}
				</div>
			</Grow>
		</div>
	);
};

export default TableDataPage;
