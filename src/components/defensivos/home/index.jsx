import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import { useState } from "react";

import CircularProgress from "@mui/material/CircularProgress";

const HomeDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpen, setIsOpen] = useState(false);
	const { isLoadingHome } = props;

	return (
		<Box>
			<Typography variant="h2" color={colors.blueAccent[700]}>
				Pagina dos defensivos
			</Typography>
		</Box>
	);
};

export default HomeDefensivoPage;
