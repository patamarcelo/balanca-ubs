import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { getDataMongoDb } from "../../utils/mongodb/mongodb.database";
import { useEffect } from "react";

const CantinaPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	useEffect(() => {
		getDataMongoDb();
	}, []);

	return (
		<Box>
			<Typography variant="h2" color={colors.blueAccent[600]}>
				Cantina
			</Typography>
		</Box>
	);
};

export default CantinaPage;
