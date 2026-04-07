import { Box, Typography, useTheme, IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { tokens } from "../../../theme";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import styles from "./programas-styles.module.css";

const ConsolidadosProdutos = (props) => {
	const { filteredOperations, quantidadeTotal, program } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const handleExportExcel = () => {
		if (!filteredOperations) return;

		const data = Object.entries(filteredOperations).map(([key, value]) => {
			const totalProduct = value.value * quantidadeTotal;

			return {
				Insumo: key,
				"Quantidade Total": Number(totalProduct.toFixed(0)),
				Tipo: value.tipo,
			};
		});

		const worksheet = XLSX.utils.json_to_sheet(data);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "Insumos");

		const excelBuffer = XLSX.write(workbook, {
			bookType: "xlsx",
			type: "array",
		});

		const file = new Blob([excelBuffer], {
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
		});

		saveAs(file, `insumos_consolidados_${program}.xlsx`);
	};

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
					boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px",
					position: "relative",
				}}
			>
				{/* BOTÃO EXCEL */}
				<IconButton
					onClick={handleExportExcel}
					sx={{
						position: "absolute",
						right: 10,
						top: 10,
						color: "white",
						backgroundColor: "rgba(255,255,255,0.15)",
						"&:hover": {
							backgroundColor: "rgba(255,255,255,0.3)",
						},
					}}
				>
					<DownloadIcon />
				</IconButton>

				<Typography variant="h2" color={"white"} sx={{ marginBottom: "-5px" }}>
					Insumos Consolidados
				</Typography>
				<Typography variant="h6" color={colors.primary[100]}>
					{program}
				</Typography>
			</Box>

			<Box
				sx={{
					color: "black",
					width: "60%",
					display: "flex",
					flexDirection: "column",
					boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px",
					borderRadius: "8px",
					padding: "10px",
					backgroundColor: "white",
				}}
			>
				<div
					className={styles.consolidadoProdutosMainContainerHeader}
					style={{
						display: "grid",
						gridTemplateColumns: "repeat(3, 1fr)",
						textAlign: "center",
						fontWeight: "bold",
					}}
				>
					<div style={{ textAlign: "left" }}>Insumo</div>
					<div>Quantidade Total</div>
					<div>Tipo</div>
				</div>

				{filteredOperations &&
					Object.entries(filteredOperations).map(([key, value]) => {
						const totalProduct = value.value * quantidadeTotal;

						return (
							<div
								key={key}
								className={styles.consolidadoProdutosMainContainer}
								style={{
									display: "grid",
									gridTemplateColumns: "repeat(3, 1fr)",
									textAlign: "center",
								}}
							>
								<div>{key}</div>
								<div>
									{totalProduct.toLocaleString("pt-br", {
										minimumFractionDigits: 0,
										maximumFractionDigits: 0,
									})}
								</div>
								<div style={{ textTransform: "capitalize" }}>
									{value.tipo}
								</div>
							</div>
						);
					})}
			</Box>
		</>
	);
};

export default ConsolidadosProdutos;