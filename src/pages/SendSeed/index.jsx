import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useSelector } from "react-redux";
import { selectTruckSendSeed } from "../../store/trucks/trucks.selector";

const SendSeed = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const sendSeedData = useSelector(selectTruckSendSeed);

	console.table("SendSeedData: ", sendSeedData);
	return (
		<Box>
			<Typography variant="h1" color={colors.blueAccent[300]}>
				REPORT SEND PAGE
			</Typography>
		</Box>
	);
};

export default SendSeed;
