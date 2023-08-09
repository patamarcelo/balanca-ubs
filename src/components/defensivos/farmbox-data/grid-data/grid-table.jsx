import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import CustomToolbar from "../../../../utils/format-suport/custom-toolbar";

const FarmBoxDataTable = (props) => {
	const { rows, loading } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const defaultFontSize = "13px";
	const columns = [
		{ headerName: "AP", field: "app", width: 40 },
		{ headerName: "Operacao", field: "operacao", width: 80 },
		{ headerName: "Projeto", field: "fazenda", flex: 1 },
		{ headerName: "Parcela", field: "parcela", width: 20 },
		{ headerName: "Status", field: "status" },
		{ headerName: "Area", field: "area" },
		{ headerName: "Data Inicial", field: "date" },
		{ headerName: "Data Final", field: "endDate" },
		{ headerName: "Inicio Aplicacao", field: "initialAppDateAplicada" },
		{ headerName: "Final Aplicacao", field: "finalAppDateAplicada" }
	];

	return (
		<Box
			height="90%"
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
				columns={columns}
				checkboxSelection
				loading={loading}
				components={{ Toolbar: CustomToolbar }}
				componentsProps={{ toolbar: { title: "FarmData" } }}
			/>
		</Box>
	);
};

export default FarmBoxDataTable;
