import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { useEffect, useState } from "react";

import HomeOrdemPage from "../../components/ordens/home-ordens/index";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { useDispatch } from "react-redux";
import { formatDate } from "../../utils/format-suport/data-format";

const OrdemPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);
	const [ordems, setOrdems] = useState([]);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.ordemCarrega);
		const q = query(collRef, orderBy("createdAt"));
		onSnapshot(q, (snapshot) => {
			dispatch(
				setOrdems(
					snapshot.docs.map((doc) => ({
						...doc.data(),
						data: formatDate(doc.data()["createdAt"]),
						id: doc.id
					}))
				)
			);
		});
		setTimeout(() => {
			setIsLoading(false);
		}, 1000);
	}, [dispatch]);

	return (
		<Box
			sx={{
				width: "100%",
				height: "100%"
			}}
		>
			<Box
				sx={{
					width: "100%",
					height: "100%",
					// border: "1px solid whitesmoke",
					borderRadius: "8px",
					marginBottom: "10px"
				}}
			>
				<HomeOrdemPage isLoadingHome={isLoadingHome} ordems={ordems} />
			</Box>
		</Box>
	);
};

export default OrdemPage;
