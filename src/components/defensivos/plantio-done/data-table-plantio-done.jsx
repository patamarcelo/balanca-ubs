import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import CustomToolbar from "../../../utils/format-suport/custom-toolbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";

const PlantioDoneTable = (props) => {
	const { rows, loading } = props;
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const columns = [
		{ field: "talhao__id_unico", headerName: "ID único", flex: 0 },
		{ field: "data_plantio_inicio", headerName: "Data Ini.", flex: 0 },
		{ field: "data_plantio", headerName: "Data", flex: 0 },
		{
			field: "talhao__fazenda__fazenda__nome",
			headerName: "Fazenda",
			flex: 1
		},
		{ field: "talhao__fazenda__nome", headerName: "Projeto", flex: 1 },
		{ field: "talhao__id_talhao", headerName: "Parcela", flex: 1 },
		{
			field: "variedade__cultura__cultura",
			headerName: "Cultura",
			flex: 1
		},
		{
			field: "variedade__nome_fantasia",
			headerName: "Variedade",
			flex: 1
		},
		{
			field: "variedade__dias_ciclo",
			headerName: "Variedade Ciclo",
			flex: 1
		},
		{ field: "area_colheita", headerName: "Area", flex: 1 },
		{ field: "safra__safra", headerName: "Safra", flex: 1 },
		{ field: "ciclo__ciclo", headerName: "Ciclo", flex: 1 },
		{
			field: "finalizado_plantio",
			headerName: "Pla. Finalizado",
			flex: 1,
			renderCell: (params) => (
				<FontAwesomeIcon
					icon={faCircleCheck}
					color={
						params.row.finalizado_plantio
							? colors.greenAccent[500]
							: colors.redAccent[500]
					}
				/>
			)
		},
		{
			field: "plantio_descontinuado",
			headerName: "Descontinuado",
			flex: 1,
			renderCell: (params) => (
				<FontAwesomeIcon
					icon={faCircleCheck}
					color={
						params.row.plantio_descontinuado
							? colors.greenAccent[500]
							: colors.redAccent[500]
					}
				/>
			)
		},
		{
			field: "finalizado_colheita",
			headerName: "Col. Finalizado",
			flex: 1,
			renderCell: (params) => (
				<FontAwesomeIcon
					icon={faCircleCheck}
					color={
						params.row.finalizado_colheita
							? colors.greenAccent[500]
							: colors.redAccent[500]
					}
				/>
			)
		}
	];

	return (
		<Box
			height="92%"
			pb={1}
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
				componentsProps={{ toolbar: { title: "Plantio" } }}
			/>
		</Box>
	);
};

export default PlantioDoneTable;
