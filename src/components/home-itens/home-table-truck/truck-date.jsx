import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

const DateTruck = (props) => {
	const { entrada, data } = props;

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	let atTime;
	let formatDate;
	if (entrada) {
		const newDate = new Date(
			entrada.seconds * 1000 + entrada.nanoseconds / 1000000
		);

		const date = newDate.toISOString().split("T")[0];
		atTime = newDate.toLocaleTimeString();
		const [year, month, day] = date.split("-");
		formatDate = [day, month, year].join("/");
	} else {
		const newDate = new Date(
			data.createdAt.seconds * 1000 + data.createdAt.nanoseconds / 1000000
		);

		const date = newDate.toISOString().split("T")[0];
		atTime = newDate.toLocaleTimeString();
		const [year, month, day] = date.split("-");
		formatDate = [day, month, year].join("/");
	}
	if(data?.syncDate){
		const newDate = new Date(
			data?.syncDate.seconds * 1000 + data?.syncDate.nanoseconds / 1000000
		);

		const date = newDate.toISOString().split("T")[0];
		atTime = newDate.toLocaleTimeString();
		const [year, month, day] = date.split("-");
		formatDate = [day, month, year].join("/");
	}

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
