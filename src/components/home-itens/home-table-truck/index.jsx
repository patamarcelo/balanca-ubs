import { Box, Typography, useTheme, Stack, Avatar } from "@mui/material";
import { tokens } from "../../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faLaptop, faMobileScreenButton } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";

import DateTruck from "./truck-date";
import PlateTruck from "./truck-plate";
import QuantityTruckTara from "./truck-quantity-tara";
import QuantityTruckBruto from "./truck-quantity-bruto";
import MercadoriaTruck from "./truck-mercadoria";
import OrigemTruck from "./truck-origem";
import DestinoTruck from "./truck-destino";

import FormDialog from "../../../components/home-itens/modal-form-truck";

import { handleDeleteTruck } from "../../../utils/firebase/firebase.datatable";

import { useSelector } from "react-redux";
import {
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

				const classesTruck = ` ${setColorTruck(data) === colors.greenAccent[600]
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
							border:
								theme.palette.mode === "dark"
									? ""
									: `0.1px solid ${colors.primary[100]}`,
							boxShadow: "rgba(0, 0, 0, 0.65) 0px 5px 5px",
							borderRadius: "5px",
							padding: "10px",
							"&:hover": {
								background: colors.blueOrigin[900],
								border: "1px solid black"
								// cursor: "pointer"
							}
						}}
					>
						<Box
							className={classes["changeTruck"]}
							display="flex"
							gridTemplateColumns="repeat(2, 1fr)"
							justifyContent="space-around"
							alignItems="center"
							flexDirection={!isNonMobile ? "column" : "row"}
							sx={{
								// backgroundColor: "red",
								width: "9%",
								marginLeft: !isNonMobile ? '25px' : "12px"
							}}
						>
							{data?.createdBy === "App" ? (
								<LightTooltip
									title={
										<Stack
											direction="column"
											spacing={0.8}
											sx={{ p: 0.5, minWidth: 180 }}
										>
											{/* Cabeçalho com avatar e usuário */}
											<Stack direction="row" spacing={1} alignItems="center">
												<Avatar
													sx={{
														width: 24,
														height: 24,
														bgcolor: "primary.main",
														fontSize: 11,
													}}
												>
													{data?.user?.[0]?.toUpperCase()}
												</Avatar>
												<Typography
													variant="body2"
													sx={{ fontWeight: 500, fontSize: "0.8rem", lineHeight: 1 }}
												>
													{data?.userCreateDoc}
												</Typography>
											</Stack>

											{/* Lista das parcelas (ordenada e com quebras de linha) */}
											<Typography
												variant="body2"
												sx={{
													fontSize: "0.8rem",
													lineHeight: 1.2,
													whiteSpace: "pre-line",
													color: "text.secondary",
												}}
											>
												{data?.parcelasNovas
													?.sort((a, b) => a.localeCompare(b))
													?.join(", ")}
											</Typography>
										</Stack>
									}
									placement="top"
									arrow
									TransitionComponent={Zoom}
									componentsProps={{
										tooltip: {
											sx: {
												p: 0.6,
												borderRadius: 1,
												fontSize: "0.8rem",
												maxWidth: 260,
											},
										},
									}}
								>

									<div style={{ position: "relative", display: "inline-block" }}>
										<FontAwesomeIcon
											color={setColorTruck(data)}
											icon={faTruckMoving}
											size="3x"
											className={classesTruck}
											style={{
												cursor: "pointer",
												filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
											}}
											onClick={() => handlerNavigatePrint(data)}
										/>

										{/* laptop sobreposto */}
										<FontAwesomeIcon
											icon={faMobileScreenButton}
											size="sm"
											style={{
												position: "absolute",
												bottom: 2,       // ajusta verticalmente
												right: -8,        // ou left dependendo do visual desejado
												zIndex: 10,      // garante que fica à frente
												color: "rgba(255,255,255,0.9)", // contraste
												textShadow: "0 0 3px rgba(0,0,0,0.6)",
											}}
										/>
									</div>
								</LightTooltip>
							) : (
								<LightTooltip
									title={
										<Stack
											direction="row"
											spacing={1}
											alignItems="center"
											sx={{ p: 0.2, minHeight: 28 }}
										>
											<Avatar
												sx={{
													width: 24,
													height: 24,
													bgcolor: "primary.main",
													fontSize: 11,
												}}
											>
												{data?.user?.[0]?.toUpperCase()}
											</Avatar>
											<Typography
												variant="body2"
												sx={{ fontWeight: 500, fontSize: "0.8rem", lineHeight: 1 }}
											>
												{data?.user}
											</Typography>
										</Stack>
									}
									placement="top"
									arrow
									TransitionComponent={Zoom}
									componentsProps={{
										tooltip: {
											sx: {
												bgcolor: "background.paper",
												color: "text.primary",
												boxShadow: 2,
												border: "1px solid",
												borderColor: "divider",
											},
										},
									}}
								>
									<div style={{ position: "relative", display: "inline-block" }}>
										<FontAwesomeIcon
											color={setColorTruck(data)}
											icon={faTruckMoving}
											size="3x"
											className={classesTruck}
											style={{
												filter: "drop-shadow(3px 5px 2px rgb(0 0 0 / 0.4))",
												cursor: "pointer",
											}}
											onClick={() => handlerNavigatePrint(data)}
										/>

										{/* Ícone de celular sobreposto */}
										<FontAwesomeIcon
											icon={faLaptop}
											size="sm"
											style={{
												position: "absolute",
												bottom: 0,      // ajusta verticalmente
												right: -8,       // ou left dependendo do lado desejado
												zIndex: 10,
												color: "rgba(255,255,255,0.9)",
												textShadow: "0 0 3px rgba(0,0,0,0.6)",
											}}
										/>
									</div>
								</LightTooltip>
							)}
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

							{/* <Typography sx={{fontSize: '8px'}} color={colors.grey[100]}>{data.userDataApp && data.userDataApp}</Typography> */}
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
							{(data.mercadoria || data.parcelasObjFiltered) ? (
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
									if (!isBalanca || (data?.codTicketPro && data?.filialPro && !isAdminUser)) {
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
