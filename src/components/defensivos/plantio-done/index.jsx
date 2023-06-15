import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import classes from "./plantio-done-page.module.css";

const PlantioDonePage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box className={classes.container}>
			<Typography variant="h1" color={colors.primary[200]}>
				Dados de Área Plantada
			</Typography>
		</Box>
	);
};
export default PlantioDonePage;
