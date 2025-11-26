import { Box, useTheme } from "@mui/material";

import { useEffect, useState } from "react";

// import classes from "./data-by-day.module.css";
import DataDefensivoDaysTableDinamic from "./data-table-dinamic";

import { createDinamicTable } from "../../../utils/format-suport/create-table-dinamic";

import { useSelector } from "react-redux";
import { selectPlantio } from "../../../store/plantio/plantio.selector";
import PlantioDashboard from "./PlantioDashboard";
import { tokens } from "../../../theme";

const DataDefensivoPageDinamic = (props) => {
	const plantioRedux = useSelector(selectPlantio);

	const [dinamicData, SetDinamicData] = useState([]);

	const theme = useTheme();
	useEffect(() => {
		console.log('tehem', theme.palette.mode)
	}, [theme]);

	useEffect(() => {
		const newTable = createDinamicTable(plantioRedux);
		if (newTable) {
			SetDinamicData(newTable);
		}
	}, [plantioRedux]);

	return (
		<Box width="100%" height="96%" pb={2}>
			<PlantioDashboard data={dinamicData} dark={theme.palette.mode === 'dark'}/>
			<DataDefensivoDaysTableDinamic rows={dinamicData} />
		</Box>
	);
};

export default DataDefensivoPageDinamic;
