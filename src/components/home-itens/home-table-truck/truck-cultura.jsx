import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const CulturaTruck = (props) => {
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
				<Typography variant="h5" color={colors.primary[100]}>
					Cultura
				</Typography>
				<Typography variant="h5" color={colors.primary[100]}>
					{data.cultura}
				</Typography>
			</>
		</Box>
	);
};

export default CulturaTruck;
