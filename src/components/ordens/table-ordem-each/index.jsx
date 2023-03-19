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

import toast from "react-hot-toast";

import { useSelector } from "react-redux";
import {
	selectIsAdminUser,
	selectIBalancaUser
} from "../../../store/user/user.selector";

import { selectTruckOnID } from "../../../store/trucks/trucks.selector";

import { handleDeleteOrdem } from "../../../utils/firebase/firebase.datatable.ordems";

// import EditModal from "../report-modal-table";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { TRUCK_INITIAL_STATE } from "../../../store/trucks/reducer.initials";
import { formatDate } from "../../../store/trucks/trucks.selector";

const TableOrdensEach = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();

	const handlerNavigatePrint = (data) => {
		console.log(data);
		// navigate("/print", { state: { data: data } });
	};

	const { ordems } = props;
	console.log(ordems);

	const dataTableRev = [...ordems].reverse();

	// const isAdmin = useSelector(selectIsAdminUser);
	// const isBalanca = useSelector(selectIBalancaUser);
	// const [dataTruck, setDataTruck] = useState([TRUCK_INITIAL_STATE]);
	// const [isOpenModal, setIsOpenModal] = useState(false);
	// const [filterId, setFilterId] = useState(null);

	const handlerDelete = (dataId, data) => {
		try {
			handleDeleteOrdem(dataId, data);
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

	const formatPeso = (peso) => {
		const newPeso = peso.toLocaleString("en").replace(",", ".") + " Kg";
		return newPeso;
	};

	// const handlerEditTruck = (id, data) => {
	// 	setFilterId(id);
	// 	setIsOpenModal(true);
	// 	setDataTruck(data);
	// };

	// useEffect(() => {
	// 	if (!isOpenModal) {
	// 		setDataTruck([]);
	// 	}
	// }, [isOpenModal]);

	const columns = [
		{
			field: "tipo",
			headerName: "",
			// flex: 0.1,
			width: 40,
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
					justifyContent="center"
					alignItems="center"
					gap="10px"
					sx={{
						width: "100%"
					}}
				>
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
				</Box>
			)
		},
		{
			field: "createdAt",
			headerName: "Data",
			// flex: 1,
			headerAlign: "center",
			align: "center",
			width: 130,
			renderCell: (params) => (
				<Typography color={colors.greenAccent[400]}>
					{params.row.data}
				</Typography>
			)
		},
		{
			field: "placatrator",
			headerName: "Placa",
			// flex: 0.6,
			width: 130,
			cellClassName: "name-placa",
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography>{formatPlate(params.row.placaTrator)}</Typography>
			)
		},
		{
			field: "placaVagao1",
			headerName: "Carreta",
			// flex: 0.6,
			width: 130,
			cellClassName: "name-placa",
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography>{formatPlate(params.row.placaVagao1)}</Typography>
			)
		},
		{
			field: "placaVagao2",
			headerName: "Carreta2",
			// flex: 0.6,
			width: 130,
			cellClassName: "name-placa",
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography>{formatPlate(params.row.placaVagao2)}</Typography>
			)
		},
		{
			field: "motorista",
			headerName: "Motorista",
			// type: "number",
			headerAlign: "center",
			align: "center",
			flex: 1
			// width: 150
		},
		{
			field: "origem",
			headerName: "Origem",
			// type: "number",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 150
		},
		{
			field: "destino",
			headerName: "Destino",
			// type: "number",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 150
		},
		{
			field: "mercadoria",
			headerName: "Mercadoria",
			// type: "number",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 130
		},
		{
			field: "veiculo",
			headerName: "Peso",
			// type: "number",
			headerAlign: "center",
			align: "center",
			flex: 1,
			// width: 120,
			renderCell: (params) => (
				<Typography>{formatPeso(params.row.veiculo)}</Typography>
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
					{/* {isBalanca && params.row.liquido > 0 && (
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
					)} */}
					{params.row.liquido > 0 ? (
						<FontAwesomeIcon
							color={colors.greenAccent[500]}
							icon={faCircleCheck}
							size="sm"
							style={{ marginLeft: "10px" }}
						/>
					) : (
						<FontAwesomeIcon
							color={colors.greenAccent[500]}
							icon={faCircleCheck}
							size="sm"
							style={{ marginLeft: "10px" }}
						/>
					)}
					{
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
					}
				</>
			)
		}
	];

	return (
		<Box
			sx={{
				// minWidth: "100%",
				minHeight: "100%",
				height: "100%",
				whiteSpace: "nowrap"
			}}
		>
			{/* <EditModal
				dataTruck={dataTruck}
				isOpenModal={isOpenModal}
				setIsOpenModal={setIsOpenModal}
				TRUCK_INITIAL_STATE={TRUCK_INITIAL_STATE}
				setDataTruck={setDataTruck}
			/> */}

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

export default TableOrdensEach;
