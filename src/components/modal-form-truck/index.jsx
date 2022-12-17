import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog(props) {
    const { handleCloseModal, isOpenModal, dataModal } = props

	
	return (
		<div>
			<Dialog open={isOpenModal} onClose={handleCloseModal}>
				<DialogTitle>{dataModal.title}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{dataModal.text}
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="name"
						label="Email Address"
						type="email"
						fullWidth
						variant="standard"
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleCloseModal}>Cancel</Button>
					<Button onClick={handleCloseModal}>Subscribe</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
