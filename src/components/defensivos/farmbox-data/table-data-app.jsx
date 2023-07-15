import classes from "./farmbox.module.css";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

import ProgressBarPage from "./progress-bar";

import ProgressCircularPage from "./progress-circular";

const TableDataPage = (props) => {
	const { dataF } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
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
		>
			<div className={classes.appDiv}>
				<div className={classes.labelDivApp}>
					<p>
						{dataF.app.slice(0, 2)} {dataF.app.slice(2)}
					</p>
					<div className={classes.tipoDivApp}>
						<p style={{ ...warningColor(opTipo) }}>{opTipo}</p>
						<img
							src={filteredIcon(dataF?.cultura)}
							alt={filteredAlt(dataF?.cultura)}
						/>
					</div>
					<div
						className={classes.dateDiv}
						style={{
							color: colors.primary[100]
						}}
					>
						<div>{dataF.date.split("-").reverse().join("/")}</div>
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
		</div>
	);
};

export default TableDataPage;
