import { Box, Typography } from "@mui/material";
import styles from "./produtividade.module.css";

import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const ListPage = (props) => {
	const { filteredArray, projeto } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<>
			<Typography
				variant="h3"
				color={colors.primary[100]}
				sx={{
					textAlign: "center",
					padding: "5px",
					fontWeight: "bold",
					marginBottom: "10px"
				}}
				className={styles.titleProdutividade}
			>
				{projeto}
			</Typography>

			<div
				className={styles.mainContainer}
				style={{
					backgroundColor: colors.blueOrigin[700]
				}}
			>
				{filteredArray &&
					filteredArray
						.filter(
							(data) =>
								data.finalizado_plantio === true &&
								data.peso_kg > 0
						)
						.sort((b, a) => a.produtividade - b.produtividade)
						.map((data, i) => {
							const areaConsider =
								data.finalizado_colheita === true
									? data.area_colheita
									: data.area_parcial;
							return (
								<Box
									key={i}
									className={styles.innerContainer}
									sx={{
										backgroundColor: colors.blueOrigin[800],
										borderRadius: "8px",
										padding: "3px 15px",
										margin: "10px 5px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "space-between",
										alignItems: "center",
										boxShadow:
											"rgba(0, 0, 0, 0.65) 0px 2px 2px"
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
										<span style={{ marginRight: "100px" }}>
											{data.talhao__id_talhao}
										</span>
										<span className={styles.produtividade}>
											{data?.produtividade?.toLocaleString(
												"pt-br",
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}
											)}{" "}
											Scs/ha
										</span>
									</div>
									<div style={{ width: "100%" }}>
										<hr />
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
										<span>
											{data?.peso_kg?.toLocaleString(
												"pt-br",
												{
													minimumFractionDigits: 2,
													maximumFractionDigits: 2
												}
											)}{" "}
											Kg
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
								</Box>
							);
						})}
			</div>
		</>
	);
};

export default ListPage;
