import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";

import DateTruck from "./truck-date";
import PlateTruck from "./truck-plate";
import QuantityTruckTara from "./truck-quantity-tara";
import QuantityTruckBruto from "./truck-quantity-bruto";
import QuantityTruckHold from "./truck-quantity-hold";
import MercadoriaTruck from "./truck-mercadoria";
import OrigemTruck from "./truck-origem";
import DestinoTruck from "./truck-destino";

import FormDialog from "../../../components/home-itens/modal-form-truck";

import { handleDeleteTruck } from "../../../utils/firebase/firebase.datatable";

import { useSelector } from "react-redux";
import {
	selectTruckLoads,
	selectTruckLoadsOnWork
} from "../../../store/trucks/trucks.selector";

import {
	selectIBalancaUser,
	selectUnidadeOpUser,
	selectIsAdminUser
} from "../../../store/user/user.selector";

import toast from "react-hot-toast";

import useMediaQuery from "@mui/material/useMediaQuery";

import { FAZENDA_ORIGEM } from "../../../store/trucks/reducer.initials";

import { useNavigate } from "react-router-dom";

import classes from "./index.module.css";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Zoom from "@mui/material/Zoom";
import EmptyField from "./EmptyString";

const editarModal = {
	title: "Editar Carga",
	color: "warning",
	text: "formulário do carregamento formulário do carregamento formulário do carregamento formulário do carregamento "
};

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

