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

	// useEffect(() => {
	// 	console.log(dinamicData);
	// }, [dinamicData]);

	return (
		<Box width="100%" height="96%" pb={2}>
			<DataDefensivoDaysTableDinamic rows={dinamicData} />
		</Box>
	);
};

export default DataDefensivoPageDinamic;
