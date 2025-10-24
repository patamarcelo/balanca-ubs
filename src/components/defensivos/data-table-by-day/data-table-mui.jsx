import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CustomToolbar from "../../../utils/format-suport/custom-toolbar";

const DataDefensivoDaysTable = (props) => {
	const { rows, columns } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const column = [
		{ field: "produto", headerName: "Produto", width: 140 },
		{ field: "tipo", headerName: "Tipo", width: 140 }
	];
	for (let col of columns) {
		const formatData = col?.split("-").reverse().join("/");
		const newCol = {
			field: col,
			headerName: formatData,
			headerAlign: "center",
			align: "center"
		};
		column.push(newCol);
	}

	return (
		<Box
			height="100%"
			sx={{
				"& .MuiDataGrid-root": {
					border: "none"
				},
				"& .MuiDataGrid-cell": {
					// borderBottom: "none"
				},
				"& .name-column--cell": {
					color: colors.pink[300]
				},
				"& .MuiDataGrid-columnHeaders": {
					backgroundColor: colors.blueOrigin[700],
					borderBottom: "none",
					height: "90%"
				},
				"& .MuiDataGrid-virtualScroller": {
					backgroundColor: colors.primary[400]
				},
				"& .MuiDataGrid-footerContainer": {
					borderTop: "none",
					backgroundColor: colors.blueOrigin[700]
				},
				"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
					color: `${colors.grey[100]} !important`
				},
				"& .MuiDataGrid-row.Mui-selected": {
					backgroundColor: `${colors.yellow[900]} !important`
				}
			}}
		>
			<DataGrid
				rows={rows}
				columns={column}
				checkboxSelection
				components={{ Toolbar: CustomToolbar }}
				componentsProps={{ toolbar: { title: "Produtos" } }}
			/>
		</Box>
	);
};

export default DataDefensivoDaysTable;
