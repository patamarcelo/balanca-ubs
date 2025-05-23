import { Typography } from "@mui/material";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import styles from "./produtividade.module.css";
import ResumoPage from "./resumo-page";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

const HeaderPage = (props) => {
	const { selectedProject, filtCult, resumo, sumTotalSelected } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];

	const filteredAlt = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	const filteredIcon = (data) => {
		const filtered = iconDict.filter((dictD) => dictD.cultura === data);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};


	const formatProjectName = selectedProject
		.map((data, index) => (index > 0 ? `| ${data.replace('Projeto', '')}` : data.replace('Projeto', '')))
		.join(' ');


	return (
		<div className={styles.headerPageDiv}>
			<div className={styles.headerNameDiv}>
				<Typography
					// variant="h3"
					color={
						theme.palette.mode === "dark" ? "whitesmoke" : "black"
					}
					sx={{
						fontSize: "32px",
						textAlign: "left",
						padding: "5px",
						paddingLeft: "0px",
						marginLeft: "0px",
						fontWeight: "bold",
						// marginBottom: "10px",
						width: "100%"
						// backgroundColor: "red"
					}}
					className={styles.titleProdutividade}
				>
					{formatProjectName}
				</Typography>
				{/* <div
					className={styles.MainConteinerresumoByVar}
					style={{
						backgroundColor: colors.blueOrigin[800],
						padding: "10px 20px 10px 10px"
					}}
				>
					{Object.keys(resumo).map((data, i) => {
						const cultura = data.split("|")[0];
						const variedade = data.split("|")[1];
						const area = resumo[data].area;

						return (
							<div
								key={i}
								className={styles.resumoByVarContainer}
								style={{ color: colors.primary[100] }}
							>
								<img
									style={{ width: "20px", height: "20px" }}
									src={filteredIcon(cultura)}
									alt={filteredAlt(cultura)}
								/>
								<span>{variedade} |</span>
								<span>
									{area.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}{" "}
									ha
								</span>
							</div>
						);
					})}
				</div> */}
			</div>
			<ResumoPage
				filtCult={filtCult}
				sumTotalSelected={sumTotalSelected}
			/>
		</div>
	);
};

export default HeaderPage;
