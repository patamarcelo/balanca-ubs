import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import {
	faPrint,
	faTrashCan,
	faBookmark
} from "@fortawesome/free-solid-svg-icons";
import { faCircleCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import { selectIsAdminUser } from "../../../store/user/user.selector";

import { handleDeleteTruck } from "../../../utils/firebase/firebase.datatable";

const ReportTable = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();

	const handlerNavigatePrint = (data) => {
		navigate("/print", { state: { data: data } });
	};

	const { dataTable, isLoading, handlerSave, saved } = props;

	const dataTableRev = [...dataTable].reverse();

	const isAdmin = useSelector(selectIsAdminUser);

	const handlerDelete = (dataId, data) => {
		try {
			handleDeleteTruck(dataId, data);
			handlerSave(saved + 1);
			toast.success("Carga deletada com sucesso!!");
		} catch (error) {
			console.log("Erro ao Deletar a Carga: ", data.id);
		}
	};

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

	console.log(isLoading);
	const columns = [
		{
			field: "tipo",
			headerName: "",
			// flex: 0.1,
			width: 10,
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
			// flex: 1,
			headerAlign: "center",
			align: "center",
			width: 130,
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{params.row.entrada}
				</Typography>
			)
		},
		{
			field: "placa",
			headerName: "Placa",
			// flex: 0.6,
			width: 80,
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
			// flex: 1
			width: 120
		},
		{
			field: "origem",
			headerName: "Origem",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 120
		},
		{
			field: "destino",
			headerName: "Destino",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 100
		},
		{
			field: "mercadoria",
			headerName: "Mercadoria",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 100
		},
		{
			field: "projeto",
			headerName: "Projeto",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 100
		},
		{
			field: "cultura",
			headerName: "Cultura",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 100
		},
		{
			field: "saida",
			headerName: "Saída",
			// flex: 1,
			width: 130,
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
			// flex: 1,
			width: 120,
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
			// flex: 1,
			width: 120,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{formatWeight(params.row.tara)}
				</Typography>
			)
		},
		{
			field: "liquido",
			headerName: "Líquido",
			// flex: 1,
			width: 120,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{formatWeight(params.row.liquido)}
				</Typography>
			)
		},
		{
			field: "act",
			headerName: "Imp.",
			flex: 0,
			headerAlign: "center",
			align: "center",
			renderHeader: (params) => (
				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center"
					}}
				>
					<FontAwesomeIcon
						color={colors.greenAccent[500]}
						icon={faBookmark}
						size="sm"
					/>
				</Box>
			),
			renderCell: (params) => (
				<>
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
					{params.row.liquido > 0 && (
						<FontAwesomeIcon
							color={colors.greenAccent[500]}
							icon={faCircleCheck}
							size="sm"
							style={{ marginLeft: "10px" }}
						/>
					)}
					{isAdmin && (
						<Typography
							color={colors.greenAccent[400]}
							sx={{ cursor: "pointer" }}
							onClick={() =>
								handlerDelete(params.row.id, params.row)
							}
						>
							<FontAwesomeIcon
								color={colors.redAccent[500]}
								icon={faTrashCan}
								size="sm"
								style={{ marginLeft: "10px" }}
							/>
						</Typography>
					)}
				</>
			)
		}
	];

	if (isLoading) {
		return (
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				width="100%"
				height="100%"
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
		);
	}
	return (
		<Box
			sx={{
				// minWidth: "100%",
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
					rows={dataTableRev}
					columns={columns}
					components={{ Toolbar: GridToolbar }}
				/>
			</Box>
		</Box>
	);
};

export default ReportTable;
