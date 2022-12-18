import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { selectTruckLoads } from '../../store/trucks/trucks.selector'
import { useSelector } from "react-redux";

const ReportPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dataTable = useSelector(selectTruckLoads)

	console.log('Datatable from report: ', dataTable)

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%"
			}}
		>
			<Typography variant="h6" color={colors.primary[100]}>
				Report Page
			</Typography>
		</Box>
	);
};

export default ReportPage;
