import { Box, CircularProgress, Typography, useTheme } from "@mui/material";
import { useEffect } from "react";
import { LoaderIcon } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import { tokens } from "../../theme";

const PageNotFound = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			navigate("/");
		}, 1500);
	}, []);

	return (
		<Box
			display={"flex"}
			flexDirection={"column"}
			gap={10}
			justifyContent={"center"}
			alignItems={"center"}
			width={"100%"}
			height={"100%"}
			sx={{ backgroundColor: colors.blueOrigin[900] }}
		>
			<Typography variant="h1">
				Pagina não encontrada, redirecionando....
			</Typography>
			<CircularProgress sx={{ color: "whitesmoke" }} />
		</Box>
	);
};

export default PageNotFound;
