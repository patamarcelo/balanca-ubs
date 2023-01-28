import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import FormDialog from "../../../components/home-itens/modal-form-truck";

import { useState } from "react";
import { TRUCK_INITIAL_STATE } from "../../../store/trucks/reducer.initials";

const EditModal = () => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const [isOpenModal, setIsOpenModal] = useState(false);
	const [truckValues, setTruckValues] = useState(TRUCK_INITIAL_STATE);
	const [saved, handlerSave] = useState(0);

	const [dataModal, setDataModal] = useState({
		title: "",
		text: ""
	});

	const handleCloseModal = (e) => {
		setTruckValues(TRUCK_INITIAL_STATE);
		setIsOpenModal(false);
	};
	const handleCloseModalEsc = (event) => {
		if (event.type === "keydown" && event.key === "Escape") {
			setIsOpenModal(false);
			setTruckValues(TRUCK_INITIAL_STATE);
		}
	};

	const handleChangeTruck = (e) => {
		setTruckValues({ ...truckValues, [e.target.name]: e.target.value });
	};

	const handleBlurTruck = (e) => {
		const pesoBruto = truckValues["pesoBruto"];
		const tara = truckValues["tara"];
		if (["pesoBruto", "tara"].includes(e.target.name)) {
			if (pesoBruto > 0 && tara > 0) {
				const liquido = pesoBruto - tara;
				if (liquido < 0) {
					setTruckValues({
						...truckValues,
						liquido: "Valor Negativo, verificar"
					});
					console.log("valor negativo");
				} else {
					setTruckValues({ ...truckValues, liquido: liquido });
				}
			} else {
				setTruckValues({ ...truckValues, liquido: "" });
			}
		}
	};

	return (
		<Box
			display="flex"
			flexDirection="column"
			gap="20px"
			sx={{
				width: "100%",
				height: "100%",
				border: colors.blueAccent[800]
				// border: "1px solid white"
			}}
		>
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
		</Box>
	);
};

export default EditModal;
