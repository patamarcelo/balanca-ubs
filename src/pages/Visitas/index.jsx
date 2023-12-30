import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const VisitasPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box>
			<Typography variant="h2" color={colors.blueAccent[500]}>
				Pagina das visitas
			</Typography>
		</Box>
	);
};

export default VisitasPage;
