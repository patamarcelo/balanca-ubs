import classes from "./farmbox.module.css";

import {
	useTheme,
	Slide,
	Divider,
	Box,
	TextField,
	InputAdornment,
	Button,
	IconButton,
	Typography
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
	faPlane,
	faCheckCircle,
	faArrowRotateRight
} from "@fortawesome/free-solid-svg-icons";

import djangoApi from "../../../utils/axios/axios.utils";
import CircularProgress from "@mui/material/CircularProgress";

import { useSelector } from "react-redux";
import { selectSafraCiclo } from "../../../store/plantio/plantio.selector";

const TableDataPage = (props) => {
	const { dataF, openAll, setTotalCountSelected, totalCountSelected, tipoAplicacao, dapApDestaque } = props;
	console.log('dataFFF: ', dataF)

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
	const [loadingMapKml, setLoadingMapKml] = useState(false);

	const [rotateDir, setRotateDir] = useState("270");

	const safraCiclo = useSelector(selectSafraCiclo);

	useEffect(() => {
		if (openAll) {
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

	const handlerSelectAllParcelas = () => {
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
			parcelas: idParcelasSelected,
			safra: safraCiclo
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
					console.log(res);
					setDisplayMap(res.data);
					const img = new Image();
					img.src = res.data;
					img.onload = () => {
						console.log('img heihg: ', img.height);
						console.log('img width: ', img.width);
					};
				});
		} catch (err) {
			console.log("Erro ao alterar as aplicações", err);
		} finally {
			setLoadingMap(false);
		}
	};

	const handleGenerateKml = async (idFarm, dataFarm) => {
		console.log("dataFarmmm", dataFarm)
		const params = JSON.stringify({
			projeto: [idFarm],
			parcelas: idParcelasSelected,
			safra: safraCiclo
		});
		console.log('paramsss: ', params)
		setLoadingMapKml(true);
		try {
			const res = await djangoApi.post("plantio/get_kmls_aviacao/", params, {
				headers: {
					Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
				},
			});
			// Handle KML file download
			const downloadKMLFile = () => {
				const kmlDataUri = res.data.data.kml; // Accessing the KML data URI from the nested 'data'
				const link = document.createElement('a');
				link.href = kmlDataUri; // Set the KML data URI as the link href
				link.download = `${dataFarm.fazenda.replace('Fazenda ', '')}_${dataFarm.app}.kml`; // Set the filename for download
				document.body.appendChild(link); // Append link to body
				link.click(); // Trigger the download
				document.body.removeChild(link); // Clean up by removing the link
			};

			// Call the download function to initiate the download
			downloadKMLFile(); // Call this function to initiate the download
		} catch (err) {
			console.log("Erro ao alterar as aplicações", err);
			setLoadingMapKml(false);
		} finally {
			setLoadingMapKml(false);
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
	const handleSelectAreaAp = (data) => {
		setTotalCountSelected(prevData => {
			const { fazenda, app, area, areaAplicada, saldoAplicar } = data;
			const objToAdd = {
				app,
				area: Number(area),
				areaAplicada: Number(areaAplicada),
				saldoAplicar: Number(saldoAplicar)
			};

			const newData = { ...prevData };

			// Ensure `fazenda` exists in newData as an array
			if (!newData[fazenda]) {
				newData[fazenda] = [];
			}

			// Check if the `app` already exists in the array
			const index = newData[fazenda].findIndex(item => item.app === app);

			if (index !== -1) {
				// If found, remove it
				newData[fazenda].splice(index, 1);

				// If `fazenda` has no more apps, remove it as well
				if (newData[fazenda].length === 0) {
					delete newData[fazenda];
				}
			} else {
				// If not found, add it to the array
				newData[fazenda].push(objToAdd);
			}

			return newData;
		});
	};
	return (
		<div
			style={{
				width: "98%",
				backgroundColor: totalCountSelected.filter((data) => data.app === dataF.app).length > 0 ? 'rgba(11,156,49,0.2)' : colors.blueOrigin[700],
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
						<img
							className={classes.imgFarmDiv}
							src={filteredIcon(dataF?.cultura)}
							alt={filteredAlt(dataF?.cultura)}
						/>
						<p style={{ ...warningColor(opTipo) }}>{opTipo}</p>
					</div>
					{tipoAplicacao && (
						<Typography variant="caption" sx={{ opacity: 0.9 }}>
							{tipoAplicacao === "Operacao" ? "Operação" : tipoAplicacao === "Solido" ? "Sólido" : "Líquido"}
						</Typography>
					)}
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
					<p style={{ cursor: 'pointer', textAlign: "right", paddingRight: 26  }} onClick={() => handleSelectAreaAp(dataF)}>
						{Number(dataF.area).toLocaleString("pt-br", {
							minimumFractionDigits: 0,
							maximumFractionDigits: 0
						})}
					</p>
					<p style={{ textAlign: "right", paddingRight: 16 }}>

						{
							Number(dataF.areaAplicada) === 0 ? " - " :
								Number(dataF.areaAplicada).toLocaleString("pt-br", {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0
								})
						}
					</p>
					<p style={{ textAlign: "right", paddingRight: 6 }}>

						{
							Number(dataF.saldoAplicar) === 0 ? " - " :

								Number(dataF.saldoAplicar).toLocaleString("pt-br", {
									minimumFractionDigits: 0,
									maximumFractionDigits: 0
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
							tipoAplicacao={tipoAplicacao}
							dapApDestaque={dapApDestaque}
						/>
					</Box>
					<Box
						sx={{
							padding: '10px'
						}}
					>
						<Typography sx={{ fontStyle: 'italic' }} variant="h6" color={colors.grey[200]}>
							{dataF.observations === 'Aplicação Aberta via integração' ? '' : dataF.observations}
						</Typography>
					</Box>
					<Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginBottom: '-50px', paddingRight: '10px', gap: '10px' }}>
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
						<IconButton
							disabled={idParcelasSelected?.length === 0}
							onClick={() =>
								handleGenerateKml(dataF.fazenda_box_id, dataF)
							}
							sx={{
								cursor: 'pointer'
							}}
						>
							{
								loadingMapKml ?
									<CircularProgress size={24} color="inherit" />
									:
									<FontAwesomeIcon
										icon={faPlane}
										color={idParcelasSelected?.length === 0 ? 'grey' : colors.textColor[100]}
										style={{
											cursor: "pointer"
										}}
									/>
							}

						</IconButton>
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
								{/* <IconButton
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
								</IconButton> */}
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
						<Box display={"flex"} justifyContent={"center"} >
							<img
								src={displayMap}
								alt="Italian Trulli"
								style={{
									width: "500px",
									height: '500px',
									objectFit: "contain"
								}}
							/>
							<Box>
								{/* <FontAwesomeIcon
									onClick={handleRotateDir}
									icon={faArrowRotateRight}
									color={colors.textColor[100]}
									style={{
										cursor: "pointer"
									}}
								/> */}
							</Box>
						</Box>
					)}
				</div>
			</Grow>
		</div>
	);
};

export default TableDataPage;
