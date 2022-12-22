import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const DestinoTruck = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
		>
			<>
				<Typography variant="h6" color={colors.primary[300]} sx={{fontStyle: 'italic'}}>
					Destino
				</Typography>
				<Typography variant="h6" color={colors.primary[100]}>
					{data.destino}
				</Typography>
			</>
		</Box>
	);
};

export default DestinoTruck;
