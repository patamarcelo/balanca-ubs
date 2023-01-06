import { Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTruckMoving } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { IconButton } from "@mui/material";

import DateTruck from "./truck-date";
import PlateTruck from "./truck-plate";
import QuantityTruck from "./truck-quantity";
import QuantityTruckHold from "./truck-quantity-hold";
import CulturaTruck from "./truck-cultura";
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
	selectUnidadeOpUser
} from "../../../store/user/user.selector";

import toast from "react-hot-toast";

import useMediaQuery from "@mui/material/useMediaQuery";

const editarModal = {
	title: "Editar Carga",
	color: "warning",
	text: "formulário do carregamento formulário do carregamento formulário do carregamento formulário do carregamento "
};

const HomeTableTruck = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const isBalanca = useSelector(selectIBalancaUser);
	const unidadeOpUser = useSelector(selectUnidadeOpUser);

	const isNonMobile = useMediaQuery("(min-width: 900px)");

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

	const table = useSelector(selectTruckLoadsOnWork(selectedUnitOp));

	const handlerDelete = (dataId, data) => {
		try {
			handleDeleteTruck(dataId, data);
			handlerSave(saved + 1);
			toast.success("Carga deletada com sucesso!!");
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
				return (
					<Box
						key={i}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						gap="10px"
						width="100%"
						sx={{
							width: isNonMobile ? "98%" : "95%",
							backgroundColor: colors.blueOrigin[800],
							// border: `0.1px solid ${colors.primary[100]}`,
							borderRadius: "5px",
							padding: "10px"
						}}
					>
						<Box>
							{data.tipo === "carregando" ? (
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
							)}
						</Box>
						<Box
							display="flex"
							flexDirection={!isNonMobile ? "column" : "row"}
							alignSelf="stretch"
							alignItems="center"
							justifyContent="space-between"
							sx={{
								// backgroundColor: 'red',
								flex: 0.8,
								maxWidth: "90%"
							}}
						>
							<DateTruck entrada={data.entrada} />
							<PlateTruck data={data} />
							<QuantityTruck data={data} />
							<QuantityTruckHold data={data} />
							{data.cultura && <CulturaTruck data={data} />}
							{data.origem && <OrigemTruck data={data} />}
							{data.destino && <DestinoTruck data={data} />}
						</Box>
						<Box display="flex" sx={{ cursor: "pointer" }}>
							<IconButton
								disabled={!isBalanca || !disableInput}
								aria-label="edit"
								onClick={() =>
									handleOpenModal(editarModal, data)
								}
							>
								<FontAwesomeIcon
									icon={faPenToSquare}
									color={
										!isBalanca || !disableInput
											? colors.grey[600]
											: colors.yellow[600]
									}
									size="1x"
								/>
							</IconButton>
							<IconButton
								disabled={!isBalanca || !disableInput}
								aria-label="delete"
								onClick={() => handlerDelete(data.id, data)}
							>
								<FontAwesomeIcon
									icon={faTrashCan}
									color={
										!isBalanca || !disableInput
											? colors.grey[600]
											: colors.redAccent[600]
									}
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
