import * as React from "react";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CustomToolbar from "../../../utils/format-suport/custom-toolbar";

const DataDefensivoDaysTableDinamic = (props) => {
	const { rows } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const defaultFontSize = "13px";

	const columns = [
		{ field: "id", headerName: "ID" },
		{ field: "fazendaGrupo", headerName: "Fazenda", width: 140 },
		{ field: "projeto", headerName: "Projeto", width: 140 },
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
			width: 140
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
		{ field: "dapAplicacao", headerName: "DAP AP", width: 140 },
		{ field: "dataPrevista", headerName: "Data Prevista AP", width: 140 },
		{ field: "produto", headerName: "Produto AP", width: 140 },
		{ field: "tipo", headerName: "TIpo", width: 140 },
		{
			field: "dose",
			headerName: "Dose AP",
			width: 80
		},
		{
			field: "quantidadeAplicar",
			headerName: "Quantidade Aplicar",
			width: 140
		}
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
				components={{ Toolbar: CustomToolbar }}
				componentsProps={{ toolbar: { title: "Produtos Detalhato" } }}
			/>
		</Box>
	);
};

export default DataDefensivoDaysTableDinamic;
