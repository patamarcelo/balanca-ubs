import { Box } from "@mui/material";
import { selectTruckLoadsFormatData } from "../../store/trucks/trucks.selector";
import { useSelector } from "react-redux";
import ReportTable from "../../components/report-itens/report-table";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setTruckLoads } from "../../store/trucks/trucks.actions";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { selectUnidadeOpUser } from "../../store/user/user.selector";

import { FAZENDA_ORIGEM } from "../../store/trucks/reducer.initials";

import { limit } from "firebase/firestore";

const ReportPage = () => {
	const dataTableForm = useSelector(selectTruckLoadsFormatData);

	const unidadeOpUser = useSelector(selectUnidadeOpUser);
	const [filteredTable, setFilteredTable] = useState([]);

	const dispatch = useDispatch();
	const [isLoading, setIsLoading] = useState(true);
	const [saved, handlerSave] = useState(0);

	const origemDest = [];
	const filteredOrigemDestino = FAZENDA_ORIGEM.filter(
		(data) => data.user === unidadeOpUser
	);
	filteredOrigemDestino.map((data) => {
		origemDest.push(data.local);
		return data;
	});

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

	return (
		<Box
			minWidth="100%"
			height="98%"
			sx={{
				padding: ""
			}}
		>
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
