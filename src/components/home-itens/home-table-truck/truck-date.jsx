import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const DateTruck = (props) => {
	const { entrada } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const newDate = new Date(
		entrada.seconds * 1000 + entrada.nanoseconds / 1000000
	);

	const date = newDate.toISOString().split("T")[0];
	const atTime = newDate.toLocaleTimeString();
	const [year, month, day] = date.split("-");
	const formatDate = [day, month, year].join("/");

	return (
		<Box
			display="flex"
			flexDirection="column"
			justifyContent="space-around"
			alignItems="center"
		>
			<Typography variant="h6" color={colors.primary[100]}>
				{formatDate}
			</Typography>
			<Typography variant="h6" color={colors.greenAccent[300]}>
				{atTime}
			</Typography>
		</Box>
	);
};

export default DateTruck;
