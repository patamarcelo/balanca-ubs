import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import HeaderFarm from "./header-farm";
import TableColheita from "./table";

import { useEffect, useState } from "react";

const ColheitaAtual = (props) => {
	const { filteredFarm, selectedFarm, handlerFilter, selectedFilteredData } =
		props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [areaTotal, setAreaTotal] = useState(0);
	const [parcelasTotal, setparcelasTotal] = useState(0);

	const formatArea = (number) => {
		return Number(number).toLocaleString("pt-br", {
			maximumFractionDigits: 2,
			minimumFractionDigits: 2
		});
	};
	useEffect(() => {
		let areaTotalSoma = 0;
		let parcelasTotalCount = 0;
		selectedFilteredData.forEach((data) => {
			areaTotalSoma += data.area_colheita;
			parcelasTotalCount += 1;
		});
		setAreaTotal(formatArea(areaTotalSoma));
		setparcelasTotal(parcelasTotalCount);
	}, [selectedFilteredData]);

	return (
		<Box
			width={"100%"}
			justifyContent={"flex-start"}
			alignItems={"flex-start"}
			display={"flex"}
			flexDirection={"column"}
			paddingLeft={6}
			paddingRight={6}
			paddingTop={2}
		>
			<Box
				sx={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "flex-start",
					gap: "10px",
					alignItems: "flex-start",
					width: "100%",
					marginBottom: "20px"
				}}
			>
				{filteredFarm
					.sort((a, b) => a.localeCompare(b))
					.map((farm, i) => {
						return (
							<HeaderFarm
								selectedFarm={selectedFarm}
								farm={farm}
								key={i}
								handlerFilter={handlerFilter}
							/>
						);
					})}
			</Box>
			<Box display={"flex"} flexDirection="column" mb={2}>
				<span>
					<b>Área Total:</b> {areaTotal}
				</span>
				<span>
					<b>Parcelas:</b> {parcelasTotal}
				</span>
			</Box>
			<Box
				sx={{
					justifySelf: "center",
					width: "100%",
					marginBottom: "10px",
					textAlign: "center",
					backgroundColor: "rgba(128,128,128,0.4)",
					padding: "10px"
				}}
			>
				<Typography
					variant="h4"
					color={colors.textColor[100]}
					sx={{ fontWeight: "bold" }}
				>
					{selectedFarm?.replace("Projeto", "")}
				</Typography>
			</Box>
			{selectedFilteredData.length > 0 && (
				<TableColheita
					data={selectedFilteredData.sort((b, a) => a.dap - b.dap)}
				/>
			)}
		</Box>
	);
};

export default ColheitaAtual;
