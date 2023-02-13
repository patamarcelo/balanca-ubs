import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const NoDataShow = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			width="100%"
			height="100%"
			sx={{
				paddingTop: "40px",
				paddingBottom: "40px",
				backgroundColor: "rgba(36, 183, 4, 0.384);"
			}}
		>
			<Typography variant="h1" color={colors.primary[100]}>
				Sem Movimento e Sem Pendência
			</Typography>
		</Box>
	);
};
export default NoDataShow;
