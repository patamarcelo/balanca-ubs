import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import styles from "./programas-styles.module.css";

const ConsolidadosProdutos = (props) => {
	const { filteredOperations, quantidadeTotal, program } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<>
			<Box
				sx={{
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					alignItems: "center",
					padding: "10px 10px",
					width: "60%",
					backgroundColor: colors.blueOrigin[500],
					marginBottom: "20px",
					borderRadius: "8px",
					boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px"
				}}
			>
				<Typography variant="h2" color={"white"}>
					Insumos Consolidados
				</Typography>
				<Typography variant="h6" color={"white"}>
					{program}
				</Typography>
			</Box>
			<Box
				sx={{
					color: "black",
					width: "60%",
					display: "flex",
					justifyContent: "center",
					flexDirection: "column",
					justifySelf: "center",
					boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 15px",
					borderRadius: "8px",
					padding: "10px",
					backgroundColor: "white"
				}}
			>
				<div
					className={styles.consolidadoProdutosMainContainerHeader}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						textAlign: "center",
						fontWeight: "bold"
					}}
				>
					<div>Insumo</div>
					<div>Quantidade Total</div>
					<div>Tipo</div>
				</div>

				{filteredOperations &&
					Object.entries(filteredOperations).map(([key, value]) => {
						const totalProduct = value.value * quantidadeTotal;
						return (
							<div
								key={key}
								className={
									styles.consolidadoProdutosMainContainer
								}
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(3, 1fr)",
									textAlign: "center"
								}}
							>
								<div>{key}</div>
								<div>
									{totalProduct.toLocaleString("pt-br", {
										minimumFractionDigits: 0,
										maximumFractionDigits: 0
									})}
								</div>
								<div style={{ textTransform: "capitalize" }}>
									{value["tipo"]}
								</div>
							</div>
						);
					})}
			</Box>
		</>
	);
};

export default ConsolidadosProdutos;
