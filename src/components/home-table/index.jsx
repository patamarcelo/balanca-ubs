import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const HomeTable = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	return (
		<Box
		>
			<Typography variant="h2" color={colors.yellow[700]} sx={{fontWeight: 'bold'}}>
				SEM CARGAS NO PÁTIO   
            </Typography>
		</Box>
	);
};

export default HomeTable;
