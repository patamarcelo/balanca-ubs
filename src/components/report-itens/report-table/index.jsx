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
import {
	selectIsAdminUser,
	selectIBalancaUser
} from "../../../store/user/user.selector";

import { selectTruckOnID } from "../../../store/trucks/trucks.selector";

import { handleDeleteTruck } from "../../../utils/firebase/firebase.datatable";

import EditModal from "../report-modal-table";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { TRUCK_INITIAL_STATE } from "../../../store/trucks/reducer.initials";

import { newDateArr } from "../../../utils/format-suport/data-format";

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
	const isBalanca = useSelector(selectIBalancaUser);
	const [dataTruck, setDataTruck] = useState([TRUCK_INITIAL_STATE]);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [filterId, setFilterId] = useState(null);

	const truckLoadId = useSelector(selectTruckOnID(filterId));

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

	const handlerEditTruck = (id, data) => {
		console.log("ID: " + id);
		setFilterId(id);
		setIsOpenModal(true);
		// const entrada = newDateArr(data.entrada);
		// const saida = newDateArr(data.saida);
		// const newObj = { ...data, entrada: entrada, saida: saida };
		setDataTruck(data);
		console.log("reportIndex: ", truckLoadId);
	};

	useEffect(() => {
		if (!isOpenModal) {
			setDataTruck([]);
		}
	}, [isOpenModal]);

	const columns = [
		{
			field: "tipo",
			headerName: "",
			// flex: 0.1,
			width: 80,
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
				<Box
					display="flex"
					justifyContent="start"
					alignItems="center"
					gap="10px"
					sx={{
						width: "100%"
					}}
				>
					{params.row.tipo === "carregando" ? (
						<>
							<FontAwesomeIcon
								color={colors.greenAccent[600]}
								icon={faTruckMoving}
								size="xs"
								className="fa-flip-horizontal"
							/>

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

							<FontAwesomeIcon
								color={
									params.row.liquido
										? colors.greenAccent[500]
										: colors.yellow[550]
								}
								icon={faCircleCheck}
								size="sm"
							/>
						</>
					) : (
						<>
							<FontAwesomeIcon
								color={colors.redAccent[600]}
								icon={faTruckMoving}
								size="xs"
							/>
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

							<FontAwesomeIcon
								color={
									params.row.liquido
										? colors.greenAccent[500]
										: colors.yellow[550]
								}
								icon={faCircleCheck}
								size="sm"
							/>
						</>
					)}
				</Box>
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
		{
			field: "unidadeOp",
			headerName: "Unidade",
			// flex: 1,
			width: 130,
			headerAlign: "center",
			align: "center"
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
			field: "umidade",
			headerName: "Umidade",
			// flex: 1,
			width: 70,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.umidade
						? parseFloat(params.row.umidade).toFixed(2) + " %"
						: " - "}
				</Typography>
			)
		},
		{
			field: "impureza",
			headerName: "Impureza",
			// flex: 1,
			width: 70,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.impureza
						? parseFloat(params.row.impureza).toFixed(2) + " %"
						: " - "}
				</Typography>
			)
		},
		{
			field: "parcela",
			headerName: "Parcela",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.parcela ? params.row.parcela : " - "}
				</Typography>
			)
		},
		{
			field: "nfEntrada",
			headerName: "NF Entrada",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.nfEntrada ? params.row.nfEntrada : " - "}
				</Typography>
			)
		},
		{
			field: "op",
			headerName: "OP",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.op ? params.row.op : " - "}
				</Typography>
			)
		},
		{
			field: "relatorioColheita",
			headerName: "Relatório Colh.",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.relatorioColheita
						? params.row.relatorioColheita
						: " - "}
				</Typography>
			)
		},
		{
			field: "ticket",
			headerName: "Ticket",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography color={colors.primary[100]}>
					{params.row.ticket ? params.row.ticket : " - "}
				</Typography>
			)
		},
		{
			field: "act",
			headerName: "Situação",
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
					{isBalanca && params.row.liquido > 0 && (
						<Typography
							color={colors.greenAccent[400]}
							sx={{ cursor: "pointer" }}
							onClick={() =>
								handlerEditTruck(params.row.id, params.row)
							}
						>
							<FontAwesomeIcon
								icon={faPenToSquare}
								color={colors.yellow[600]}
								size="sm"
								style={{ marginLeft: "10px" }}
							/>
						</Typography>
					)}
					{params.row.liquido > 0 ? (
						<FontAwesomeIcon
							color={colors.greenAccent[500]}
							icon={faCircleCheck}
							size="sm"
							style={{ marginLeft: "10px" }}
						/>
					) : (
						<FontAwesomeIcon
							color={colors.yellow[550]}
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
			<EditModal
				dataTruck={dataTruck}
				isOpenModal={isOpenModal}
				setIsOpenModal={setIsOpenModal}
				TRUCK_INITIAL_STATE={TRUCK_INITIAL_STATE}
				setDataTruck={setDataTruck}
			/>

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
					rows={dataTableRev}
					columns={columns}
					components={{ Toolbar: GridToolbar }}
				/>
			</Box>
		</Box>
	);
};

export default ReportTable;
