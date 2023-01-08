import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import useMediaQuery from "@mui/material/useMediaQuery";

const DestinoTruck = (props) => {
	const { data } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isNonMobile = useMediaQuery("(min-width: 900px)");

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
			sx={{
				whiteSpace: !isNonMobile && "nowrap"
			}}
		>
			<>
				<Typography
					variant="h6"
					color={colors.primary[300]}
					sx={{ fontStyle: "italic" }}
				>
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
