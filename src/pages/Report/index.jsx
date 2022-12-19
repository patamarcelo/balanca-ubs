import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import {
	selectTruckLoads,
	selectTruckLoadsFormatData
} from "../../store/trucks/trucks.selector";
import { useSelector } from "react-redux";
import ReportTable from "../../components/report-itens/report-table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getTruckMoves } from "../../utils/firebase/firebase.datatable";
import { setTruckLoads } from "../../store/trucks/trucks.actions";

const ReportPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dataTable = useSelector(selectTruckLoads);
	const dataTableForm = useSelector(selectTruckLoadsFormatData);

	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(false);

	console.log("dataTable: ", dataTable.lenght);
	useEffect(() => {
		const getData = async () => {
			console.log(
				"pegando os dados do report",
				dataTable.lenght,
				dataTable
			);
			setIsLoading(true);
			const data = await getTruckMoves();
			console.log("from d: ", data);
			dispatch(setTruckLoads(data));
			setIsLoading(false);
		};
		if (dataTable.lenght === undefined) {
			getData();
		}
	}, []);

	return (
		<Box
			width="100%"
			height="92%"
			sx={{
				padding: ""
			}}
		>
			<Typography variant="h3" color={colors.blueAccent[600]} p="2px">
				Relatório
			</Typography>
			<ReportTable dataTable={dataTableForm} isLoading={isLoading} />
		</Box>
	);
};

export default ReportPage;
