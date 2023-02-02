import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const SendSeed = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box>
			<Typography variant="h1" color={colors.blueAccent[300]}>
				REPORT SEND PAGE
			</Typography>
		</Box>
	);
};

export default SendSeed;
