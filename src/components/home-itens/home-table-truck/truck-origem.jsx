import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const OrigemTruck = (props) => {
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
					Origem
				</Typography>
				<Typography variant="h6" color={colors.primary[100]}>
					{data.origem}
				</Typography>
			</>
		</Box>
	);
};

export default OrigemTruck;
