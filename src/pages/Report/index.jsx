import { Box, useTheme } from "@mui/material";
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
	const [saved, handlerSave] = useState(0);

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			const data = await getTruckMoves();
			dispatch(setTruckLoads(data));
			setIsLoading(false);
		};
		if (dataTable.lenght === undefined) {
			getData();
		}
	}, []);

	useEffect(() => {
		const getData = async () => {
			setIsLoading(true);
			const data = await getTruckMoves();
			dispatch(setTruckLoads(data));
			setIsLoading(false);
		};
		getData();
	}, [saved, dispatch]);

	return (
		<Box
			width="100%"
			height="92%"
			sx={{
				padding: ""
			}}
		>
			<ReportTable
				handlerSave={handlerSave}
				dataTable={dataTableForm}
				isLoading={isLoading}
				saved={saved}
			/>
		</Box>
	);
};

export default ReportPage;
