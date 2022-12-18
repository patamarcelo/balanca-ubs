import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import { getTruckMoves } from "../../utils/firebase/firebase.datatable";

import HomeTableTruck from "../home-table-truck";
const HomeTable = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const [table, setTable] = useState([]);

	useEffect(() => {
		const getData = async () => {
			const data = await getTruckMoves();
			setTable(data);
		};
		if (table.length === 0) {
			console.log("pegando os dados");
			return () => getData();
		}
	}, []);

	console.log(table);

	if (table.length === 0) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100%"
				sx={{
					backgroundColor: colors.blueOrigin[800],
					borderRadius: "8px",
					boxShadow: `rgba(255, 255, 255, 0.1) 2px 2px 6px 0px inset, rgba(255, 255, 255, 0.1) -1px -1px 1px 1px inset;`
				}}
			>
				<Typography
					variant="h2"
					color={colors.yellow[700]}
					sx={{ fontWeight: "bold" }}
				>
					SEM VEÍCULOS NO PÁTIO
				</Typography>
			</Box>
		);
	}

	return (
		<Box 
		width="100%"
		display="flex"
		alignItems="center"
		flexDirection="column"
		gap="15px"
		sx={{padding: '15px 0'}}
		>
			<HomeTableTruck table={table} />
		</Box>
	);
};

export default HomeTable;
