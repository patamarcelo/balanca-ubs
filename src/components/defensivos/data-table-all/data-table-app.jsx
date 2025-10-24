import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box,  useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CustomToolbar from "../../../utils/format-suport/custom-toolbar";

const ProgramaTablePage = (props) => {
	const { rows, loading } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	// const defaultFontSize = "13px";

	const columns = [
		{ field: "fazendaGrupo", headerName: "Fazenda", width: 180 },
		{ field: "projeto", headerName: "Projeto", width: 180 },
		{ field: "parcela", headerName: "Parcela", width: 80 },
		{ field: "talhaoIdUnico", headerName: "ID Talhao" },
		{
			field: "area",
			headerName: "Area",
			width: 80
		},
		{
			field: "capacidadePlantioDia",
			headerName: "Plantio Dia",
			width: 80
		},
		{ field: "ciclo", headerName: "Ciclo", width: 80 },
		{ field: "safra", headerName: "Safra", width: 80 },
		{ field: "cultura", headerName: "Cultura", width: 80 },
		{ field: "variedade", headerName: "Variedade", width: 80 },
		{ field: "plantioFinalizado", headerName: "Plantio Fin.", width: 80 },
		{ field: "dataPlantio", headerName: "Data Plantio.", width: 80 },
		{ field: "dap", headerName: "DAP", width: 80 },
		{ field: "programa", headerName: "Programa", width: 140 },
		{ field: "programaStartDate", headerName: "Start Janela", width: 140 },
		{ field: "programaEndDate", headerName: "Fim Janela", width: 140 },
		{ field: "estagio", headerName: "Estagio", width: 140 },
		{ field: "dapAplicacao", headerName: "DAP AP", width: 80 },
		{ field: "dataPrevista", headerName: "Data Prevista AP", width: 140 },
		{ field: "aplicado", headerName: "Aplicado ? ", width: 80 }
	];

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
				columns={columns}
				checkboxSelection
				loading={loading}
				components={{ Toolbar: CustomToolbar }}
				componentsProps={{ toolbar: { title: "Programacoes" } }}
			/>
		</Box>
	);
};

export default ProgramaTablePage;
