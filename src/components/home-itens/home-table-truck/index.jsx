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
import CulturaTruck from "./truck-cultura";
import OrigemTruck from "./truck-origem";

import FormDialog from "../../../components/home-itens/modal-form-truck";

import { handleDeleteTruck } from "../../../utils/firebase/firebase.datatable";

import { useSelector } from "react-redux";
import { selectTruckLoads } from "../../../store/trucks/trucks.selector";

const editarModal = {
	title: "Editar Carga",
	color: "warning",
	text: "formulário do carregamento formulário do carregamento formulário do carregamento formulário do carregamento "
};

const HomeTableTruck = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const table = useSelector(selectTruckLoads);
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
		handleOpenModal
	} = props;

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
				return (
					<Box
						key={i}
						display="flex"
						justifyContent="space-between"
						alignItems="center"
						gap="10px"
						width="100%"
						sx={{
							width: "98%",
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
							alignSelf="stretch"
							alignItems="center"
							justifyContent="space-evenly"
							sx={{
								// backgroundColor: 'red',
								flex: 0.8,
								maxWidth: "90%"
							}}
						>
							<DateTruck entrada={data.entrada} />
							<PlateTruck data={data} />
							<QuantityTruck data={data} />
							{data.cultura && <CulturaTruck data={data} />}
							{data.origem && <OrigemTruck data={data} />}
						</Box>
						<Box display="flex" sx={{ cursor: "pointer" }}>
							<IconButton
								aria-label="edit"
								onClick={() => handleOpenModal(editarModal, data)}
							>
								<FontAwesomeIcon
									icon={faPenToSquare}
									color={colors.yellow[600]}
									size="1x"
								/>
							</IconButton>
							<IconButton
								aria-label="delete"
								onClick={() => handlerDelete(data.id, data)}
							>
								<FontAwesomeIcon
									icon={faTrashCan}
									color={colors.redAccent[600]}
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
