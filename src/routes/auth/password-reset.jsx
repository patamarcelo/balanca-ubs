import { Box, Typography, useTheme } from "@mui/material";
import { triggerResetEmail } from "../../utils/firebase/firebase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import toast from 'react-hot-toast';

import { tokens } from "../../theme";

const PassswordReset = () => {
	const [open, setOpen] = useState(false);
	const [email, setEmail] = useState("");
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);

	const handleReset = () => {
		setOpen(true);
	};

	const handleClose = (e) => {
		e.stopPropagation();
		setOpen(false);
	};

	const handleSendReset = async () => {
		try {
			await triggerResetEmail(email).then(data => console.log(data))
			setEmail('')
			setOpen(false);
			toast.success('Email de redefinição enviado!!');
		} catch (error) {
			toast.error(`Erro ao enviar o Email: ${error}`);

		}
	}

	const handleChangeMail = (e) => {
		setEmail(e.target.value)
	}

	return (
		<Box
			displa="flex"
			justifyContent="center"
			sx={{
				marginTop: "20px",
				cursor: "pointer"
			}}
			onClick={handleReset}
		>
			<Typography
				variant="h6"
				color="yellow"
				style={{ textDecoration: "underline" }}
			>
				Esqueci minha senha
			</Typography>
			<Dialog open={open} onClose={handleClose}>
				<DialogTitle>Redefinir a Senha</DialogTitle>
				<DialogContent>
					<DialogContentText>
						Insira seu e-mail de cadastro para resetar a senha, um
						email será enviado com um link para redefinição. Por
						favor verifcar se não foi para o spam.
					</DialogContentText>
					<TextField
						autoFocus
						margin="dense"
						id="email"
						label="E-mail"
						type="email"
						fullWidth
						variant="standard"
						onChange={handleChangeMail}
						sx={{
							"& .MuiInputLabel-root": { color: "#777" }, // cor padrão
							"& .MuiInputLabel-root.Mui-focused": { color: 'whitesmoke' }, // cor quando focado
							"& .MuiInput-underline:before": { borderBottomColor: colors.blueOrigin[200] }, // linha padrão
							"& .MuiInput-underline:after": { borderBottomColor: colors.blueOrigin[500] }, // linha quando focado
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button color="warning" onClick={handleClose}>Cancelar</Button>
					<Button color="success" onClick={handleSendReset}>Redefinir</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};

export default PassswordReset;
