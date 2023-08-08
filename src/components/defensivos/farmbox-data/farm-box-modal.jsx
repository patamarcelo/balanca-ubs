import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "80%",
	height: "70vh",
	bgcolor: "background.paper",
	border: "2px solid #000",
	boxShadow: 24,
	p: 4
};

const ModalDataFarmbox = (props) => {
	const { handleClose, open } = props;

	return (
		<div>
			<Modal
				keepMounted
				open={open}
				onClose={handleClose}
				aria-labelledby="keep-mounted-modal-title"
				aria-describedby="keep-mounted-modal-description"
			>
				<Box sx={style}>
					<Typography
						id="keep-mounted-modal-title"
						variant="h6"
						component="h2"
					>
						TABELA COM OS DADOS DO FARMBOX
					</Typography>
					<Typography
						id="keep-mounted-modal-description"
						sx={{ mt: 2 }}
					>
						Duis mollis, est non commodo luctus, nisi erat porttitor
						ligula.
					</Typography>
				</Box>
			</Modal>
		</div>
	);
};

export default ModalDataFarmbox;
