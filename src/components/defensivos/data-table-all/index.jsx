import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useState } from "react";

import { createDataTable } from "../../../utils/format-suport/create-table-dinamic";
import ProgramaTablePage from "./data-table-app";

import { useSelector } from "react-redux";
import { selectPlantio } from "../../../store/plantio/plantio.selector";

const DataDefensivoPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { isLoadingHome } = props;
	const plantioRedux = useSelector(selectPlantio);

	const [tableData, SetTableData] = useState([]);

	useEffect(() => {
		const newTable = createDataTable(plantioRedux);
		if (newTable) {
			SetTableData(newTable);
		}
	}, [plantioRedux]);

	return (
		<Box
			width="100%"
			height="96%"
			pb={2}
			mt={2}
			sx={
				{
					// backgroundColor: "red"
				}
			}
		>
			{isLoadingHome && plantioRedux && (
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
			{!isLoadingHome && plantioRedux && (
				<>
					<ProgramaTablePage
						loading={isLoadingHome}
						rows={tableData}
					/>
				</>
			)}
		</Box>
	);
};

export default DataDefensivoPage;
