import classes from "./farmbox.module.css";

import { useTheme, Slide, Divider } from "@mui/material";
import Grow from "@mui/material/Grow";

import { tokens } from "../../../theme";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import question from "../../../utils/assets/icons/question.png";

import ProgressBarPage from "./progress-bar";

import ProgressCircularPage from "./progress-circular";
import DetailAppData from "./table-data-app-detail";
import { useState } from "react";

import { useRef } from "react";

const TableDataPage = (props) => {
	const { dataF } = props;
	const [showDetail, setShowDetail] = useState(false);

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

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
					<DetailAppData data={dataF} />
				</div>
			</Grow>
		</div>
	);
};

export default TableDataPage;
