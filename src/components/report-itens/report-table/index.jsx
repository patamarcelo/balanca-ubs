import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const ReportTable = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();

	const handlerNavigatePrint = (data) => {
		navigate("/print",{state : { data: data }});
	};

	const { dataTable } = props;


	const formatPlate = (placa) => {
		return (
			placa?.toUpperCase().slice(0, 3) +
			"-" +
			placa?.toUpperCase().slice(-4)
		);
	};

	const formatWeight = (peso) => {
		return Number(peso).toLocaleString("pt-BR") + " Kg";
	};
	const columns = [
		{
			field: "count",
			headerName: ".",
			flex: 0.1,
			renderHeader: (params) => (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<ArrowDropDownIcon color="success" />
				</Box>
			),
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{params.row.tipo === "carregando" ? (
						<FontAwesomeIcon
							color={colors.greenAccent[600]}
							icon={faTruckMoving}
							size="xs"
							className="fa-flip-horizontal"
						/>
					) : (
						<FontAwesomeIcon
							color={colors.redAccent[600]}
							icon={faTruckMoving}
							size="xs"
						/>
					)}
				</Typography>
			)
		},
		{
			field: "entrada",
			headerName: "Entrada",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{params.row.entrada}
				</Typography>
			)
		},
		{
			field: "placa",
			headerName: "Placa",
			flex: 0.6,
			cellClassName: "name-placa",
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography>{formatPlate(params.row.placa)}</Typography>
			)
		},
		{
			field: "motorista",
			headerName: "Motorista",
			// type: "number",
			headerAlign: "center",
			align: "center",
			flex: 1
		},
		{
			field: "origem",
			headerName: "Origem",
			headerAlign: "center",
			align: "center",
			flex: 1
		},
		{
			field: "mercadoria",
			headerName: "Mercadoria",
			headerAlign: "center",
			align: "center",
			flex: 1
		},
		{
			field: "projeto",
			headerName: "Projeto",
			headerAlign: "center",
			align: "center",
			flex: 1
		},
		{
			field: "saida",
			headerName: "Saída",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.blueOrigin[400]}>
					{params.row.saida}
				</Typography>
			)
		},

		// {
		// 	field: "type",
		// 	headerName: "Operação",
		// 	flex: 0.5,
		// 	renderCell: (params) => (
		// 		<Typography
		// 			className={params.row.type === "pix" ? "pix" : "credito"}
		// 		>
		// 			{params.row.type}
		// 		</Typography>
		// 	)
		// },
		{
			field: "pesoBruto",
			headerName: "Bruto",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{formatWeight(params.row.pesoBruto)}
				</Typography>
			)
		},
		{
			field: "tara",
			headerName: "Tara",
			flex: 1,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{formatWeight(params.row.tara)}
				</Typography>
			)
		},
		{
			field: "act",
			headerName: "Imp.",
			flex: 0,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography
					color={colors.greenAccent[400]}
					sx={{ cursor: "pointer" }}
					onClick={() => handlerNavigatePrint(params.row)}
				>
					<FontAwesomeIcon
						color={colors.grey[200]}
						icon={faPrint}
						size="sm"
					/>
				</Typography>
			)
		}
	];
	return (
		<Box
			sx={{
				width: "100%",
				minHeight: "100%",
				height: "100%",
				whiteSpace: "nowrap"
			}}
		>
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
						borderBottom: "none"
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
					}
				}}
			>
				<DataGrid
					rows={dataTable}
					columns={columns}
					components={{ Toolbar: GridToolbar }}
				/>
			</Box>
		</Box>
	);
};

export default ReportTable;
