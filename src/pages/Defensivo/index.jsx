import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

import { useEffect, useState } from "react";

import HomeDefensivoPage from "../../components/defensivos/home";

import { onSnapshot, collection, query, orderBy } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase";
import { TABLES_FIREBASE } from "../../utils/firebase/firebase.typestables";

import { useDispatch } from "react-redux";
import { formatDate } from "../../utils/format-suport/data-format";
import Skeleton from "@mui/material/Skeleton";

const DefensivoPage = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const dispatch = useDispatch();
	const [isLoadingHome, setIsLoading] = useState(true);
	const [ordems, setOrdems] = useState([]);

	useEffect(() => {
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
				{!isLoadingHome && (
					<HomeDefensivoPage isLoadingHome={isLoadingHome} />
				)}
				{isLoadingHome && (
					<Box
						display="flex"
						justifyContent="center"
						alignItems="center"
						width="100%"
						height="100%"
						mt={4}
						sx={{
							backgroundColor: colors.blueOrigin[700],
							borderRadius: "8px",
							boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
						}}
					>
						<Box
							sx={{
								width: "100%",
								height: "100%",
								padding: "20px"
							}}
						>
							<Typography variant="h1">
								<Skeleton
									variant="rectangular"
									animation="wave"
								/>
								<Skeleton animation="wave" />
								<Skeleton animation="wave" />
								<Skeleton animation="wave" />
								<Skeleton animation="wave" />
								<Skeleton animation="wave" />
								<Skeleton animation="wave" />
								<Skeleton animation="wave" />
							</Typography>
						</Box>
					</Box>
				)}
			</Box>
		</Box>
	);
};

export default DefensivoPage;
