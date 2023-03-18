import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { useEffect, useState } from "react";

import HomeOrdemPage from "../../components/ordens/home-ordens/index";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { useDispatch } from "react-redux";

const OrdemPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);

	useEffect(() => {
		const collRef = collection(db, TABLES_FIREBASE.ordemCarrega);
		const q = query(collRef, orderBy("createdAt"));
		onSnapshot(q, (snapshot) => {
			dispatch(
				console.log(
					snapshot.docs.map((doc) => ({
						...doc.data(),
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
			<Typography
				variant="h2"
				color={colors.blueAccent[600]}
				mb={1}
				ml={1}
			>
				Ordens de Carregamento
			</Typography>
			<Box
				sx={{
					width: "100%",
					height: "92%",
					// border: "1px solid whitesmoke",
					borderRadius: "8px",
					marginBottom: "10px"
				}}
			>
				<HomeOrdemPage isLoadingHome={isLoadingHome} />
			</Box>
		</Box>
	);
};

export default OrdemPage;
