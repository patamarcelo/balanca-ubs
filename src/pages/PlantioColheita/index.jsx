import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import styles from "./PlantioColheita.module.css";

const PlantioColheitaPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
			className={styles["main-container"]}
			sx={{ backgroundColor: colors.blueOrigin[800] }}
		>
			<Typography variant="h1" color={colors.textColor[100]}>
				Pagina com informações do plantio e da colheita
			</Typography>
		</Box>
	);
};

export default PlantioColheitaPage;
