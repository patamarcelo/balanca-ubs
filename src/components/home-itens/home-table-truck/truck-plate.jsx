import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const PlateTruck = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const placaFormat = data?.placa?.toUpperCase().slice(0, 3) + "-" +  data?.placa?.toUpperCase().slice(-4)
	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
		>
			<Typography variant="h6" color={colors.primary[100]}>
				{placaFormat}
			</Typography>
			<Typography variant="h6" color={colors.primary[100]}>
				{data.motorista}
			</Typography>

		</Box>
	);
};

export default PlateTruck;
