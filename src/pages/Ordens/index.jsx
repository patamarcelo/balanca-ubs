import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { getDataMongoDb } from "../../utils/mongodb/mongodb.database";
import { useEffect } from "react";

import HomeOrdemPage from "../../components/ordens/home-ordens/index";

const OrdemPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	useEffect(() => {
		getDataMongoDb();
	}, []);

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%"
			}}
		>
			<Typography
				variant="h2"
				color={colors.blueAccent[600]}
				mb={1}
				ml={1}
			>
				Ordens de Carregamento
			</Typography>
			<Box
				sx={{
					width: "100%",
					height: "92%",
					// border: "1px solid whitesmoke",
					borderRadius: "8px",
					marginBottom: "10px"
				}}
			>
				<HomeOrdemPage />
			</Box>
		</Box>
	);
};

export default OrdemPage;
