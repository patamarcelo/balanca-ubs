import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useSelector } from "react-redux";
import { selectTruckSendSeed } from "../../store/trucks/trucks.selector";

import RetrieveData from "../../components/send-seed/retrieve-data";

const SendSeed = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const sendSeedData = useSelector(selectTruckSendSeed);

	console.table("SendSeedData: ", sendSeedData);
	return (
		<Box width="100%" height="98%">
			<Typography variant="h6" color={colors.primary[300]}>
				Planilha Google
			</Typography>
			<Box width="100%" height="98%">
				<RetrieveData />
			</Box>
		</Box>
	);
};

export default SendSeed;
