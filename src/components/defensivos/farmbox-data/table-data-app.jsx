import classes from "./farmbox.module.css";
import LinearProgress, {
	linearProgressClasses
} from "@mui/material/LinearProgress";
import { styled } from "@mui/material/styles";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

const BorderLinearProgress = styled(LinearProgress)(({ theme, barColor }) => ({
	height: 8,
	borderRadius: 5,
	[`&.${linearProgressClasses.colorPrimary}`]: {
		backgroundColor:
			theme.palette.grey[theme.palette.mode === "light" ? 200 : 500]
	},
	[`& .${linearProgressClasses.bar}`]: {
		borderRadius: 5,
		backgroundColor: barColor
		// backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8"
	}
}));

const TableDataPage = (props) => {
	const { dataF } = props;
	console.log(dataF);

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
	const barColor = (aplicado, progressRealNumber) => {
		console.log(aplicado);
		if (aplicado < 100) {
			return "rgb(255,255,0,0.7)";
		}

		if (progressRealNumber > 100) {
			return "red";
		}
		return "rgb(0,128,0,0.9)";
	};

	return (
		<div
			style={{ width: "100%", backgroundColor: colors.blueOrigin[700] }}
			className={classes.mainDivApp}
		>
			<div className={classes.appDiv}>
				<div className={classes.labelDivApp}>
					<p>{dataF.app}</p>
					<div>
						<p style={{ ...warningColor(opTipo) }}>{opTipo}</p>
						<img
							src={filteredIcon(dataF?.cultura)}
							alt={filteredAlt(dataF?.cultura)}
						/>
					</div>
				</div>
				<div className={classes.numberDivApp}>
					<p>{dataF.area}</p>
					<p>{dataF.areaAplicada}</p>
					<p>{dataF.saldoAplicar}</p>
				</div>
			</div>
			<div className={classes.progressApp}>
				<div style={{ width: "90%" }}>
					<BorderLinearProgress
						variant="determinate"
						value={progressNumber}
						barColor={barColor(progressNumber, progressRealNumber)}
					/>
				</div>
				<div
					style={{
						color: colors.primary[100],
						fontSize: "0.8rem",
						fontStyle: "italic"
					}}
				>
					{progressRealNumber} %
				</div>
			</div>
			<div
				className={classes.dateDiv}
				style={{
					color: colors.primary[100]
				}}
			>
				<div>{dataF.date.split("-").reverse().join("/")}</div>
				<div>{dataF.endDate.split("-").reverse().join("/")}</div>
			</div>
		</div>
	);
};

export default TableDataPage;
