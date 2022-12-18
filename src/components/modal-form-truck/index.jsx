import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ModalFormFields from "../modal-form-fields";
import Chip from "@mui/material/Chip";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

import { addTruckMove } from "../../utils/firebase/firebase.datatable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../store/user/user.selector";

export default function FormDialog(props) {
	const user = useSelector(selectCurrentUser);
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const {
		handleCloseModal,
		isOpenModal,
		dataModal,
		handleCloseModalEsc,
		handleChangeTruck,
		truckValues,
		handleBlurTruck,
		setTruckValues
	} = props;

	const handleSaveData = async () => {
		console.log(truckValues);
		const {
			cultura,
			data,
			impureza,
			liquido,
			mercadoria,
			motorista,
			origem,
			pesoBruto,
			placa,
			projeto,
			saida,
			tara,
			tipo,
			umidade
		} = truckValues;
		try {
			const newTrans = await addTruckMove(
				user.email,
				data,
				pesoBruto,
				tara,
				liquido,
				cultura,
				placa,
				umidade,
				mercadoria,
				origem,
				impureza,
				projeto,
				motorista,
				saida,
				tipo
			);
			if (newTrans) {
				handleCloseModal();
			}
		} catch (error) {
			console.log("erro ao salvar a transação");
		}
	};

	return (
		<div>
			<Dialog
				open={isOpenModal}
				onClose={handleCloseModalEsc}
				sx={{
					"& .MuiPaper-root": {
						minWidth: "60vw !important"
					},
					"& .MuiChip-root": {
						borderRadius: 1
					}
				}}
			>
				<DialogTitle>
					<Chip
						label={dataModal.title}
						color={dataModal.color}
						sx={{
							fontWeight: "bold",
							fontSize: "14px",
							color: "white",
							"& .MuiChip-label": {
								textTransform: "uppercase"
							}
						}}
					/>
				</DialogTitle>
				<DialogContent
					sx={{
						padding: "20px",
						paddingTop: "20px !important"
						// backgroundColor: "red !important"
					}}
				>
					<ModalFormFields
						handleChangeTruck={handleChangeTruck}
						truckValues={truckValues}
						handleBlurTruck={handleBlurTruck}
						setTruckValues={setTruckValues}
					/>
				</DialogContent>
				<DialogActions
					sx={{
						paddingTop: "20px"
					}}
				>
					<Button color="warning" onClick={handleCloseModal}>
						Cancelar
					</Button>
					<Button
						onClick={handleSaveData}
						sx={{
							backgroundColor: colors.greenAccent[600],
							color: "white"
						}}
					>
						Salvar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
