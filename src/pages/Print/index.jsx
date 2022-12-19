import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from 'react-router-dom';


const PrintPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation()
	const { data } = state
	console.log('Data from Print Page: ', data)
	return (
		<Box
        
        >
			<Typography variant="text" color={colors.blueAccent[700]}>
				Página de Impressão
			</Typography>
		</Box>
	);
};

export default PrintPage;
