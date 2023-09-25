import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { selectTruckLoadsFormatData } from "../../store/trucks/trucks.selector";
import { useSelector } from "react-redux";
import ReportTable from "../../components/report-itens/report-table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTruckLoads } from "../../store/trucks/trucks.actions";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import {
	selectUnidadeOpUser,
	selectIsAdminUser
} from "../../store/user/user.selector";

import { FAZENDA_ORIGEM } from "../../store/trucks/reducer.initials";

import { limit } from "firebase/firestore";

import Switch from "@mui/material/Switch";
import CircularProgress from "@mui/material/CircularProgress";

const ReportPage = () => {
	const dataTableForm = useSelector(selectTruckLoadsFormatData);

	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const [filteredTable, setFilteredTable] = useState([]);

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [saved, handlerSave] = useState(0);
	const [totalLoadData, setTotalLoadData] = useState(700);
	const [totalLoadDataStatus, setTotalLoadDataStatus] = useState(false);

	const isAdminUser = useSelector(selectIsAdminUser);

	const origemDest = [];
	const filteredOrigemDestino = FAZENDA_ORIGEM.filter(
		(data) => data.user === unidadeOpUser
	);
	filteredOrigemDestino.map((data) => {
		origemDest.push(data.local);
		return data;
	});

	const handleGetDataFromServer = (e) => {
		setTotalLoadDataStatus(e.target.checked);
		const statusCheck = e.target.checked;
		if (statusCheck) {
			console.log("postiivo");
			setTotalLoadData(3000);
		}
		if (!statusCheck) {
			setTotalLoadData(700);
		}
	};

	useEffect(() => {
		if (unidadeOpUser === "ubs") {
			setFilteredTable(dataTableForm);
		} else {
			const filteredTable = dataTableForm.filter(
				(data) =>
					data.unidadeOp === unidadeOpUser ||
					origemDest.includes(data.fazendaDestino) ||
					origemDest.includes(data.fazendaOrigem)
			);
			setFilteredTable(filteredTable);
		}
	}, [dataTableForm, unidadeOpUser]);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.truckmove);
		const q = query(collRef, orderBy("createdAt", "desc"), limit(700));
		onSnapshot(q, (snapshot) => {
			dispatch(
				setTruckLoads(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						id: doc.id,
						unidadeOp: doc.data().unidadeOp
							? doc.data().unidadeOp
							: "ubs"
					}))
				)
			);
		});
		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	}, []);

	useEffect(() => {
		setIsLoading(true);
		const collRef = collection(db, TABLES_FIREBASE.truckmove);
		const q = query(
			collRef,
			orderBy("createdAt", "desc"),
			limit(totalLoadData)
		);
		onSnapshot(q, (snapshot) => {
			dispatch(
				setTruckLoads(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						id: doc.id,
						unidadeOp: doc.data().unidadeOp
							? doc.data().unidadeOp
							: "ubs"
					}))
				)
			);
		});
		setTimeout(() => {
			setIsLoading(false);
		}, 800);
	}, [totalLoadData, dispatch]);

	return (
		<Box
			minWidth="100%"
			height="98%"
			sx={{
				padding: ""
			}}
		>
			{isAdminUser && (
				<Box display="flex" flexDirection="row" alignItems="center">
					<Switch
						checked={totalLoadDataStatus}
						onChange={handleGetDataFromServer}
						inputProps={{ "aria-label": "controlled" }}
						color="warning"
					/>
					{totalLoadDataStatus && (
						<Typography variant="h6">3.000 Results</Typography>
					)}
					{/* {isLoading && (
						<CircularProgress
							size={15}
							sx={{
								margin: "0px 10px",
								color: (theme) =>
									colors.greenAccent[
										theme.palette.mode === "dark"
											? 200
											: 800
									]
							}}
						/>
					)} */}
				</Box>
			)}

			<ReportTable
				handlerSave={handlerSave}
				dataTable={filteredTable}
				isLoading={isLoading}
				saved={saved}
			/>
		</Box>
	);
};

export default ReportPage;
