import { Box, Typography } from "@mui/material";
import styles from "./produtividade.module.css";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import beans from "../../../utils/assets/icons/beans2.png";
import soy from "../../../utils/assets/icons/soy.png";
import rice from "../../../utils/assets/icons/rice.png";

const ListPage = (props) => {
	const { filteredArray, printPage } = props;

	const iconDict = [
		{ cultura: "Feijão", icon: beans, alt: "feijao" },
		{ cultura: "Arroz", icon: rice, alt: "arroz" },
		{ cultura: "Soja", icon: soy, alt: "soja" }
	];

	const filteredAlt = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data.variedade__cultura__cultura
		);

		if (filtered.length > 0) {
			return filtered[0].alt;
		}
		return "";
	};

	const filteredIcon = (data) => {
		const filtered = iconDict.filter(
			(dictD) => dictD.cultura === data.variedade__cultura__cultura
		);

		if (filtered.length > 0) {
			return filtered[0].icon;
		}
		return "";
	};

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<>
			<div
				className={styles.mainContainer}
				style={{
					backgroundColor: colors.blueOrigin[700],
					maxHeight: printPage ? "" : "650px"
				}}
			>
				{filteredArray &&
					filteredArray
						.filter(
							(data) =>
								data.finalizado_plantio === true &&
								data.variedade__cultura__cultura !== "Milheto"
						)
						.sort((b, a) => {
							const aprodutividade = a.produtividade
								? a.produtividade
								: 0;
							const bProdutividade = b.produtividade
								? b.produtividade
								: 0;

							return aprodutividade - bProdutividade;
						})
						.map((data, i) => {
							// console.log(data);
							const areaConsider =
								data.finalizado_colheita === true
									? data.area_colheita
									: data.area_parcial;
							const colorShadow = data.finalizado_colheita
								? "rgba(10, 201, 29, 0.65) 0px 2px 3px"
								: data.peso_kg > 0
								? "rgb(224, 238, 34) 0px 2px 3px"
								: "rgba(0, 0, 0, 0.65) 0px 4px 5px";
							return (
								<Box
									key={i}
									className={styles.innerContainer}
									sx={{
										backgroundColor: colors.blueOrigin[800],
										borderRadius: "8px",
										padding: "3px 15px",
										display: "flex",
										margin: "0px 10px",
										flexDirection: "row",
										justifyContent: "space-between",
										alignItems: "center",
										boxShadow: colorShadow
									}}
								>
									<div
										style={{
											width: "80%"
											// backgroundColor: "red"
										}}
									>
										<div
											style={{
												width: "100%",
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center"
											}}
										>
											<span
												style={{
													marginRight: "100px",
													fontWeight: "bold"
												}}
											>
												{data.talhao__id_talhao}
												<img
													className={styles.imgIcon}
													src={filteredIcon(data)}
													alt={filteredAlt(data)}
												/>
											</span>
											<span>
												{areaConsider?.toLocaleString(
													"pt-br",
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2
													}
												)}{" "}
												ha
											</span>
										</div>
										<div
											style={{
												width: "100%",
												height: "0.5px",
												backgroundColor:
													colors.primary[200]
											}}
										>
											{/* <hr
											style={{ backgroundColor: "grey" }}
										/> */}
										</div>
										<div
											className={styles.cargasData}
											style={{
												width: "100%",
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center"
											}}
										>
											<span
												style={{
													minWidth: "40%"
												}}
											>
												{data.variedade__nome_fantasia}
											</span>

											<span>
												{data?.peso_scs?.toLocaleString(
													"pt-br",
													{
														minimumFractionDigits: 2,
														maximumFractionDigits: 2
													}
												)}{" "}
												Scs
											</span>
										</div>
									</div>

									<div className={styles.scsDiv}>
										<div>
											{data?.produtividade?.toLocaleString(
												"pt-br",
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}
											)}
										</div>
										<div>
											<p
												style={{
													color: colors.primary[200]
												}}
											>
												Scs/ha
											</p>
										</div>
									</div>
								</Box>
							);
						})}
			</div>
		</>
	);
};

export default ListPage;
