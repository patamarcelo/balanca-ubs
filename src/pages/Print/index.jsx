import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useLocation } from "react-router-dom";
import PrintLayout from "../../components/print-itens";
import { useRef } from "react";

import { useReactToPrint } from "react-to-print";

const PrintPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { state } = useLocation();

	const { data } = state;
	console.log("Data from Print Page: ", data);
	return (
		<Box
			display="flex"
			justifyContent="center"
			flexDirection="column"
			alignItems="center"
			sx={{
				width: "100%",
				height: "100%"
			}}
		>
			{/* <Typography variant="text" color={colors.blueAccent[700]}>
				Página de Impressão
			</Typography> */}

			<PrintLayout />
		</Box>
	);
};

export default PrintPage;
