import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import FormDialog from "../../../components/home-itens/modal-form-truck";

import { useState, useEffect } from "react";

const EditModal = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const {
		dataTruck,
		setDataTruck,
		isOpenModal,
		setIsOpenModal,
		TRUCK_INITIAL_STATE
	} = props;

	const [saved, handlerSave] = useState(0);

	const [dataModal, setDataModal] = useState({
		title: "Editar Carga - Full",
		text: "",
		color: "warning"
	});

	useEffect(() => {
		console.log("TruckValuesUP: ", dataTruck);
	}, [dataTruck]);

	const handleCloseModal = (e) => {
		setDataTruck(TRUCK_INITIAL_STATE);
		setIsOpenModal(false);
	};
	const handleCloseModalEsc = (event) => {
		if (event.type === "keydown" && event.key === "Escape") {
			setIsOpenModal(false);
			setDataTruck(TRUCK_INITIAL_STATE);
		}
	};

	const handleChangeTruck = (e) => {
		setDataTruck({ ...dataTruck, [e.target.name]: e.target.value });
	};

	const handleBlurTruck = (e) => {
		const pesoBruto = dataTruck["pesoBruto"];
		const tara = dataTruck["tara"];
		if (["pesoBruto", "tara"].includes(e.target.name)) {
			if (pesoBruto > 0 && tara > 0) {
				const liquido = pesoBruto - tara;
				if (liquido < 0) {
					setDataTruck({
						...dataTruck,
						liquido: "Valor Negativo, verificar"
					});
					console.log("valor negativo");
				} else {
					setDataTruck({ ...dataTruck, liquido: liquido });
				}
			} else {
				setDataTruck({ ...dataTruck, liquido: "" });
			}
		}
	};

	return (
		<FormDialog
			isOpenModal={isOpenModal}
			handleCloseModal={handleCloseModal}
			dataModal={dataModal}
			handleCloseModalEsc={handleCloseModalEsc}
			handleChangeTruck={handleChangeTruck}
			handleBlurTruck={handleBlurTruck}
			truckValues={dataTruck}
			setTruckValues={setDataTruck}
			handlerSave={handlerSave}
			saved={saved}
		/>
	);
};

export default EditModal;
