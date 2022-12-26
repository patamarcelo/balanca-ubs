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

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

const ReportPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const dataTable = useSelector(selectTruckLoads);
	const dataTableForm = useSelector(selectTruckLoadsFormatData);

	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [saved, handlerSave] = useState(0);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.truckmove);
		const q = query(collRef, orderBy("createdAt"));
		onSnapshot(q, (snapshot) => {
			dispatch(
				setTruckLoads(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						id: doc.id
					}))
				)
			);
		});
		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	}, []);

	return (
		<Box
			minWidth="100%"
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
