import * as React from "react";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import ModalOrdemPage from "../modal-ordem-page";

const OrdemModal = (props) => {
	const { isOpenModal, setIsOpenModal, dataModal } = props;
	const handleClose = () => setIsOpenModal(false);

	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: 800,
		height: 600,
		bgcolor: colors.primary[100],
		color: "black",
		border: "2px solid #000",
		boxShadow: 24,
		p: 3
	};

	return (
		<div>
			<Modal
				aria-labelledby="transition-modal-title"
				aria-describedby="transition-modal-description"
				open={isOpenModal}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={isOpenModal}>
					<Box sx={style}>
						<Typography
							id="transition-modal-title"
							variant="h3"
							component="h2"
							sx={{
								textAlign: "center",
								fontWeight: "bold",
								marginBottom: "70px"
							}}
						>
							ORDEM DE CARREGAMENTO
						</Typography>

						<ModalOrdemPage data={dataModal} />
					</Box>
				</Fade>
			</Modal>
		</div>
	);
};

export default OrdemModal;
