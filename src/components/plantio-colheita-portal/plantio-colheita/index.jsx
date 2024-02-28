import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import HeaderFarm from "./header-farm";
import TableColheita from "./table";

const ColheitaAtual = (props) => {
	const { filteredFarm, selectedFarm, handlerFilter, selectedFilteredData } =
		props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
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
