import { Box, Typography, Button, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

import classes from "./data-by-day.module.css";
import DataDefensivoDaysTableDinamic from "./data-table-dinamic";

import { createDinamicTable } from "../../../utils/format-suport/create-table-dinamic";

const DataDefensivoPageDinamic = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { isLoadingHome, dataDef } = props;

	// const [sortedData, setSortedData] = useState([]);
	const [dinamicData, SetDinamicData] = useState([]);
	// const [onlyProducts, setOnlyProducts] = useState([]);
	// const [dataTableDays, setDataTableDays] = useState([]);

	useEffect(() => {
		const newTable = createDinamicTable(dataDef);
		if (newTable) {
			SetDinamicData(newTable);
		}
	}, [dataDef]);

	useEffect(() => {
		console.log(dinamicData);
	}, [dinamicData]);

	return (
		<Box
			width="100%"
			height="96%"
			pb={2}
			sx={
				{
					// backgroundColor: "red"
				}
			}
		>
			{/* <DataDefensivoDaysTableDinamic
				rows={dataTableDays}
				columns={onlyData}
			/> */}
			{isLoadingHome && !dataDef && (
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
					<Typography
						variant="h2"
						color={colors.yellow[700]}
						sx={{ fontWeight: "bold" }}
					>
						<CircularProgress sx={{ color: colors.primary[100] }} />
					</Typography>
				</Box>
			)}
		</Box>
	);
};

export default DataDefensivoPageDinamic;
