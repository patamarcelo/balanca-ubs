import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import {
	faPrint,
	faTrashCan,
	faBookmark
	// faMobile
} from "@fortawesome/free-solid-svg-icons";

import { faMobile } from "@fortawesome/free-solid-svg-icons";
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



import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";



import classes from "./table.module.css";

import CustomToolbar from "../../../utils/format-suport/custom-toolbar";
import { Dialog } from "@mui/material"; // ou outro modal da sua lib preferida
import PrintRCLayout from "../../print-rc";
import PrintPage from "../../../pages/Print";


const ReportTable = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const navigate = useNavigate();
	const [openModal, setOpenModal] = useState(false);
	const [modalData, setModalData] = useState(null);
	const [modalDataRc, setModalDataRc] = useState(null);


	const handlerNavigatePrint = (data) => {
		setModalDataRc(data);
		console.log('data: ', data)
		setOpenModal(true);
	};

	// const handlerNavigatePrintRomaneio = (data) => {
	// 	console.log('data inside roma: ', data)
	// 	if(data?.createdBy === 'App'){
	// 		navigate("/rcprint", { state: { data: data } });
	// 	}
	// };

	const handlerNavigatePrintRomaneio = (data) => {
		if (data?.createdBy === "App") {
			setModalData(data);
			setOpenModal(true);
		}
	};

	const handleClose = () => {
		setOpenModal(false);
		setModalData(null);
		setModalDataRc(null);
	};

	const { dataTable, isLoading, handlerSave, saved } = props;

	const dataTableRev = [...dataTable];

	const isAdmin = useSelector(selectIsAdminUser);
	const isBalanca = useSelector(selectIBalancaUser);
	const [dataTruck, setDataTruck] = useState([TRUCK_INITIAL_STATE]);
	const [isOpenModal, setIsOpenModal] = useState(false);
	const [filterId, setFilterId] = useState(null);

	const truckLoadId = useSelector(selectTruckOnID(filterId));

	const defaultFontSize = "13px";

	const LightTooltip = styled(({ className, ...props }) => (
		<Tooltip {...props} classes={{ popper: className }} />
	))(({ theme }) => ({
		[`& .${tooltipClasses.tooltip}`]: {
			backgroundColor: theme.palette.common.white,
			color: "rgba(0, 0, 0, 0.87)",
			boxShadow: theme.shadows[1],
			fontSize: 11
		}
	}));

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
		setFilterId(id);
		setIsOpenModal(true);
		setDataTruck(data);
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
							<Box sx={{ cursor: "pointer" }}>
								<LightTooltip
									title="Romaneio"
									placement="top"
									arrow
									TransitionComponent={Zoom}
								>
									<FontAwesomeIcon
										color={colors.greenAccent[600]}
										icon={faTruckMoving}
										size="xs"
										className="fa-flip-horizontal"
										onClick={() =>
											handlerNavigatePrintRomaneio(
												params.row
											)
										}
									/>
								</LightTooltip>
							</Box>
							<LightTooltip
								title="Ticket"
								placement="top"
								arrow
								TransitionComponent={Zoom}
							>
								<Typography
									color={colors.greenAccent[400]}
									sx={{ cursor: "pointer" }}
									onClick={() =>
										handlerNavigatePrint(params.row)
									}
								>
									<FontAwesomeIcon
										color={colors.grey[200]}
										icon={faPrint}
										size="sm"
									/>
								</Typography>
							</LightTooltip>
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
							<Box sx={{ cursor: "pointer" }}>
								<LightTooltip
									title="Romaneio"
									placement="top"
									arrow
									TransitionComponent={Zoom}
								>
									<FontAwesomeIcon
										color={colors.redAccent[600]}
										icon={faTruckMoving}
										size="xs"
										onClick={() =>
											handlerNavigatePrintRomaneio(
												params.row
											)
										}
									/>
								</LightTooltip>
							</Box>
							<LightTooltip
								title="Ticket"
								placement="top"
								arrow
								TransitionComponent={Zoom}
							>
								<Typography
									color={colors.greenAccent[400]}
									sx={{ cursor: "pointer" }}
									onClick={() =>
										handlerNavigatePrint(params.row)
									}
								>
									<FontAwesomeIcon
										color={colors.grey[200]}
										icon={faPrint}
										size="sm"
									/>
								</Typography>
							</LightTooltip>

							<FontAwesomeIcon
								color={
									params.row.liquido
										? colors.greenAccent[500]
										: colors.yellow[550]
								}
								icon={
									params?.row?.syncDate !== null
										? faMobile
										: faCircleCheck
								}
								size="sm"
							/>
						</>
					)}
				</Box>
			)
		},
		{
			field: "relatorioColheita",
			headerName: "Relatório Colh.",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.relatorioColheita
						? params.row.relatorioColheita
						: " - "}
				</Typography>
			)
		},
		// {
		// 	field: "createdAt",
		// 	headerName: "Criado",
		// 	// flex: 1,
		// 	headerAlign: "center",
		// 	align: "center",
		// 	width: 130,
		// 	renderCell: (params) => (
		// 		<Typography
		// 			sx={{ fontSize: defaultFontSize }}
		// 			color={colors.blueOrigin[300]}
		// 		>
		// 			{formatDate(params.row.createdAt)}
		// 		</Typography>
		// 	)
		// },
		{
			field: "entrada",
			headerName: "Entrada",
			// flex: 1,
			headerAlign: "center",
			align: "center",
			width: 130,
			renderCell: (params) => (
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.greenAccent[400]}
				>
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
				<Typography sx={{ fontSize: defaultFontSize }}>
					{formatPlate(params.row.placa)}
				</Typography>
			)
		},
		{
			field: "motorista",
			headerName: "Motorista",
			// type: "number",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 120,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.motorista ? params.row.motorista : "-"}
				</Typography>
			)
		},
		{
			field: "valorFrete",
			headerName: "Frete",
			// type: "number",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 120,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.valorFrete
						? "R$ " +
						parseFloat(params.row.valorFrete)
							.toFixed(2)
							.replace(".", ",")
							.toLocaleString("pt-BR", {
								style: "currency",
								currency: "BRL"
							})
						: "-"}
				</Typography>
			)
		},
		{
			field: "origem",
			headerName: "Origem",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 140,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.fazendaOrigem === "Outros"
						? params.row.origem
						: params.row.fazendaOrigem
							? params.row.fazendaOrigem
							: "-"}
				</Typography>
			)
		},
		{
			field: "fazendaOrigem",
			headerName: "Fazenda Origem",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 140,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.fazendaOrigem ? params.row.fazendaOrigem : "-"}
				</Typography>
			)
		},
		{
			field: "destino",
			headerName: "Destino",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 140,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.fazendaDestino === "Outros"
						? params.row.destino
						: params.row.fazendaDestino
							? params.row.fazendaDestino
							: "-"}
				</Typography>
			)
		},
		{
			field: "fazendaDestino",
			headerName: "Fazenda Destino",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 140,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.fazendaDestino
						? params.row.fazendaDestino
						: "-"}
				</Typography>
			)
		},
		{
			field: "mercadoria",
			headerName: "Mercadoria",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 100,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.mercadoria ? params.row.mercadoria : "-"}
				</Typography>
			)
		},
		// {
		// 	field: "projeto",
		// 	headerName: "Projeto",
		// 	headerAlign: "center",
		// 	align: "center",
		// 	// flex: 1
		// 	width: 100,
		// 	renderCell: (params) => (
		// 		<Typography sx={{ fontSize: defaultFontSize }}>
		// 			{params.row.projeto ? params.row.projeto : "-"}
		// 		</Typography>
		// 	)
		// },
		{
			field: "cultura",
			headerName: "Cultura",
			headerAlign: "center",
			align: "center",
			// flex: 1
			width: 100,
			renderCell: (params) => (
				<Typography sx={{ fontSize: defaultFontSize }}>
					{params.row.cultura ? params.row.cultura : "-"}
				</Typography>
			)
		},
		{
			field: "saida",
			headerName: "Saída",
			// flex: 1,
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.blueOrigin[400]}
				>
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
		// 		<Typography sx={{ fontSize: defaultFontSize }}
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.greenAccent[400]}
				>
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.greenAccent[400]}
				>
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.greenAccent[400]}
				>
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.impureza
						? parseFloat(params.row.impureza).toFixed(2) + " %"
						: " - "}
				</Typography>
			)
		},
		{
			field: "parcelasNovas",
			headerName: "Parcela",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.parcelasNovas
						? params.row.parcelasNovas
							.toString()
							.replaceAll(",", " , ")
						: params.row.parcela
							? params.row.parcela
							: " - "}
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.op ? params.row.op : " - "}
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
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.ticket ? params.row.ticket : " - "}
				</Typography>
			)
		},
		{
			field: "observacoes",
			headerName: "Obs.",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.observacoes ? params.row.observacoes : " - "}
				</Typography>
			)
		},
		{
			field: "id",
			headerName: "Id",
			width: 130,
			headerAlign: "center",
			align: "center",
			renderCell: (params) => (
				<Typography
					sx={{ fontSize: defaultFontSize }}
					color={colors.primary[100]}
				>
					{params.row.id}
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
			<Dialog
				open={openModal}
				onClose={handleClose}
				fullScreen // <- deixa fullscreen
				PaperProps={{
					sx: {
						width: "100%",
						height: "100%",
						margin: 0,
						maxWidth: "100%",
						maxHeight: "100%",
					},
				}}
			>
				{modalData && (
					<Box
						sx={{
							width: "100%",
							height: "100%",
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<PrintRCLayout data={modalData} />
					</Box>
				)}
				{modalDataRc && (
					<Box
						sx={{
							width: "100%",
							height: "100%",
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<PrintPage data={modalDataRc} />
					</Box>
				)}
			</Dialog>

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
					// density="compact"
					rows={dataTableRev}
					columns={columns}
					components={{ Toolbar: CustomToolbar }}
					componentsProps={{ toolbar: { title: "Cargas" } }}
					className={classes.table}
				/>
			</Box>
		</Box>
	);
};

export default ReportTable;
