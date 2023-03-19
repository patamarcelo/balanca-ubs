import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

// import { useState } from "react";

const ModalOrdemPage = (props) => {
	const theme = useTheme();
	const colors = tokens(theme.palette.mode);
	const { data } = props;

	return (
		<Box
			display="flex"
			justifyContent="space-around"
			flexDirection="column"
			alignItems="center"
			gap="30px"
			mt={1}
			sx={{
				width: "100%",
				height: "80%",
				// backgroundColor: colors.blueOrigin[700],
				borderRadius: "8px",
				border: "1px solid red",
				padding: "12px"
			}}
		>
			{/* ORIGEM E DESTINO */}
			<Box
				display="flex"
				justifyContent="space-around"
				alignItems="start"
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Data:
					</Typography>
					<Typography
						variant="h6"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.data}
					</Typography>
				</Box>
			</Box>
			{/* ORIGEM E DESTINO */}
			<Box
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Origem:
					</Typography>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.origem}
					</Typography>
				</Box>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Destino:
					</Typography>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.destino}
					</Typography>
				</Box>
			</Box>
			{/* PLACA / MOTORISTA*/}

			<Box
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Placa:
					</Typography>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.placaTrator}
						{data?.placaVagao1 ? " | " + data.placaVagao1 : null}
						{data?.placaVagao2 ? " | " + data.placaVagao2 : null}
					</Typography>
				</Box>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Motorista:
					</Typography>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.motorista}
					</Typography>
				</Box>
			</Box>
			{/* Peso / Produto*/}
			<Box
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Produto:
					</Typography>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.mercadoria}
					</Typography>
				</Box>
				<Box
					display="flex"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Peso:
					</Typography>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ marginLeft: "5px" }}
					>
						{data.veiculo.toLocaleString("en").replace(",", ".") +
							" Kg"}
					</Typography>
				</Box>
			</Box>
			{/* Peso / Produto*/}
			<Box
				display="flex"
				justifyContent="space-around"
				alignItems="center"
				sx={{
					width: "100%"
				}}
			>
				<Box
					display="flex"
					flexDirection="column"
					gap="10px"
					sx={{
						width: "100%"
					}}
				>
					<Typography
						variant="h5"
						color={colors.primary[700]}
						sx={{ fontWeight: "bold" }}
					>
						Observações:
					</Typography>
					<Box
						sx={{
							width: "100%",
							border: `0.5px solid ${colors.primary[300]}`,
							minHeight: "60px",
							borderRadius: "8px",
							padding: "10px 3px"
						}}
					>
						<Typography
							variant="h6"
							color={colors.primary[700]}
							sx={{ marginLeft: "5px" }}
						>
							{data.observacao}
						</Typography>
					</Box>
				</Box>
			</Box>
		</Box>
	);
};

export default ModalOrdemPage;