const HomeTableTruck = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isBalanca = useSelector(selectIBalancaUser);
	const isAdminUser = useSelector(selectIsAdminUser);
	const unidadeOpUser = useSelector(selectUnidadeOpUser);

	const isNonMobile = useMediaQuery("(min-width: 900px)");

	const navigate = useNavigate();

	const handlerNavigatePrint = (data) => {
		navigate("/rcprint", { state: { data: data } });
	};

	const {
		saved,
		handlerSave,
		isOpenModal,
		handleCloseModal,
		dataModal,
		handleCloseModalEsc,
		handleChangeTruck,
		handleBlurTruck,
		truckValues,
		setTruckValues,
		handleOpenModal,
		selectedUnitOp
	} = props;

	const origemDest = [];
	const filteredOrigemDestino = FAZENDA_ORIGEM.filter(
		(data) => data.user === selectedUnitOp
	);
	filteredOrigemDestino.map((data) => {
		origemDest.push(data.local);
		return data;
	});

	const table = useSelector(selectTruckLoadsOnWork(selectedUnitOp));

	const handlerDelete = (dataId, data) => {
		try {
			handleDeleteTruck(dataId, data);
			handlerSave(saved + 1);
		} catch (error) {
			console.log("Erro ao Deletar a Carga: ", data.id);
		}
	};

	return (
		<>
			<FormDialog
				isOpenModal={isOpenModal}
				handleCloseModal={handleCloseModal}
				dataModal={dataModal}
				handleCloseModalEsc={handleCloseModalEsc}
				handleChangeTruck={handleChangeTruck}
				handleBlurTruck={handleBlurTruck}
				truckValues={truckValues}
				setTruckValues={setTruckValues}
				handlerSave={handlerSave}
				saved={saved}
			/>
			{table.map((data, i) => {
				const unidadeOpTable = data.unidadeOp ? data.unidadeOp : "ubs";
				const disableInput = unidadeOpUser === unidadeOpTable;

				const setColorTruck = (data) => {
					let color;
					if (origemDest.includes(data.fazendaOrigem)) {
						color = colors.greenAccent[600];
						return color;
					}
					if (origemDest.includes(data.fazendaDestino)) {
						color = colors.redAccent[600];
						return color;
					}
					color = colors.primary[300];
					return color;
				};

				const classesTruck = ` ${
					setColorTruck(data) === colors.greenAccent[600]
						? "fa-flip-horizontal"
						: ""
				} ${classes["hover-truck"]}`;

				return (
					<Box
						key={i}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						gap="1px"
						width="100%"
						sx={{
							width: isNonMobile ? "98%" : "95%",
							backgroundColor: colors.blueOrigin[800],
							// border: `0.1px solid ${colors.primary[100]}`,
							boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px",
							borderRadius: "5px",
							padding: "10px",
							"&:hover": {
								background: colors.blueOrigin[900],
								border: '1px solid black',
								// cursor: "pointer"
							}
						}}
					>
						<Box
							className={classes["changeTruck"]}
							display="flex"
							justifyContent="space-around"
							alignItems="center"
							flexDirection={!isNonMobile ? "column" : "row"}
							sx={{
								// backgroundColor: "red",
								width: "9%",
								marginLeft: "25px"
							}}
						>
							<LightTooltip
								title="Romaneio"
								placement="top"
								arrow
								TransitionComponent={Zoom}
							>
								<FontAwesomeIcon
									color={setColorTruck(data)}
									icon={faTruckMoving}
									size="3x"
									className={classesTruck}
									style={{
										cursor: "pointer",
										filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
									}}
									onClick={() => handlerNavigatePrint(data)}
								/>
							</LightTooltip>
							<Typography
								variant="h6"
								color={colors.redAccent[200]}
								sx={{
									margin: "2px 10px"
								}}
							>
								{data.relatorioColheita}
							</Typography>
							{/* {data.tipo === "carregando" ? (
								<FontAwesomeIcon
									color={colors.greenAccent[600]}
									icon={faTruckMoving}
									size="3x"
									className="fa-flip-horizontal"
								/>
							) : (
								<FontAwesomeIcon
									color={colors.redAccent[600]}
									icon={faTruckMoving}
									size="3x"
								/>
							)} */}
						</Box>
						<Box
							display={!isNonMobile ? "flex" : "grid"}
							gridTemplateColumns="repeat(7,1fr)"
							flexDirection={!isNonMobile ? "column" : "row"}
							alignSelf="stretch"
							alignItems="center"
							justifyContent="space-between"
							sx={{
								// backgroundColor: 'red',
								flex: 0.95,
								maxWidth: "100%"
							}}
						>
							<DateTruck entrada={data.entrada} data={data} />
							<PlateTruck data={data} />
							<QuantityTruckTara data={data} />
							<QuantityTruckBruto data={data} />
							{/* <QuantityTruckHold data={data} /> */}
							{data.mercadoria ? (
								<MercadoriaTruck data={data} />
							) : (
								<EmptyField />
							)}
							{data.origem || data.fazendaOrigem ? (
								<OrigemTruck data={data} />
							) : (
								<EmptyField />
							)}
							{data.destino || data.fazendaDestino ? (
								<DestinoTruck data={data} />
							) : (
								<EmptyField />
							)}
						</Box>
						<Box display="flex" sx={{ cursor: "pointer" }}>
							<IconButton
								// disabled={!isBalanca || !disableInput}
								aria-label="edit"
								sx={{
									filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
								}}
								onClick={() => {
									if (!isBalanca) {
										toast.error(`Usuário Sem Permissão`, {
											position: "top-center"
										});
										return;
									}
									handleOpenModal(editarModal, data);
								}}
							>
								<FontAwesomeIcon
									icon={faPenToSquare}
									color={colors.yellow[600]}
									size="1x"
								/>
							</IconButton>
							<IconButton
								// disabled={!isBalanca || !disableInput}
								aria-label="delete"
								sx={{
									filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))"
								}}
								onClick={() => {
									if (!isBalanca || !isAdminUser) {
										toast.error(`Usuário Sem Permissão`, {
											position: "top-center"
										});
										return;
									}
									handlerDelete(data.id, data);
								}}
							>
								<FontAwesomeIcon
									icon={faTrashCan}
									color={colors.redAccent[600]}
									// color={
									// 	!isBalanca || !disableInput
									// 		? colors.grey[600]
									// 		: colors.redAccent[600]
									// }
									size="1x"
								/>
							</IconButton>
						</Box>
					</Box>
				);
			})}
		</>
	);
};

export default HomeTableTruck;
