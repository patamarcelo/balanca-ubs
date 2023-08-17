import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../../theme";

import CustomToolbar from "../../../../utils/format-suport/custom-toolbar";

const FarmBoxDataTable = (props) => {
	const { rows, loading, onlyAppNotProducts } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const defaultFontSize = "13px";
	const columnsApp = [
		{ headerName: "AP", field: "app", width: 40 },
		{ headerName: "Operacao", field: "operacao", flex: 1 },
		{ headerName: "Projeto", field: "fazenda", flex: 1 },
		{ headerName: "Parcela", field: "parcela", width: 90 },
		{ headerName: "Cultura", field: "cultura", flex: 1 },
		{ headerName: "Variedade", field: "variedade", flex: 1 },
		{ headerName: "Data Plantio", field: "dataPlantio", width: 90 },
		{ headerName: "Safra", field: "safra", width: 90 },
		{ headerName: "Ciclo", field: "ciclo", width: 50 },
		{ headerName: "Status", field: "status" },
		{ headerName: "Area", field: "areaForm" },
		{ headerName: "Data Inicial", field: "date" },
		{ headerName: "Data Final", field: "endDate" },
		{ headerName: "Inicio Aplicacao", field: "initialAppDateAplicada" },
		{ headerName: "Final Aplicacao", field: "finalAppDateAplicada" },
	];

	const columnsProdutos = [
		{ headerName: "AP", field: "app", width: 40 },
		{ headerName: "Operacao", field: "operacao", flex: 1 },
		{ headerName: "Projeto", field: "fazenda", flex: 1 },
		{ headerName: "Parcela", field: "parcela", width: 90 },
		{ headerName: "Cultura", field: "cultura", flex: 1 },
		{ headerName: "Variedade", field: "variedade", flex: 1 },
		{ headerName: "Data Plantio", field: "dataPlantio", width: 90 },
		{ headerName: "Safra", field: "safra", width: 90 },
		{ headerName: "Ciclo", field: "ciclo", width: 50 },
		{ headerName: "Status", field: "status" },
		{ headerName: "Insumo", field: "insumo" },
		{ headerName: "Tipo", field: "tipo" },
		{ headerName: "Dose", field: "dose" },
		{ headerName: "Area", field: "area" },
		{ headerName: "Quantidade", field: "quantidade" },
		{ headerName: "Data Inicial", field: "date" },
		{ headerName: "Data Final", field: "endDate" },
		{ headerName: "Inicio Aplicacao", field: "initialAppDateAplicada" },
		{ headerName: "Final Aplicacao", field: "finalAppDateAplicada" },
	];

	return (
		<Box
			height="90%"
			sx={{
				"& .MuiDataGrid-root": {
					border: "none",
				},
				"& .MuiDataGrid-cell": {
					// borderBottom: "none"
				},
				"& .name-column--cell": {
					color: colors.pink[300],
				},
				"& .MuiDataGrid-columnHeaders": {
					backgroundColor: colors.blueOrigin[700],
					borderBottom: "none",
					height: "90%",
				},
				"& .MuiDataGrid-virtualScroller": {
					backgroundColor: colors.primary[400],
				},
				"& .MuiDataGrid-footerContainer": {
					borderTop: "none",
					backgroundColor: colors.blueOrigin[700],
				},
				"& .MuiDataGrid-toolbarContainer .MuiButton-text": {
					color: `${colors.grey[100]} !important`,
				},
				"& .MuiDataGrid-row.Mui-selected": {
					backgroundColor: `${colors.yellow[900]} !important`,
				},
			}}
		>
			<DataGrid
				rows={rows}
				columns={onlyAppNotProducts ? columnsApp : columnsProdutos}
				checkboxSelection
				loading={loading}
				components={{ Toolbar: CustomToolbar }}
				componentsProps={{ toolbar: { title: "FarmData" } }}
			/>
		</Box>
	);
};

export default FarmBoxDataTable;