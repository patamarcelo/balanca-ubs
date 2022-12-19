import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { selectTruckLoads } from "../../store/trucks/trucks.selector";
import { useSelector } from "react-redux";
import ReportTable from "../../components/report-itens/report-table";

const ReportPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dataTable = useSelector(selectTruckLoads);

	console.log("Datatable from report: ", dataTable);

	return (
		<Box
			width="100%"
			height="80%"
			sx={{
				padding: '',
			}}
		>
			<Typography variant="h3" color={colors.blueAccent[600]} p="2px" >
				Relatório
			</Typography>
			<ReportTable dataTable={dataTable} />
		</Box>
	);
};

export default ReportPage;
