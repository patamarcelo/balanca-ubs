import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import ModalFormFields from "../modal-form-fields";
import Chip from '@mui/material/Chip';


export default function FormDialog(props) {
	const { handleCloseModal, isOpenModal, dataModal, handleCloseModalEsc, handleChangeTruck, truckValues } =
		props;
	
		

	return (
		<div>
			<Dialog
				open={isOpenModal}
				onClose={handleCloseModalEsc}
				sx={{
					"& .MuiPaper-root": {
						minWidth: "60vw !important"
					},
				}}
			>
				<DialogTitle>
					<Chip label={dataModal.title} color={dataModal.color} />
				</DialogTitle>
				<DialogContent
					sx={{
						padding: "20px",
						paddingTop: "20px !important",
						// backgroundColor: "red !important"
					}}
				>
					<ModalFormFields 
					handleChangeTruck={handleChangeTruck}
					truckValues={truckValues}/>
				</DialogContent>
				<DialogActions
				sx={{
				paddingTop: "20px"
				}}
				>
					<Button color="warning" onClick={handleCloseModal}>
						Cancelar
					</Button>
					<Button color="success" onClick={handleCloseModal}>
						Salvar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
