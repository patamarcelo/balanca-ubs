import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

// import { useState } from "react";

const TableOrdensPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			display="flex"
			justifyContent="center"
			alignItems="center"
			mt={2}
			sx={{
				width: "100%",
				height: "100%",
				padding: "10px",
				backgroundColor: colors.blueOrigin[700],
				borderRadius: "8px"
			}}
		>
			<Typography variant="h1" color={colors.primary[200]}>
				TABLE DE ORDENS
			</Typography>
		</Box>
	);
};

export default TableOrdensPage;
