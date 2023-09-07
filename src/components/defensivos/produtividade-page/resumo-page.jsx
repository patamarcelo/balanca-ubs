import styles from "./produtividade.module.css";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ResumoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { filtCult } = props;
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

	return (
		<div className={styles.prodSummary}>
			{Object.keys(filtCult).map((data, i) => {
				const peso = filtCult[data].peso;
				const area = filtCult[data].area;
				const scs = peso / 60;
				const prod = scs / area;
				return (
					<div className={styles.mainInfoContainer} key={i}>
						<div className={styles.imageInfoContainer}>
							<img
								src={filteredIcon(data)}
								alt={filteredAlt(data)}
							/>
						</div>
						<div className={styles.dataInfoContainer}>
							<div>
								<p>
									{(peso / 60).toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}{" "}
									Scs
								</p>
								<div
									style={{
										width: "100%",
										height: "0.5px",
										backgroundColor: colors.primary[200]
									}}
								/>
								<p>
									{area.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}{" "}
									ha
								</p>
							</div>
							<div className={styles.dataInfoContainerProd}>
								<div>
									{prod.toLocaleString("pt-br", {
										minimumFractionDigits: 2,
										maximumFractionDigits: 2
									})}
								</div>
								<div
									style={{
										fontSize: "12px",
										color: colors.primary[200],
										marginTop: "-5px"
									}}
								>
									Scs/ha
								</div>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default ResumoPage;
